"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("zelle-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("zelle-user")
      }
    }
    setIsHydrated(true)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (email !== "admin@quantumyield.exchange") {
        throw new Error("Unauthorized email address")
      }

      // Simulate login - in production, call your auth API
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: "Admin",
      }
      setUser(newUser)
      localStorage.setItem("zelle-user", JSON.stringify(newUser))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("zelle-user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
