const steps = [
  {
    number: "01",
    title: "Submit Your Details",
    description:
      "Fill out a 10-minute form. Tell us about your startup, the round you're raising, and upload your existing financial documents.",
    time: "10 minutes",
    items: ["Startup overview", "Financial documents", "Target raise amount", "Sector & stage"],
  },
  {
    number: "02",
    title: "10 Agents Get to Work",
    description:
      "Our AI agents work simultaneously — auditing your financials, building your model, researching your market, and drafting your deck.",
    time: "72 hours",
    items: ["Parallel processing", "Real-time dashboard", "Progress tracking", "Live status updates"],
  },
  {
    number: "03",
    title: "Receive Your Package",
    description:
      "Log into your dashboard and download your complete fundraising package — investor-ready in every way.",
    time: "Download ready",
    items: ["10 deliverables", "Excel models", "PowerPoint deck", "PDF reports"],
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            From application to package<br />
            <span className="gradient-text">in three steps.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No back-and-forth. No waiting weeks. Submit once, get everything delivered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="glass-card glass-card-hover rounded-2xl p-8 relative"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Step number */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-lg">{step.number}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-400">{step.time}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{step.description}</p>

              <ul className="space-y-2">
                {step.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
