import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const applicationId = req.nextUrl.searchParams.get("applicationId")
  if (!applicationId) {
    return NextResponse.json({ error: "Missing applicationId" }, { status: 400 })
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId, userId: session.user.id },
    include: { agents: true, deliverables: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(application)
}
