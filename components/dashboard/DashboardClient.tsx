"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

const AGENT_CONFIG = [
  { type: "STATEMENT_AUDITOR", name: "Statement Auditor", description: "Reviewing financial statements", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { type: "GL_RECONCILER", name: "GL Reconciler", description: "Reconciling general ledger", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" },
  { type: "MONTH_END_CLOSER", name: "Month-End Closer", description: "Bringing accounts current", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { type: "MARKET_RESEARCHER", name: "Market Researcher", description: "Analysing sector & competitors", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { type: "EARNINGS_REVIEWER", name: "Earnings Reviewer", description: "Reviewing historical performance", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { type: "VALUATION_REVIEWER", name: "Valuation Reviewer", description: "Building valuation analysis", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { type: "MODEL_BUILDER", name: "Model Builder", description: "Building DCF & financial model", icon: "M3 10h18M3 14h18M10 3v18M14 3v18" },
  { type: "KYC_SCREENER", name: "KYC Screener", description: "Preparing compliance package", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { type: "PITCH_AGENT", name: "Pitch Agent", description: "Drafting investor deck & CIM", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
  { type: "MEETING_PREP", name: "Meeting Prep Agent", description: "Preparing investor Q&A", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
]

type Status = "QUEUED" | "IN_PROGRESS" | "COMPLETED"

interface AgentJob {
  agentType: string
  status: Status
  completedAt: Date | null
  outputUrl: string | null
}

interface Deliverable {
  id: string
  name: string
  type: string
  fileUrl: string | null
  isReady: boolean
}

interface Application {
  id: string
  startupName: string
  stage: string
  amountRaising: string
  status: string
  createdAt: Date
  agents: AgentJob[]
  deliverables: Deliverable[]
}

interface User {
  name?: string | null
  email?: string | null
}

function getAgentStatus(agents: AgentJob[], type: string): Status {
  return agents.find((a) => a.agentType === type)?.status ?? "QUEUED"
}

function getAgentOutput(agents: AgentJob[], type: string): string | null {
  return agents.find((a) => a.agentType === type)?.outputUrl ?? null
}

function completedCount(agents: AgentJob[]) {
  return agents.filter((a) => a.status === "COMPLETED").length
}

function progressPercent(agents: AgentJob[]) {
  if (!agents.length) return 0
  return Math.round((completedCount(agents) / 10) * 100)
}

function getEta(createdAt: Date) {
  const eta = new Date(new Date(createdAt).getTime() + 72 * 60 * 60 * 1000)
  const now = new Date()
  const diff = eta.getTime() - now.getTime()
  if (diff <= 0) return "Completing soon"
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${mins}m remaining`
}

export default function DashboardClient({
  application: initialApplication,
  user,
}: {
  application: Application | null
  user: User
}) {
  const router = useRouter()
  const [application, setApplication] = useState(initialApplication)
  const [launching, setLaunching] = useState(false)
  const [selectedReport, setSelectedReport] = useState<{ name: string; content: string } | null>(null)

  const progress = application ? progressPercent(application.agents) : 0
  const completed = application ? completedCount(application.agents) : 0
  const isRunning = application?.status === "IN_PROGRESS"
  const isComplete = application?.status === "COMPLETED"

  const fetchLatest = useCallback(async () => {
    if (!application?.id) return
    const res = await fetch(`/api/agents/status?applicationId=${application.id}`)
    if (res.ok) {
      const data = await res.json()
      setApplication(data)
    }
  }, [application?.id])

  // Poll every 4 seconds while agents are running
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(fetchLatest, 4000)
    return () => clearInterval(interval)
  }, [isRunning, fetchLatest])

  async function launchAgents() {
    if (!application?.id) return
    setLaunching(true)
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: application.id }),
      })
      if (res.ok) {
        await fetchLatest()
      }
    } finally {
      setLaunching(false)
    }
  }

  return (
    <>
      <main className="bg-[#020617] min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-white/5 flex flex-col min-h-screen">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span className="font-bold text-white">RaiseReady</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", label: "Overview", active: true },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Deliverables", active: false },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Agent Status", active: false },
            ].map(({ icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name ?? "Founder"}</p>
                <p className="text-slate-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-8 py-10">
            {!application ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-white mb-3">No application yet</h2>
                <p className="text-slate-400 mb-8">Submit your application to get started.</p>
                <Link href="/apply" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer">
                  Apply Now
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{application.startupName}</h1>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{application.stage}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{application.amountRaising}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>Applied {new Date(application.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      isComplete ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : isRunning ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-white/5 border-white/10 text-slate-400"
                    }`}>
                      {isComplete ? "Complete" : isRunning ? "In Progress" : "Queued"}
                    </div>
                    {!isRunning && !isComplete && (
                      <button
                        onClick={launchAgents}
                        disabled={launching}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
                      >
                        {launching ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Launching...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Launch Agents
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress overview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="glass-card rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Overall Progress</p>
                    <p className="text-3xl font-bold gradient-text mb-3">{progress}%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Agents Complete</p>
                    <p className="text-3xl font-bold text-white">{completed}<span className="text-slate-500 text-lg">/10</span></p>
                    <p className="text-slate-500 text-xs mt-1">{isRunning ? "Running now..." : isComplete ? "All done" : "Waiting to start"}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-5">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">ETA</p>
                    <p className="text-lg font-bold text-white">{isComplete ? "Delivered" : getEta(new Date(application.createdAt))}</p>
                    <p className="text-slate-500 text-xs mt-1">72hr guaranteed</p>
                  </div>
                </div>

                {/* Agent status grid */}
                <div className="mb-8">
                  <h2 className="text-white font-semibold mb-4">Agent Status</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {AGENT_CONFIG.map((agent) => {
                      const status = getAgentStatus(application.agents, agent.type)
                      const output = getAgentOutput(application.agents, agent.type)
                      return (
                        <div
                          key={agent.type}
                          className={`glass-card rounded-xl p-4 flex items-center gap-4 ${status === "COMPLETED" && output ? "cursor-pointer hover:border-cyan-500/30" : ""}`}
                          onClick={() => {
                            if (status === "COMPLETED" && output) {
                              setSelectedReport({ name: agent.name, content: output })
                            }
                          }}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            status === "COMPLETED" ? "bg-green-500/15 border border-green-500/20" :
                            status === "IN_PROGRESS" ? "bg-cyan-500/15 border border-cyan-500/20" :
                            "bg-white/5 border border-white/5"
                          }`}>
                            <svg className={`w-4 h-4 ${
                              status === "COMPLETED" ? "text-green-400" :
                              status === "IN_PROGRESS" ? "text-cyan-400" : "text-slate-500"
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={agent.icon} />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{agent.name}</p>
                            <p className="text-slate-500 text-xs truncate">
                              {status === "IN_PROGRESS" ? "Working..." :
                               status === "COMPLETED" ? "Click to view report" :
                               agent.description}
                            </p>
                          </div>
                          <div className={`shrink-0 w-2 h-2 rounded-full ${
                            status === "COMPLETED" ? "bg-green-400" :
                            status === "IN_PROGRESS" ? "bg-cyan-400 animate-pulse" : "bg-slate-600"
                          }`} />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h2 className="text-white font-semibold mb-4">Deliverables</h2>
                  {application.deliverables.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 text-center">
                      <p className="text-slate-400 text-sm">
                        {isRunning ? "Reports will appear here as agents complete their work..." : "Launch the agents to generate your fundraising package."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {application.deliverables.map((d) => (
                        <div key={d.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{d.name}</p>
                            <p className="text-slate-500 text-xs">Report · Ready</p>
                          </div>
                          {d.isReady && d.fileUrl && (
                            <button
                              onClick={() => setSelectedReport({ name: d.name, content: d.fileUrl! })}
                              className="flex items-center gap-1.5 bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-cyan-500/25 transition-all cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Report viewer modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <h3 className="text-white font-semibold">{selectedReport.name}</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-strong:text-white
              prose-code:text-cyan-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
              prose-table:text-slate-300 prose-thead:border-white/20 prose-tr:border-white/10
              prose-th:text-white prose-th:font-semibold
              prose-li:text-slate-300 prose-ul:text-slate-300
              prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400
              prose-hr:border-white/10">
              <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
