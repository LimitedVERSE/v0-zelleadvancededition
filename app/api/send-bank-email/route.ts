import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  generateBankPaymentEmail,
  generateBankSecurityAlertEmail,
  generateBankAccountVerifyEmail,
  generateBankPendingDepositEmail,
  getBankColor,
  type BankEmailTemplateType,
} from "@/lib/email-template"

const TEMPLATE_SUBJECTS: Record<string, string> = {
  "bank-payment": "You've received a payment via Zelle",
  "bank-security-alert": "Security Alert: Unusual Activity Detected",
  "bank-account-verify": "Action Required: Verify Your Account",
  "bank-pending-deposit": "Pending Deposit — Action Required",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      recipientEmail,
      recipientName,
      bankId,
      bankName,
      bankLogo,
      bankColor: rawColor,
      template,
      amount,
      message,
    } = body as {
      recipientEmail: string
      recipientName: string
      bankId: string
      bankName: string
      bankLogo?: string
      bankColor?: string
      template: BankEmailTemplateType
      amount?: string
      message?: string
    }

    if (!recipientEmail || !recipientName || !bankId || !bankName || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const bankColor = rawColor || getBankColor(bankId)
    const amountNum = amount ? parseFloat(amount) : 25
    const transferId = `ZEL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    const depositLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation"

    const baseData = {
      recipientName,
      bankName,
      bankLogo,
      bankColor,
      depositLink,
      institution: "QuantumYield Treasury",
      message,
      amount: amountNum,
      transferId,
    }

    let emailHtml: string
    let emailSubject: string

    switch (template) {
      case "bank-payment":
        emailHtml = generateBankPaymentEmail(baseData)
        emailSubject = `${TEMPLATE_SUBJECTS["bank-payment"]} — $${amountNum.toFixed(2)}`
        break
      case "bank-security-alert":
        emailHtml = generateBankSecurityAlertEmail(baseData)
        emailSubject = TEMPLATE_SUBJECTS["bank-security-alert"]
        break
      case "bank-account-verify":
        emailHtml = generateBankAccountVerifyEmail(baseData)
        emailSubject = TEMPLATE_SUBJECTS["bank-account-verify"]
        break
      case "bank-pending-deposit":
        emailHtml = generateBankPendingDepositEmail(baseData)
        emailSubject = `${TEMPLATE_SUBJECTS["bank-pending-deposit"]} — $${amountNum.toFixed(2)} via ${bankName}`
        break
      default:
        return NextResponse.json({ error: "Unknown template type" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY." },
        { status: 500 },
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Zelle <gateway@quantumyield.exchange>",
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    })

    if (error) {
      return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
