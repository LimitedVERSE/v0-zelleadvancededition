"use client"

import { generateZelleEmailHtml, generateUpgradeWarningEmail } from "@/lib/email-template"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2, Send } from "lucide-react"

type EmailTemplate = "payment" | "upgrade-warning"

export default function EmailPreviewPage() {
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>("payment")
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "John Doe",
    amount: "100.00",
    message: "ENTER-VAULT-SECURE-CYPHER-PASS",
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const html =
    emailTemplate === "payment"
      ? generateZelleEmailHtml({
        recipientName: formData.recipientName,
        amount: Number.parseFloat(formData.amount) || 0,
        message: formData.message || undefined,
        transferId: "ZEL-733346-AWLX84P",
        depositLink: "https://www.zellepay.com/",
        senderName: "QuantumYield",
        institution: "QuantumYield Holdings | Treasury Reserve & Vaulted-Portal",
      })
      : generateUpgradeWarningEmail({
        recipientName: formData.recipientName,
        institution: "QuantumYield Holdings",
        upgradeDeadline: "within 12 hours", // Updated deadline from 30 days to 12 hours for urgent upgrade
        supportLink: "https://support.zellepay.com",
      })

  const handleSendEmail = async () => {
    setError("")
    setSuccess(false)
    setSending(true)

    try {
      const response = await fetch("/api/send-zelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          emailTemplate, // Include template type so API knows which email to send
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Email Preview & Send - Zelle</h1>
          <p className="text-gray-600">
            Configure and send Zelle payment emails via SendGrid with interactive EN/FR preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Email Template</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={emailTemplate === "payment" ? "default" : "outline"}
                  onClick={() => setEmailTemplate("payment")}
                  className={emailTemplate === "payment" ? "bg-[#6D1ED4] hover:bg-[#5a18b5]" : ""}
                >
                  Payment Notification
                </Button>
                <Button
                  type="button"
                  variant={emailTemplate === "upgrade-warning" ? "default" : "outline"}
                  onClick={() => setEmailTemplate("upgrade-warning")}
                  className={emailTemplate === "upgrade-warning" ? "bg-[#6D1ED4] hover:bg-[#5a18b5]" : ""}
                >
                  Upgrade Warning
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Recipient Email *</label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Recipient Name *</label>
                <Input
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                />
              </div>

              {emailTemplate === "payment" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount (USD) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Message (Optional)</label>
                    <Textarea
                      placeholder="Add a personal message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={sending || !formData.recipientEmail}
                className="w-full bg-[#6D1ED4] hover:bg-[#5a18b5] text-white font-bold"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Email via SendGrid...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Email Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send via SendGrid
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  ✓ Email sent successfully to {formData.recipientEmail}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Live Interactive Preview (EN/FR Toggle)</h2>
            <p className="text-sm text-gray-600 mb-4">Click EN/FR in the header to switch languages.</p>
            <div className="border-2 border-purple-200 rounded-lg overflow-hidden shadow-xl bg-white">
              <iframe
                title="Email Preview"
                srcDoc={html}
                sandbox="allow-scripts allow-same-origin"
                className="w-full border-0"
                style={{
                  height: "800px",
                  display: "block",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
