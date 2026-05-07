import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import WhatIsIncluded from "@/components/landing/WhatIsIncluded"
import BeforeAfter from "@/components/landing/BeforeAfter"
import Pricing from "@/components/landing/Pricing"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="bg-[#020617] min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhatIsIncluded />
      <BeforeAfter />
      <Pricing />
      <Footer />
    </main>
  )
}
