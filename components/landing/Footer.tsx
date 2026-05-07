import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="font-bold text-white">RaiseReady</span>
        </div>

        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} RaiseReady. AI-powered fundraising preparation.
        </p>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-slate-500 hover:text-white text-sm transition-colors cursor-pointer">
            Login
          </Link>
          <Link href="/apply" className="text-slate-500 hover:text-white text-sm transition-colors cursor-pointer">
            Apply
          </Link>
        </div>
      </div>
    </footer>
  )
}
