"use client"

import Link from "next/link"
import Image from "next/image"
import { HelpCircle, Languages } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

  return (
    <header className="bg-white text-gray-800 py-4 shadow-lg border-b-4 border-[#6D1ED4]" role="banner">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
        <Link
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 rounded-lg"
          aria-label="Zelle home"
        >
          <div className="bg-[#6D1ED4] rounded-lg px-3 py-2.5 flex items-center justify-center shadow-md">
            <Image
              src="/zelle-logo.svg"
              alt="Zelle"
              width={80}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8" role="navigation" aria-label="Main navigation">
          <Link
            href="/contact"
            className="text-gray-800 hover:text-[#6D1ED4] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.contactUs}
          </Link>
          <Link
            href="/about"
            className="text-gray-800 hover:text-[#6D1ED4] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
          >
            {t.header.about}
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-gray-800 hover:text-[#6D1ED4] transition-colors font-medium text-xs sm:text-sm lg:text-base focus:outline-none focus:underline focus:underline-offset-4"
            aria-label={`Switch to ${language === "en" ? "French" : "English"}`}
          >
            <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{language === "en" ? "Français" : "English"}</span>
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-800 hover:border-[#6D1ED4] hover:bg-[#6D1ED4] hover:text-white transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2"
            aria-label={t.header.helpLabel}
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </nav>
      </div>
    </header>
  )
}
