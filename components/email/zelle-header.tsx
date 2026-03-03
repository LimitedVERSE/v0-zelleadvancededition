interface ZelleHeaderProps {
  logoUrl?: string
  language?: "en" | "fr"
}

export function ZelleHeader({
  logoUrl = "https://www.zellepay.com/sites/default/files/2018-05/zelle-logo-hd.png",
  language = "en",
}: ZelleHeaderProps) {
  return (
    <div className="bg-white px-3 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between flex-wrap gap-2 sm:gap-3 border-b-4 border-[#6D1ED4]">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <img src={logoUrl || "/placeholder.svg"} alt="Zelle" className="h-8 sm:h-10 md:h-[50px] block" />
        <div className="bg-gray-100 text-gray-600 font-bold text-[10px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded flex items-center">
          <span className="hidden sm:inline">
            {language === "en" ? "Partnered with QuantumYield Holdings" : "En partenariat avec QuantumYield Holdings"}
          </span>
          <span className="inline sm:hidden">
            {language === "en" ? "QuantumYield Holdings" : "QuantumYield Holdings"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-xs sm:text-sm">
          <span
            className={`font-bold cursor-pointer transition-opacity ${language === "en" ? "underline opacity-100" : "opacity-70 hover:opacity-90"}`}
          >
            EN
          </span>
          <span className="text-gray-400 opacity-50">|</span>
          <span
            className={`font-bold cursor-pointer transition-opacity ${language === "fr" ? "underline opacity-100" : "opacity-70 hover:opacity-90"}`}
          >
            FR
          </span>
        </div>
        <div className="bg-[#6D1ED4] text-white font-bold text-sm sm:text-base px-2.5 py-1.5 sm:px-3 sm:py-2 rounded flex items-center whitespace-nowrap">
          Zelle
        </div>
      </div>
    </div>
  )
}
