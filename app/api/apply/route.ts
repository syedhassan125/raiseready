import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"

const AGENT_TYPES = [
  "STATEMENT_AUDITOR",
  "GL_RECONCILER",
  "MONTH_END_CLOSER",
  "MARKET_RESEARCHER",
  "EARNINGS_REVIEWER",
  "VALUATION_REVIEWER",
  "MODEL_BUILDER",
  "KYC_SCREENER",
  "PITCH_AGENT",
  "MEETING_PREP",
] as const

const AGENT_NAMES: Record<string, string> = {
  STATEMENT_AUDITOR: "Statement Auditor",
  GL_RECONCILER: "GL Reconciler",
  MONTH_END_CLOSER: "Month-End Closer",
  MARKET_RESEARCHER: "Market Researcher",
  EARNINGS_REVIEWER: "Earnings Reviewer",
  VALUATION_REVIEWER: "Valuation Reviewer",
  MODEL_BUILDER: "Model Builder",
  KYC_SCREENER: "KYC Screener",
  PITCH_AGENT: "Pitch Agent",
  MEETING_PREP: "Meeting Prep Agent",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, startupName, website, industry, stage, amountRaising, description } = body

    if (!email || !password || !startupName || !industry || !stage || !amountRaising) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
        applications: {
          create: {
            startupName,
            website: website || null,
            industry,
            stage,
            amountRaising,
            description: description || null,
            status: "PENDING",
            agents: {
              create: AGENT_TYPES.map((type) => ({
                agentName: AGENT_NAMES[type],
                agentType: type,
                status: "QUEUED",
              })),
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    console.error("Apply error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
