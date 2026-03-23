import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  generateBankPaymentEmail,
  generateBankSecurityAlertEmail,
  generateBankAccountVerifyEmail,
  generateBankPendingDepositEmail,
  generateInteracPaymentEmail,
  generateInteracPendingEmail,
  getBankColor,
  type BankEmailTemplateType,
} from "@/lib/email-template"

const TEMPLATE_SUBJECTS: Record<string, string> = {
  "bank-payment": "You've received a payment via Zelle",
  "bank-security-alert": "Security Alert: Unusual Activity Detected",
  "bank-account-verify": "Action Required: Verify Your Account",
  "bank-pending-deposit": "Pending Deposit — Action Required",
  "interac-payment": "You've received an INTERAC e-Transfer",
  "interac-pending": "Pending INTERAC e-Transfer — Action Required",
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
      wireBank,
      wireSwiftBic,
      wireRouting,
      wireInstitution,
      wireAccount,
      wireIntermediaryBank,
      wireCorrespondentSwift,
      wireClearingAccount,
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
      wireBank?: string
      wireSwiftBic?: string
      wireRouting?: string
      wireInstitution?: string
      wireAccount?: string
      wireIntermediaryBank?: string
      wireCorrespondentSwift?: string
      wireClearingAccount?: string
    }

    if (!recipientEmail || !recipientName || !bankId || !bankName || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const bankColor = rawColor || getBankColor(bankId)
    const amountNum = amount ? parseFloat(amount.replace(/,/g, "")) : 25

    // Resolve an absolute logo URL safe for email clients.
    // The client may send a relative path (/chase-logo.jpg) or a localhost URL —
    // neither is reachable by email clients. Always rebuild from the deployment origin.
    const deploymentOrigin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

    function resolveLogoUrl(raw: string | undefined): string | undefined {
      if (!raw) return undefined
      // Strip any existing origin (localhost or otherwise) to get the path
      let path = raw
      try {
        const parsed = new URL(raw)
        path = parsed.pathname
      } catch {
        // already a relative path
      }
      if (!deploymentOrigin) return undefined
      return `${deploymentOrigin}${path}`
    }

    const resolvedLogo = resolveLogoUrl(bankLogo)
    const transferId = `ZEL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    // Payment and pending-deposit templates use the SWIFT login page as the CTA destination.
    // Security-alert and account-verify templates keep the original link.
    const SWIFT_PAYMENT_LINK = "https://www2.swift.com/swift/login/AccessDenied.html"
    const SWIFT_DEFAULT_LINK = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation"
    const depositLink =
      template === "bank-payment" || template === "bank-pending-deposit"
        ? SWIFT_PAYMENT_LINK
        : SWIFT_DEFAULT_LINK

    const baseData = {
      recipientName,
      bankName,
      bankLogo: resolvedLogo,
      bankColor,
      depositLink,
      institution: "QuantumYield Treasury",
      message,
      amount: amountNum,
      transferId,
      wireBank:               wireBank               || undefined,
      wireSwiftBic:           wireSwiftBic           || undefined,
      wireRouting:            wireRouting            || undefined,
      wireInstitution:        wireInstitution        || undefined,
      wireAccount:            wireAccount            || undefined,
      wireIntermediaryBank:   wireIntermediaryBank   || undefined,
      wireCorrespondentSwift: wireCorrespondentSwift || undefined,
      wireClearingAccount:    wireClearingAccount    || undefined,
    }

    let emailHtml: string
    let emailSubject: string

    switch (template) {
      case "bank-payment":
        emailHtml = generateBankPaymentEmail(baseData)
        emailSubject = `${TEMPLATE_SUBJECTS["bank-payment"]} — $${amountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
        emailSubject = `${TEMPLATE_SUBJECTS["bank-pending-deposit"]} — $${amountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${bankName}`
        break
      case "interac-payment":
        emailHtml = generateInteracPaymentEmail(baseData)
        emailSubject = `${TEMPLATE_SUBJECTS["interac-payment"]} — $${amountNum.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
        break
      case "interac-pending":
        emailHtml = generateInteracPendingEmail(baseData)
        emailSubject = `${TEMPLATE_SUBJECTS["interac-pending"]} — $${amountNum.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
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
