const deliverables = [
  {
    icon: "M3 10h18M3 14h18M10 3v18M14 3v18",
    name: "Financial Model",
    agent: "Model Builder",
    description: "Full 3-statement model, DCF valuation, LBO analysis and 5-year projections built in Excel.",
    tags: ["Excel", "DCF", "LBO"],
    size: "large",
  },
  {
    icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    name: "Pitch Deck",
    agent: "Pitch Agent",
    description: "Investor-ready PowerPoint with comps, market slides, team, financials and ask.",
    tags: ["PowerPoint", "CIM", "Deck"],
    size: "large",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    name: "Valuation Report",
    agent: "Valuation Reviewer",
    description: "Defensible valuation with peer comps, methodology review and price range.",
    tags: ["Comps", "Multiples"],
    size: "normal",
  },
  {
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    name: "Market Research",
    agent: "Market Researcher",
    description: "TAM/SAM/SOM analysis, competitive landscape, sector trends and market positioning.",
    tags: ["TAM/SAM", "Competitors"],
    size: "normal",
  },
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    name: "Statement Audit",
    agent: "Statement Auditor",
    description: "Financial statements reviewed for consistency, errors and audit-readiness.",
    tags: ["Audit", "Clean Books"],
    size: "normal",
  },
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    name: "KYC Package",
    agent: "KYC Screener",
    description: "Founder and entity verification package, compliance-ready for institutional investors.",
    tags: ["Compliance", "AML"],
    size: "normal",
  },
  {
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    name: "Investor Meeting Prep",
    agent: "Meeting Prep Agent",
    description: "Anticipated Q&A, talking points, objection handling and meeting briefing documents.",
    tags: ["Q&A", "Talking Points"],
    size: "normal",
  },
  {
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    name: "Earnings Analysis",
    agent: "Earnings Reviewer",
    description: "Historical performance narrative, KPI trends and management commentary for your sector.",
    tags: ["KPIs", "Narrative"],
    size: "normal",
  },
  {
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4-8 4s8 1.79 8 4",
    name: "GL Reconciliation",
    agent: "GL Reconciler",
    description: "Full general ledger reconciliation — every number verified and accounted for.",
    tags: ["Verified", "Clean"],
    size: "normal",
  },
  {
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    name: "Month-End Close",
    agent: "Month-End Closer",
    description: "Accounts brought fully current with clean month-end close before investor review.",
    tags: ["Current", "Accurate"],
    size: "normal",
  },
]

export default function WhatIsIncluded() {
  return (
    <section id="whats-included" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">What's Included</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            10 deliverables. One package.{" "}
            <span className="gradient-text">72 hours.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Everything a top-tier investment bank would produce for your raise — in a fraction of the time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {deliverables.map((item, i) => (
            <div
              key={item.name}
              className={`glass-card glass-card-hover rounded-2xl p-6 ${
                item.size === "large" ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 font-medium">{item.agent}</span>
              </div>

              <h3 className="text-white font-semibold text-base mb-2">{item.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
