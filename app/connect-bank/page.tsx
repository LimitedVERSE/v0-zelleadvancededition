"use client"

import { useState, useCallback } from "react"
import DashboardShellWithAuth from "@/components/DashboardShell"
import BankSelectorGrid from "@/components/BankSelectorGrid"
import InstitutionMultiSelect from "@/components/InstitutionMultiSelect"
import SearchBar from "@/components/SearchBar"
import { Shield, CreditCard, Grid3x3, Layers } from "lucide-react"

type ConnectionMethod = "grid" | "multi-select"

function ConnectBankContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("grid")

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">Connect Bank</h1>
            <p className="text-sm text-muted-foreground">Link your financial institution securely via Zelle</p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-[#6D1ED4] flex-shrink-0" />
          <span>Bank-grade encryption · Your credentials are never stored</span>
        </div>
      </div>

      {/* Method toggle + search row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Method switcher */}
        <div
          className="flex items-center gap-1 p-1 bg-muted rounded-lg"
          role="tablist"
          aria-label="Connection method"
        >
          <button
            role="tab"
            aria-selected={connectionMethod === "grid"}
            onClick={() => setConnectionMethod("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-1 ${
              connectionMethod === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Quick Select
          </button>
          <button
            role="tab"
            aria-selected={connectionMethod === "multi-select"}
            onClick={() => setConnectionMethod("multi-select")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-1 ${
              connectionMethod === "multi-select"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            Multi-Bank
          </button>
        </div>

        {/* Search — only shown for grid mode */}
        {connectionMethod === "grid" && (
          <SearchBar onSearch={handleSearch} />
        )}
      </div>

      {/* Description blurb per mode */}
      <p className="text-sm text-muted-foreground mb-5">
        {connectionMethod === "grid"
          ? "Select your bank below to be securely redirected to its official login portal."
          : "Select one or more financial institutions to connect simultaneously."}
      </p>

      {/* Main content area */}
      <div role="tabpanel">
        {connectionMethod === "grid" ? (
          <BankSelectorGrid searchTerm={searchTerm} />
        ) : (
          <InstitutionMultiSelect />
        )}
      </div>
    </div>
  )
}

export default function ConnectBankPage() {
  return (
    <DashboardShellWithAuth>
      <ConnectBankContent />
    </DashboardShellWithAuth>
  )
}
