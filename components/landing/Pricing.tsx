import Link from "next/link"

const includes = [
  "Financial Model (DCF, LBO, 3-statement)",
  "Investor Pitch Deck (PowerPoint)",
  "Valuation Report with peer comps",
  "Market Research & TAM analysis",
  "Statement Audit & clean financials",
  "KYC & compliance package",
  "Investor Meeting Prep document",
  "Historical Earnings Analysis",
  "GL Reconciliation",
  "Month-End Close",
  "Dedicated client dashboard",
  "72-hour guaranteed delivery",
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            One package.{" "}
            <span className="gradient-text">One price. Everything.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No hidden fees, no upsells, no retainers. Pay once, receive your complete fundraising package.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-cyan-500/20 cyan-glow relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/5 blur-[60px] pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  Complete Package
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-6xl font-bold text-white">£3,500</span>
                  <span className="text-slate-400">one-time</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-8">
                  <span className="line-through">Traditional advisory: £15,000–50,000</span>
                </div>

                <p className="text-slate-300 text-base leading-relaxed mb-8">
                  Everything a Goldman Sachs junior team would produce for your Series A prep — delivered by 10 AI agents in 72 hours, at a fraction of the cost.
                </p>

                <Link
                  href="/apply"
                  className="group w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer"
                >
                  Apply Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <p className="text-slate-500 text-xs text-center mt-4">
                  Secure payment · Satisfaction guaranteed
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Everything included</p>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                q: "What do I need to provide?",
                a: "Your existing financial documents (even rough spreadsheets), a short description of your startup, and 10 minutes to fill out our form.",
              },
              {
                q: "Is my data secure?",
                a: "All data is encrypted in transit and at rest. Your financials are never shared or used for any other purpose.",
              },
              {
                q: "What if I'm not satisfied?",
                a: "If the package doesn't meet your expectations, we'll work with you to revise it until it does. Your success is our success.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="glass-card rounded-2xl p-6">
                <h4 className="text-white font-semibold text-sm mb-2">{q}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
