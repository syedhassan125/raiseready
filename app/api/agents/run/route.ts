import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { AGENT_SYSTEM_PROMPTS, buildUserMessage, AgentContext } from "@/lib/agentPrompts"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const DELIVERABLE_NAMES: Record<string, string> = {
  STATEMENT_AUDITOR: "Financial Statement Audit Report",
  GL_RECONCILER: "General Ledger Reconciliation Report",
  MONTH_END_CLOSER: "Month-End Close Package",
  MARKET_RESEARCHER: "Market Research Report",
  EARNINGS_REVIEWER: "Earnings Quality Review",
  VALUATION_REVIEWER: "Valuation Analysis Report",
  MODEL_BUILDER: "Financial Model Summary",
  KYC_SCREENER: "KYC & Compliance Package",
  PITCH_AGENT: "Pitch Deck Script & CIM",
  MEETING_PREP: "Investor Meeting Prep Package",
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { applicationId } = await req.json()
  if (!applicationId) {
    return NextResponse.json({ error: "Missing applicationId" }, { status: 400 })
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId, userId: session.user.id },
    include: { agents: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  if (application.status === "IN_PROGRESS" || application.status === "COMPLETED") {
    return NextResponse.json({ error: "Agents already running or completed" }, { status: 409 })
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "IN_PROGRESS" },
  })

  const ctx: AgentContext = {
    startupName: application.startupName,
    industry: application.industry,
    stage: application.stage,
    amountRaising: application.amountRaising,
    description: application.description || `A ${application.stage} ${application.industry} startup`,
    website: application.website,
  }

  // Run agents in background — don't await
  runAgents(applicationId, application.agents, ctx)

  return NextResponse.json({ success: true, message: "Agents started" })
}

async function runAgents(
  applicationId: string,
  agents: { id: string; agentType: string }[],
  ctx: AgentContext
) {
  for (const agent of agents) {
    try {
      await prisma.agentJob.update({
        where: { id: agent.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      })

      const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.agentType]
      const userMessage = buildUserMessage(agent.agentType, ctx)
      if (!systemPrompt || !userMessage) continue

      const message = await client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      })

      const output = message.content[0].type === "text" ? message.content[0].text : ""

      await prisma.agentJob.update({
        where: { id: agent.id },
        data: { status: "COMPLETED", completedAt: new Date(), outputUrl: output },
      })

      await prisma.deliverable.create({
        data: {
          applicationId,
          name: DELIVERABLE_NAMES[agent.agentType] || agent.agentType,
          type: "REPORT",
          fileUrl: output,
          isReady: true,
        },
      })
    } catch (err) {
      console.error(`Agent ${agent.agentType} failed:`, err)
      await prisma.agentJob.update({
        where: { id: agent.id },
        data: { status: "QUEUED" },
      })
    }
  }

  // Mark application complete when all agents done
  const allDone = await prisma.agentJob.findMany({
    where: { applicationId },
  })
  const allCompleted = allDone.every((a) => a.status === "COMPLETED")
  if (allCompleted) {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "COMPLETED" },
    })
  }
}
