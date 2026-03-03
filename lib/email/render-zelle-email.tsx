import { emailCopy, type EmailLang, type EmailLangMode } from "@/lib/email/copy"

export interface EmailData {
  recipientName: string
  amount: number
  message?: string
  transferId: string
  depositLink: string
  senderName?: string
  institution?: string
}

function wrapEmail(html: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Zelle Payment</title>
  <style>
    body{margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif}
    table{border-collapse:collapse}
    img{border:0;display:block}
    a{color:#2563eb;text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body>${html}</body>
</html>`
}

export function renderZelleEmail(data: EmailData, mode: EmailLangMode = "en"): string {
  const amount = `$${data.amount.toFixed(2)} USD`
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const renderOne = (lang: EmailLang) => {
    const copy = emailCopy[lang]

    return `
      <div style="background-color:#f5f5f5;font-family:Arial,sans-serif;width:100%">
        <div style="max-width:600px;margin:0 auto;background-color:#fff">
          <!-- Header -->
          <div style="background-color:#fff;border-bottom:4px solid #6D1ED4;padding:12px 32px;display:flex;align-items:center;justify-content:space-between;height:74px">
            <div style="height:40px;width:120px">
              <img alt="Zelle" style="height:40px;display:block" src="https://www.zellepay.com/sites/default/files/2018-05/zelle-logo-hd.png" />
            </div>
            <div style="display:flex;align-items:center;gap:16px;color:#374151;font-size:14px">
              <a href="#" style="color:#374151;text-decoration:none">View in browser</a>
              <span style="color:#9ca3af">|</span>
              <a href="#" style="color:#374151;text-decoration:none">${lang === "en" ? "FR" : "EN"}</a>
              <span style="color:#9ca3af">|</span>
              <a href="https://www.zellepay.com/support" style="color:#374151;text-decoration:none" target="_blank">
                <span style="font-size:20px;font-weight:bold;color:#374151">?</span>
              </a>
            </div>
          </div>

          <!-- Body -->
          <div style="background-color:#f9f9f9;border-radius:0 0 24px 24px;min-height:600px;padding-bottom:48px">
            <div style="padding:32px 72px">
              <h1 style="font-size:20px;font-weight:700;margin:0 0 8px 0;word-break:break-all">${copy.greetingPrefix} ${data.recipientName},</h1>
              <h2 style="font-size:24px;font-weight:700;margin:0 0 8px 0">${copy.mainHeading}</h2>
              <p style="font-size:16px;line-height:1.5;margin:0 0 16px 0">${copy.description(amount)}</p>

              <!-- Amount Box -->
              <div style="margin-top:24px;padding:16px;background-color:#6D1ED4;color:#fff;border-radius:8px">
                <p style="font-size:18px;font-weight:600;margin:0">${copy.amountLabel} ${amount}</p>
              </div>
            </div>

            ${
              data.message
                ? `
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#ffffff;border-left:4px solid #6D1ED4;padding:16px;border-radius:4px">
                <p style="font-size:14px;font-weight:600;color:#374151;margin:0 0 8px 0">${copy.messageLabel}</p>
                <p style="font-size:16px;color:#111827;margin:0">${data.message}</p>
              </div>
            </div>
            `
                : ""
            }

            <!-- Payment Details Card -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #dfdfdf;border-radius:8px;padding:20px">
                <h3 style="font-weight:700;font-size:16px;margin:0 0 16px 0">${copy.transferDetailsHeading}</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.dateLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${date}</p>
                    </td>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.referenceNumberLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${data.transferId}</p>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.fromLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${data.senderName || "Banking System"}</p>
                    </td>
                    <td valign="top" width="50%">
                      <p style="font-size:14px;color:#404040;margin:0 0 4px 0">${copy.amountDetailLabel}</p>
                      <p style="font-size:16px;margin:0;word-break:break-all">${amount}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Deposit Button -->
            <div style="padding:0 72px;margin-top:32px;text-align:center">
              <a href="${data.depositLink}" style="display:inline-block;background-color:#6D1ED4;color:#fff;font-weight:700;padding:16px 32px;font-size:16px;border-radius:8px;text-decoration:none">${copy.depositCta}</a>
            </div>

            <!-- How it Works -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #dfdfdf;border-radius:8px;padding:20px">
                <h3 style="font-weight:700;font-size:16px;margin:0 0 16px 0">${copy.howToDepositHeading}</h3>
                <ol style="margin:0;padding-left:20px;font-size:14px;color:#404040;line-height:1.8">
                  ${copy.depositSteps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
              </div>
            </div>

            <!-- Compliance Footer -->
            <div style="padding:0 72px;margin-top:32px">
              <div style="background-color:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px">
                <p style="font-size:11px;line-height:16px;color:#6b7280;margin:0">
                  <strong>${copy.complianceTitle}</strong><br/>
                  ${copy.complianceBody}
                </p>
              </div>
            </div>

            <!-- Email Footer Info -->
            <div style="padding:0 72px;margin-top:48px">
              <div style="text-align:center">
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;margin-bottom:16px">
                  <a href="https://www.zellepay.com/faq" style="color:#2563eb" target="_blank">FAQ</a>
                  <span style="color:#c5b9ac">|</span>
                  <span style="font-style:italic;color:#404040">This is a secure transaction.</span>
                  <span style="display:inline-block;width:11px;height:14px;background:#666;border-radius:2px;margin-left:4px"></span>
                </div>
                <p style="font-size:12px;color:#666;font-style:italic;margin:0 0 16px 0">
                  For your security, please do not forward this email as it contains confidential information meant only for you.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding:32px;border-top:1px solid #e5e7eb">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="top" width="50%">
                  <img alt="Zelle" style="height:40px;display:block" src="https://www.zellepay.com/sites/default/files/2018-05/zelle-logo-hd.png" />
                </td>
                <td valign="top" width="50%" style="text-align:right;font-size:14px">
                  <p style="margin:0">© 2025 Early Warning Services, LLC</p>
                  <p style="margin:0">All rights reserved.</p>
                  <a href="https://www.zellepay.com/user-service-agreement" style="color:#2563eb" target="_blank">User Service Agreement</a>
                  <p style="margin:4px 0 0 0">Zelle and the Zelle related marks</p>
                  <p style="margin:0">are wholly owned by Early Warning Services, LLC</p>
                </td>
              </tr>
            </table>
            <div style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px">
              <p style="font-size:12px;color:#373737;line-height:1.6;margin:0">
                Zelle moves money directly between bank accounts in minutes.<br/><br/>
                This email was sent to you on behalf of <strong>${data.senderName || "Global Payments v2 Banking System"}</strong> at <strong>${data.institution || "QuantumYield Holdings | Treasury & Vault Portal"}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  const body = mode === "dual" ? `${renderOne("en")}<div style="height:32px"></div>${renderOne("fr")}` : renderOne(mode)

  return wrapEmail(body)
}
