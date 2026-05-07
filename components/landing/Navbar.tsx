"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? "glass-card shadow-2xl shadow-black/50"
          : "bg-transparent border border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">RaiseReady</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "What's Included", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/[' ]/g, "-").replace("'", "")}`}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              {item}
            </a>
          ))}
        </div>

        <Link
          href="/apply"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
        >
          Apply Now
        </Link>
      </div>
    </nav>
  )
}
