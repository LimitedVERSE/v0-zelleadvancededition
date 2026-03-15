"use client"

import { useRouter } from "next/navigation"
import DashboardShellWithAuth from "@/components/DashboardShell"
import {
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Settings,
  Users,
  FileText,
  Bell,
  ShieldCheck,
  BarChart3,
  Mail,
  MoreVertical,
  RefreshCcw,
  Landmark,
  Timer,
  Layers,
} from "lucide-react"

const sections = [
  {
    label: "Transfers",
    items: [
      {
        id: "send",
        title: "Send Money",
        subtitle: "Zelle · Instant · Secure",
        icon: SendIcon,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-950",
        href: "/send",
      },
      {
        id: "deposit",
        title: "Deposit Portal",
        subtitle: "Accept · Confirm · Deposit",
        icon: DollarSign,
        iconColor: "text-green-400",
        iconBg: "bg-green-950",
        href: "/deposit-portal",
      },
      {
        id: "bank-connect",
        title: "Connect Bank",
        subtitle: "Link · Verify · Secure",
        icon: CreditCard,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-950",
        href: "/connect-bank",
      },
      {
        id: "history",
        title: "Depository History",
        subtitle: "Logs · Pending · Complete",
        icon: History,
        iconColor: "text-orange-400",
        iconBg: "bg-orange-950",
        href: "/history",
      },
      {
        id: "remittance",
        title: "Remittance",
        subtitle: "Class · Filter · Route",
        icon: RefreshCcw,
        iconColor: "text-yellow-400",
        iconBg: "bg-yellow-950",
        href: "/remittance",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        id: "recipients",
        title: "Recipients",
        subtitle: "Add · Edit · Organize",
        icon: Users,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-950",
        href: "/recipients",
      },
      {
        id: "reports",
        title: "Reports",
        subtitle: "Export · Detailed · CSV",
        icon: FileText,
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-950",
        href: "/reports",
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "Alerts · Email · Prefs",
        icon: Bell,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-950",
        href: "/notifications",
      },
      {
        id: "security",
        title: "Security",
        subtitle: "Auth · 2FA · Settings",
        icon: ShieldCheck,
        iconColor: "text-red-400",
        iconBg: "bg-red-950",
        href: "/security",
      },
      {
        id: "bank-accounts",
        title: "Bank Accounts",
        subtitle: "Linked · Verified · Managed",
        icon: Landmark,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-950",
        href: "/",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        id: "analytics",
        title: "Analytics",
        subtitle: "Stats · Insights · Charts",
        icon: BarChart3,
        iconColor: "text-teal-400",
        iconBg: "bg-teal-950",
        href: "/analytics",
      },
      {
        id: "email-preview",
        title: "Email Templates",
        subtitle: "Preview · Test · Send",
        icon: Mail,
        iconColor: "text-pink-400",
        iconBg: "bg-pink-950",
        href: "/admin/email-preview",
      },
      {
        id: "admin",
        title: "Admin",
        subtitle: "Config · Manage · Control",
        icon: Settings,
        iconColor: "text-slate-400",
        iconBg: "bg-slate-800",
        href: "/admin",
      },
      {
        id: "countdown",
        title: "Countdown",
        subtitle: "Timer · Schedule · Redirect",
        icon: Timer,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-950",
        href: "/countdown",
      },
      {
        id: "remittance-catalog",
        title: "Remittance Catalog",
        subtitle: "Classes · Rules · Tags",
        icon: Layers,
        iconColor: "text-violet-400",
        iconBg: "bg-violet-950",
        href: "/remittance",
      },
    ],
  },
]

function DashboardContent() {
  const router = useRouter()

  return (
    <div className="text-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-8 space-y-10">
        {sections.map((section) => (
          <section key={section.label}>
            <h2 className="text-base font-semibold text-white mb-4 tracking-wide">
              {section.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className="group relative bg-[#161616] hover:bg-[#1e1e1e] border border-zinc-800 hover:border-[#6D1ED4]/60 rounded-xl p-4 sm:p-5 text-left transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4]/50"
                  >
                    {/* Settings gear */}
                    <div className="absolute top-3 right-3 text-zinc-700 group-hover:text-zinc-500 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>

                    {/* Text */}
                    <p className="text-sm sm:text-base font-semibold text-white leading-snug mb-1 pr-4">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 leading-snug">
                      {item.subtitle}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardShellWithAuth><DashboardContent /></DashboardShellWithAuth>
}
