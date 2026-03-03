"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type React from "react"
import { useState } from "react"
import { Building2, MapPin, CreditCard, Hash, ArrowRight, AlertCircle, Grid3x3, Layers, PenTool } from "lucide-react"
import Header from "@/components/Header"
import DepositPanel from "@/components/DepositPanel"
import BankSelectorGrid from "@/components/BankSelectorGrid"
import SearchBar from "@/components/SearchBar"
import InstitutionMultiSelect from "@/components/InstitutionMultiSelect"
import type { FinancialInstitution } from "@/types/financial-institution"
import { useLanguage } from "@/lib/i18n/context"

type ConnectionMethod = "grid" | "multi-select" | "manual"

function HomeContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstitutions, setSelectedInstitutions] = useState<FinancialInstitution[]>([])
  const { t } = useLanguage()

  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("grid")

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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <DepositPanel />

        <section className="mt-12 mb-8" aria-labelledby="connection-method-heading">
          <div className="text-center mb-8">
            <h2 id="connection-method-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t.mainPage.connectionMethodTitle}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">{t.mainPage.connectionMethodDescription}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Quick Select Method */}
            <button
              onClick={() => setConnectionMethod("grid")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                connectionMethod === "grid"
                  ? "border-[#6D1ED4] bg-[#6D1ED4]/5 shadow-lg scale-105"
                  : "border-border bg-card hover:border-muted-foreground hover:shadow-md hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "grid"}
            >
              <div className="flex flex-col items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                    connectionMethod === "grid" ? "bg-[#6D1ED4] text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Grid3x3 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{t.mainPage.gridMethod}</h3>
                  <p className="text-sm text-muted-foreground">{t.mainPage.gridMethodDescription}</p>
                </div>
                {connectionMethod === "grid" && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-[#6D1ED4] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* Multi-Connect Method */}
            <button
              onClick={() => setConnectionMethod("multi-select")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                connectionMethod === "multi-select"
                  ? "border-[#6D1ED4] bg-[#6D1ED4]/5 shadow-lg scale-105"
                  : "border-border bg-card hover:border-muted-foreground hover:shadow-md hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "multi-select"}
            >
              <div className="flex flex-col items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                    connectionMethod === "multi-select" ? "bg-[#6D1ED4] text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{t.mainPage.multiSelectMethod}</h3>
                  <p className="text-sm text-muted-foreground">{t.mainPage.multiSelectMethodDescription}</p>
                </div>
                {connectionMethod === "multi-select" && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-[#6D1ED4] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* Manual Entry Method */}
            <button
              onClick={() => setConnectionMethod("manual")}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                connectionMethod === "manual"
                  ? "border-[#6D1ED4] bg-[#6D1ED4]/5 shadow-lg scale-105"
                  : "border-border bg-card hover:border-muted-foreground hover:shadow-md hover:scale-102"
              }`}
              aria-pressed={connectionMethod === "manual"}
            >
              <div className="flex flex-col items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                    connectionMethod === "manual" ? "bg-[#6D1ED4] text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <PenTool className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{t.mainPage.manualMethod}</h3>
                  <p className="text-sm text-muted-foreground">{t.mainPage.manualMethodDescription}</p>
                </div>
                {connectionMethod === "manual" && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-[#6D1ED4] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
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

            <form
              onSubmit={handleManualSubmit}
              className="bg-card border-2 border-border rounded-xl shadow-sm p-6 md:p-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Institution Field */}
                <div className="space-y-2 group">
                  <label
                    htmlFor="institution"
                    className="flex items-center gap-2 text-base font-semibold text-foreground"
                  >
                    <Building2 className="w-5 h-5 text-[#6D1ED4]" />
                    {t.mainPage.selectInstitutionLabel}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="institution"
                    value={manualForm.institution}
                    onChange={(e) => setManualForm({ ...manualForm, institution: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                    required
                  >
                    <option value="" disabled>
                      {t.mainPage.selectInstitutionDropdown}
                    </option>
                    <option value="chase">Chase</option>
                    <option value="bank-of-america">Bank of America</option>
                    <option value="wells-fargo">Wells Fargo</option>
                    <option value="citibank">Citibank</option>
                    <option value="us-bank">U.S. Bank</option>
                    <option value="pnc">PNC Bank</option>
                    <option value="capital-one">Capital One</option>
                    <option value="truist">Truist</option>
                    <option value="td-bank">TD Bank</option>
                    <option value="bmo-harris">BMO Harris</option>
                  </select>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {t.mainPage.selectInstitutionHelp}
                  </p>
                </div>

                {/* State Field */}
                <div className="space-y-2 group">
                  <label htmlFor="state" className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <MapPin className="w-5 h-5 text-[#6D1ED4]" />
                    {t.mainPage.selectProvinceLabel}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    value={manualForm.state}
                    onChange={(e) => setManualForm({ ...manualForm, state: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                    required
                  >
                    <option value="" disabled>
                      {t.mainPage.selectProvinceDropdown}
                    </option>
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
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {t.mainPage.selectProvinceHelp}
                  </p>
                </div>

                {/* Account Type Field */}
                <div className="space-y-2 group">
                  <label
                    htmlFor="accountType"
                    className="flex items-center gap-2 text-base font-semibold text-foreground"
                  >
                    <CreditCard className="w-5 h-5 text-[#6D1ED4]" />
                    {t.mainPage.accountTypeLabel}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="accountType"
                    value={manualForm.accountType}
                    onChange={(e) => setManualForm({ ...manualForm, accountType: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground"
                    required
                  >
                    <option value="" disabled>
                      {t.mainPage.accountTypeDropdown}
                    </option>
                    <option value="chequing">{t.mainPage.chequing}</option>
                    <option value="savings">{t.mainPage.savings}</option>
                    <option value="investment">{t.mainPage.investment}</option>
                    <option value="credit">{t.mainPage.creditCard}</option>
                  </select>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {t.mainPage.accountTypeHelp}
                  </p>
                </div>

                {/* Branch Number Field */}
                <div className="space-y-2 group">
                  <label
                    htmlFor="branchNumber"
                    className="flex items-center gap-2 text-base font-semibold text-foreground"
                  >
                    <Hash className="w-5 h-5 text-[#6D1ED4]" />
                    {t.mainPage.branchNumberLabel}
                  </label>
                  <input
                    id="branchNumber"
                    type="text"
                    value={manualForm.branchNumber}
                    onChange={(e) => setManualForm({ ...manualForm, branchNumber: e.target.value })}
                    placeholder={t.mainPage.branchNumberPlaceholder}
                    className="w-full px-4 py-3.5 border-2 border-border rounded-lg text-foreground bg-background focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 transition-all duration-200 hover:border-muted-foreground placeholder:text-muted-foreground"
                    maxLength={5}
                    pattern="[0-9]*"
                  />
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {t.mainPage.branchNumberHelp}
                  </p>
                </div>
              </div>

              {formError && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{formError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-[#6D1ED4] text-white rounded-lg font-bold text-lg hover:bg-[#5a19b0] transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      </main>
    </div>
  )
}

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#6D1ED4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
