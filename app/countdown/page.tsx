"use client"

import CountdownRedirectScreen from "@/components/CountdownRedirectScreen"
import { buildZelleMock } from "@/lib/mockZelleService"
import { useSearchParams } from "next/navigation"

export default function CountdownPage() {
  const searchParams = useSearchParams()

  const bankId = searchParams.get("bankId") || undefined
  const bankName = searchParams.get("bankName") || undefined
  const categoryId = searchParams.get("categoryId") || undefined

  const data = buildZelleMock(bankId, bankName, categoryId)

  return <CountdownRedirectScreen data={data} />
}
