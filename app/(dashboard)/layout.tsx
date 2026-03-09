"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  SendIcon,
  DollarSign,
  CreditCard,
  History,
  Users,
  FileText,
  Bell,
  ShieldCheck,
  BarChart3,
  Mail,
  Settings,
  RefreshCcw,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  Menu,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Send Money", href: "/send", icon: SendIcon },
  { label: "Deposit Portal", href: "/deposit-portal", icon: DollarSign },
  { label: "Connect Bank", href: "/", icon: CreditCard },
  { label: "History", href: "/history", icon: History },
  { label: "Remittance", href: "/remittance", icon: RefreshCcw },
  { label: "Recipients", href: "/recipients", icon: Users },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Email Templates", href: "/admin/email-preview", icon: Mail },
  { label: "Admin", href: "/admin", icon: Settings },
]

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto flex flex-col h-full bg-[#0f0f0f] border-r border-zinc-800/60 transition-all duration-300 ease-in-out flex-shrink-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-56" : "w-16"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-800/60 h-16 flex-shrink-0">
          {sidebarOpen && (
            <Link href="/dashboard" onClick={() => setMobileSidebarOpen(false)}>
              <Image
                src="/zelle-logo.svg"
                alt="Zelle"
                width={72}
                height={27}
                className="h-6 w-auto"
                priority
              />
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex ml-auto p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2" aria-label="Main navigation">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href) && href !== "/")
            return (
              <Link
                key={href + label}
                href={href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? "bg-[#6D1ED4]/20 text-[#a855f7] border border-[#6D1ED4]/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#a855f7]" : "text-zinc-500 group-hover:text-white"}`} />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User / logout */}
        <div className="border-t border-zinc-800/60 p-3 flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#6D1ED4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name}</p>
                <p className="text-xs text-zinc-500 truncate leading-tight">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-md hover:bg-zinc-800 flex-shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-md hover:bg-zinc-800"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-zinc-800/60 bg-[#0f0f0f] flex-shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard">
            <Image src="/zelle-logo.svg" alt="Zelle" width={64} height={24} className="h-5 w-auto" priority />
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#6D1ED4] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6D1ED4] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <DashboardShell>{children}</DashboardShell>
}
