"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const stages = ["Pre-Seed", "Seed", "Series A", "Series B+"]
const industries = ["Fintech", "SaaS", "E-commerce", "HealthTech", "EdTech", "Web3/Crypto", "Deep Tech", "Consumer", "Other"]
const amounts = ["£100K–500K", "£500K–1M", "£1M–3M", "£3M–5M", "£5M–10M", "£10M+"]

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    startupName: "",
    website: "",
    industry: "",
    stage: "",
    amountRaising: "",
    description: "",
  })

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        router.push("/dashboard")
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#020617] min-h-screen grid-bg">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2 mb-10 w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-white">RaiseReady</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s ? "bg-cyan-500 text-black" :
                  step === s ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400" :
                  "bg-white/5 border border-white/10 text-slate-500"
                }`}>
                  {step > s ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                {s < 3 && <div className={`flex-1 h-px w-16 transition-all ${step > s ? "bg-cyan-500" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && "Create your account"}
            {step === 2 && "Tell us about your startup"}
            {step === 3 && "Fundraising details"}
          </h1>
          <p className="text-slate-400">
            {step === 1 && "You'll use this to access your dashboard once your package is ready."}
            {step === 2 && "Help our agents understand your business."}
            {step === 3 && "Final details about your raise."}
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@startup.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Startup Name</label>
                <input
                  type="text"
                  value={form.startupName}
                  onChange={(e) => update("startupName", e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Website (optional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://yourstartup.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                <div className="grid grid-cols-3 gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => update("industry", ind)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        form.industry === ind
                          ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Brief Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="What does your startup do? (2-3 sentences)"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Funding Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {stages.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("stage", s)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        form.stage === s
                          ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Raise Amount</label>
                <div className="grid grid-cols-2 gap-2">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => update("amountRaising", a)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        form.amountRaising === a
                          ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-white/3 border border-white/5 p-4 mt-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Application Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Name", form.name],
                    ["Startup", form.startupName],
                    ["Industry", form.industry],
                    ["Stage", form.stage],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <span className="text-slate-500">{label}: </span>
                      <span className="text-slate-200">{val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Application — £3,500"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
