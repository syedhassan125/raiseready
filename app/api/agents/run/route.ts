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

  // Create a shared cloud environment for this run
  const env = await client.beta.environments.create({
    name: `raiseready-${applicationId.slice(-8)}`,
    config: { type: "cloud", networking: { type: "limited" } },
  })

  // Run agents in background — don't await
  runAgents(applicationId, application.agents, ctx, env.id)

  return NextResponse.json({ success: true, message: "Agents started" })
}

async function runAgents(
  applicationId: string,
  agents: { id: string; agentType: string }[],
  ctx: AgentContext,
  environmentId: string
) {
  for (const agentRecord of agents) {
    const systemPrompt = AGENT_SYSTEM_PROMPTS[agentRecord.agentType]
    const userMessage = buildUserMessage(agentRecord.agentType, ctx)
    if (!systemPrompt || !userMessage) continue

    let agentId: string | null = null

    try {
      await prisma.agentJob.update({
        where: { id: agentRecord.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      })

      // Create the managed agent
      const managedAgent = await client.beta.agents.create({
        name: `${agentRecord.agentType.toLowerCase()}-${applicationId.slice(-6)}`,
        model: "claude-opus-4-7",
        system: systemPrompt,
      })
      agentId = managedAgent.id

      // Create a session
      const agentSession = await client.beta.sessions.create({
        agent: managedAgent.id,
        environment_id: environmentId,
      })

      // Stream the response
      const stream = await client.beta.sessions.events.stream(agentSession.id)

      await client.beta.sessions.events.send(agentSession.id, {
        events: [{ type: "user.message", content: [{ type: "text", text: userMessage }] }],
      })

      let output = ""
      let errored = false

      for await (const event of stream) {
        if (event.type === "agent.message") {
          for (const block of (event as { content?: { type: string; text?: string }[] }).content || []) {
            if (block.type === "text" && block.text) output += block.text
          }
        }
        if (event.type === "session.error") {
          console.error(`Agent ${agentRecord.agentType} session error:`, (event as { error?: { message: string } }).error?.message)
          errored = true
          break
        }
        if (event.type === "session.status_idle") break
      }

      if (!errored && output) {
        await prisma.agentJob.update({
          where: { id: agentRecord.id },
          data: { status: "COMPLETED", completedAt: new Date(), outputUrl: output },
        })

        await prisma.deliverable.create({
          data: {
            applicationId,
            name: DELIVERABLE_NAMES[agentRecord.agentType] || agentRecord.agentType,
            type: "REPORT",
            fileUrl: output,
            isReady: true,
          },
        })
      } else {
        await prisma.agentJob.update({
          where: { id: agentRecord.id },
          data: { status: "QUEUED" },
        })
      }
    } catch (err) {
      console.error(`Agent ${agentRecord.agentType} failed:`, err)
      await prisma.agentJob.update({
        where: { id: agentRecord.id },
        data: { status: "QUEUED" },
      })
    } finally {
      // Archive the managed agent after use
      if (agentId) await client.beta.agents.archive(agentId).catch(() => {})
    }
  }

  // Archive the shared environment
  await client.beta.environments.archive(environmentId).catch(() => {})

  // Mark application complete if all agents done
  const allJobs = await prisma.agentJob.findMany({ where: { applicationId } })
  if (allJobs.every((a) => a.status === "COMPLETED")) {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "COMPLETED" },
    })
  }
}
