const before = [
  "6–8 weeks of junior analyst time",
  "£15,000–50,000 in advisory fees",
  "Back-and-forth with multiple advisors",
  "Inconsistent quality across deliverables",
  "No visibility into progress",
  "Models full of errors and assumptions",
  "Pitch deck that looks like every other one",
]

const after = [
  "72 hours from submission to delivery",
  "£3,500 flat — everything included",
  "Submit once, receive everything",
  "Consistent, institutional-grade quality",
  "Live dashboard with real-time progress",
  "Models built from your actual data",
  "Deck tailored to your specific story",
]

export default function BeforeAfter() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">The Difference</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            The old way vs{" "}
            <span className="gradient-text">the RaiseReady way.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="rounded-2xl p-8 border border-red-500/10 bg-red-500/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-red-400 font-semibold">Traditional Advisory</span>
            </div>
            <ul className="space-y-4">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-400 text-sm">
                  <svg className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="rounded-2xl p-8 border border-cyan-500/20 bg-cyan-500/5 cyan-glow">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-cyan-400 font-semibold">RaiseReady</span>
            </div>
            <ul className="space-y-4">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-200 text-sm">
                  <svg className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: "93%", label: "Less expensive than traditional advisory" },
            { value: "72hrs", label: "Average delivery time" },
            { value: "10x", label: "Faster than hiring analysts" },
            { value: "10", label: "Deliverables in every package" },
          ].map(({ value, label }) => (
            <div key={label} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
