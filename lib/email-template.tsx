interface EmailData {
  recipientName: string
  amount: number
  message?: string
  transferId: string
  depositLink: string
  senderName?: string
  institution?: string
}

const ZELLE_LOGO_URL =
  "https://www.zelle.com/themes/custom/zelle/images/zelle-logo-white.png"

const ZELLE_FOOTER_LOGO_URL =
  "https://www.earlywarning.com/sites/default/files/2025-09/Zelle-logo-no-tagline-RGB-purple_0.png"

export function generateZelleEmailHtml(data: EmailData): string {
  const {
    recipientName,
    amount,
    message,
    transferId,
    depositLink,
    senderName = "Your Institution",
  } = data

  const formattedAmount = `$${amount.toFixed(2)}`
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const messageBlock = message
    ? `
      <tr>
        <td style="padding:24px 64px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e2e2;border-left:4px solid #6D1ED4">
            <tr>
              <td style="padding:16px">
                <div style="font-size:13px;color:#666;margin-bottom:6px">Message from sender</div>
                <div style="font-size:15px;color:#111">${message}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : ""

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Notification</title>
<style>
body{margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif}
table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}
img{border:0;display:block}
a{text-decoration:none}
@media only screen and (max-width:600px){
  .container{width:100% !important}
  .padding{padding:24px !important}
}
</style>
</head>
<body>

<table width="100%" bgcolor="#f5f5f5" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table class="container" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff">

<!-- HEADER -->
<tr bgcolor="#6D1ED4">
<td style="padding:16px 32px;border-bottom:4px solid #6D1ED4">
  <table width="100%">
  <tr>
    <td align="left">
      <img src="${ZELLE_LOGO_URL}" width="120" alt="Zelle">
    </td>
    <td align="right" style="font-size:13px">
      <a href="#" style="color:#fff">View in browser</a>
      <span style="color:#fff"> | </span>
      <a href="#" style="color:#fff">Support</a>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- HERO -->
<tr>
<td bgcolor="#f9f9f9" class="padding" style="padding:40px 64px">
  <h2 style="margin:0;font-size:24px;color:#111">You've received a payment</h2>
  <p style="margin:12px 0 0 0;font-size:16px;color:#444">Hello <strong>${recipientName}</strong>,</p>
  <p style="margin:8px 0 0 0;font-size:16px;color:#444">${senderName} sent you money with Zelle.</p>
</td>
</tr>

<!-- AMOUNT -->
<tr>
<td align="center" style="padding:24px">
  <table width="80%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" bgcolor="#6D1ED4" style="padding:20px;color:#ffffff">
      <div style="font-size:14px;opacity:.9">Payment Amount</div>
      <div style="font-size:28px;font-weight:bold">${formattedAmount}</div>
    </td>
  </tr>
  </table>
</td>
</tr>

${messageBlock}

<!-- DETAILS -->
<tr>
<td style="padding:24px 64px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e2e2">
    <tr>
      <td style="padding:12px;font-size:13px;color:#666">Date</td>
      <td style="padding:12px;font-size:15px;color:#111">${currentDate}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">Reference</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${transferId}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">From</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${senderName}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">Amount</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${formattedAmount}</td>
    </tr>
  </table>
</td>
</tr>

<!-- BUTTON -->
<tr>
<td align="center" style="padding:32px">
  <table cellpadding="0" cellspacing="0">
  <tr>
    <td bgcolor="#6D1ED4" style="border-radius:6px">
      <a href="${depositLink}" style="display:inline-block;padding:16px 32px;color:#ffffff;font-size:16px;font-weight:bold">
        Accept Payment
      </a>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- HOW IT WORKS -->
<tr>
<td style="padding:24px 64px">
  <h3 style="margin:0 0 12px 0;font-size:16px;color:#111">How to receive your payment</h3>
  <ol style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:1.7">
    <li>Click the Accept Payment button above</li>
    <li>Select your bank account</li>
    <li>Confirm the deposit</li>
    <li>The funds will appear in minutes</li>
  </ol>
</td>
</tr>

<!-- SECURITY -->
<tr>
<td style="padding:24px 64px">
  <div style="font-size:12px;color:#666;line-height:1.6">
    <strong>Security Notice</strong><br>
    For your protection, do not forward this email.
    This message contains confidential financial information intended only for the recipient.
  </div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:32px;border-top:1px solid #e5e5e5">
  <table width="100%">
  <tr>
    <td align="left">
      <img src="${ZELLE_FOOTER_LOGO_URL}" width="110" alt="Zelle">
    </td>
    <td align="right" style="font-size:12px;color:#666">
      &copy; 2026 Early Warning Services, LLC<br>All rights reserved
    </td>
  </tr>
  </table>
  <div style="margin-top:16px;font-size:12px;color:#666;line-height:1.6">
    Zelle&reg; and the Zelle related marks are wholly owned by Early Warning Services, LLC.
  </div>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
}

export function generatePendingDepositEmailHtml(data: EmailData): string {
  const {
    recipientName,
    amount,
    message,
    transferId,
    depositLink,
    senderName = "Your Institution",
  } = data

  const formattedAmount = `$${amount.toFixed(2)}`
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const messageBlock = message
    ? `
<tr>
<td style="padding:24px 64px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e2e2;border-left:4px solid #6D1ED4">
    <tr>
      <td style="padding:16px">
        <div style="font-size:13px;color:#666;margin-bottom:6px">Message from sender</div>
        <div style="font-size:15px;color:#111">${message}</div>
      </td>
    </tr>
  </table>
</td>
</tr>`
    : ""

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pending Deposit Notification</title>
<style>
body{margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif}
table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}
img{border:0;display:block}
a{text-decoration:none}
@media only screen and (max-width:600px){
  .container{width:100% !important}
  .padding{padding:24px !important}
}
</style>
</head>
<body>

<table width="100%" bgcolor="#f5f5f5" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table class="container" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff">

<!-- HEADER -->
<tr bgcolor="#6D1ED4">
<td style="padding:16px 32px;border-bottom:4px solid #6D1ED4">
  <table width="100%">
  <tr>
    <td align="left">
      <img src="${ZELLE_LOGO_URL}" width="120" alt="Zelle">
    </td>
    <td align="right" style="font-size:13px">
      <a href="#" style="color:#fff">View in browser</a>
      <span style="color:#fff"> | </span>
      <a href="#" style="color:#fff">Support</a>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- HERO -->
<tr>
<td bgcolor="#f9f9f9" class="padding" style="padding:40px 64px">
  <h2 style="margin:0;font-size:24px;color:#111">You have a pending deposit</h2>
  <p style="margin:12px 0 0 0;font-size:16px;color:#444">Hello <strong>${recipientName}</strong>,</p>
  <p style="margin:8px 0 0 0;font-size:16px;color:#444">${senderName} has initiated a Zelle deposit to your account. Please accept it to complete the transfer.</p>
</td>
</tr>

<!-- AMOUNT -->
<tr>
<td align="center" style="padding:24px">
  <table width="80%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" bgcolor="#6D1ED4" style="padding:20px;color:#ffffff">
      <div style="font-size:14px;opacity:.9">Pending Deposit Amount</div>
      <div style="font-size:28px;font-weight:bold">${formattedAmount}</div>
    </td>
  </tr>
  </table>
</td>
</tr>

${messageBlock}

<!-- DETAILS -->
<tr>
<td style="padding:24px 64px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e2e2">
    <tr>
      <td style="padding:12px;font-size:13px;color:#666">Date</td>
      <td style="padding:12px;font-size:15px;color:#111">${currentDate}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">Reference</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${transferId}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">From</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${senderName}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">Amount</td>
      <td style="padding:12px;font-size:15px;color:#111;border-top:1px solid #f0f0f0">${formattedAmount}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-size:13px;color:#666;border-top:1px solid #f0f0f0">Status</td>
      <td style="padding:12px;font-size:15px;border-top:1px solid #f0f0f0">
        <span style="display:inline-block;padding:2px 10px;background:#fff8e1;color:#b45309;border:1px solid #fcd34d;border-radius:4px;font-size:13px;font-weight:bold">Pending</span>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- BUTTON -->
<tr>
<td align="center" style="padding:32px">
  <table cellpadding="0" cellspacing="0">
  <tr>
    <td bgcolor="#6D1ED4" style="border-radius:6px">
      <a href="${depositLink}" style="display:inline-block;padding:16px 32px;color:#ffffff;font-size:16px;font-weight:bold">
        Accept Deposit
      </a>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- HOW IT WORKS -->
<tr>
<td style="padding:24px 64px">
  <h3 style="margin:0 0 12px 0;font-size:16px;color:#111">How to accept your deposit</h3>
  <ol style="margin:0;padding-left:20px;color:#444;font-size:14px;line-height:1.7">
    <li>Click the Accept Deposit button above</li>
    <li>Select your bank account</li>
    <li>Confirm the deposit</li>
    <li>The funds will appear in your account within minutes</li>
  </ol>
</td>
</tr>

<!-- SECURITY -->
<tr>
<td style="padding:24px 64px">
  <div style="font-size:12px;color:#666;line-height:1.6">
    <strong>Security Notice</strong><br>
    For your protection, do not forward this email.
    This message contains confidential financial information intended only for the recipient.
  </div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:32px;border-top:1px solid #e5e5e5">
  <table width="100%">
  <tr>
    <td align="left">
      <img src="${ZELLE_FOOTER_LOGO_URL}" width="110" alt="Zelle">
    </td>
    <td align="right" style="font-size:12px;color:#666">
      &copy; 2026 Early Warning Services, LLC<br>All rights reserved
    </td>
  </tr>
  </table>
  <div style="margin-top:16px;font-size:12px;color:#666;line-height:1.6">
    Zelle&reg; and the Zelle related marks are wholly owned by Early Warning Services, LLC.
  </div>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
}

export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export function renderZelleEmail(data: EmailData, mode: EmailLangMode = "en"): string {
  return generateZelleEmailHtml(data)
}

// ---------------------------------------------------------------------------
// Bank-branded template types
// ---------------------------------------------------------------------------

export type BankEmailTemplateType =
  | "payment"
  | "upgrade-warning"
  | "bank-payment"
  | "bank-security-alert"
  | "bank-account-verify"
  | "bank-pending-deposit"

export interface BankBrandedEmailData {
  recipientName: string
  recipientEmail?: string
  amount?: number
  transferId?: string
  depositLink?: string
  message?: string
  bankName: string
  bankLogo?: string
  bankColor?: string
  bankWebsite?: string
  institution?: string
}

// Per-bank brand colors (fallback to Zelle purple if unknown)
const BANK_COLORS: Record<string, string> = {
  chase: "#117ACA",
  bofa: "#E31837",
  "wells-fargo": "#D71E28",
  citibank: "#003B70",
  usbank: "#002677",
  pnc: "#E86100",
  "capital-one": "#004977",
  truist: "#4B286D",
  "td-bank": "#34A853",
  "bmo-harris": "#0075BE",
  "fifth-third": "#1B4D3E",
  regions: "#005A3C",
  ally: "#6E00CC",
  marcus: "#00A877",
  discover: "#FF6600",
  "navy-federal": "#002F6C",
}

function getBankColor(bankId: string, fallback = "#6D1ED4"): string {
  return BANK_COLORS[bankId] ?? fallback
}

function baseEmailWrap(content: string, bankName: string, bankLogo: string | undefined, bankColor: string): string {
  const logoBlock = bankLogo
    ? `<img src="${bankLogo}" alt="${bankName}" style="height:40px;max-width:160px;object-fit:contain;display:block;">`
    : `<span style="font-size:20px;font-weight:bold;color:#fff;">${bankName}</span>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif}
table{border-collapse:collapse}
img{border:0;display:block}
a{text-decoration:none}
@media only screen and (max-width:600px){.container{width:100%!important}.padded{padding:20px!important}}
</style>
</head>
<body>
<table width="100%" bgcolor="#f4f4f7" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px">

<table class="container" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">

<!-- HEADER -->
<tr>
<td bgcolor="${bankColor}" style="padding:20px 32px">
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:180px">${logoBlock}</td>
    <td align="right">
      <span style="font-size:11px;color:rgba(255,255,255,0.8)">Powered by Zelle&reg;</span>
    </td>
  </tr>
  </table>
</td>
</tr>

<!-- COLOR STRIPE -->
<tr><td style="height:4px;background:linear-gradient(90deg,${bankColor},#6D1ED4)"></td></tr>

${content}

<!-- FOOTER -->
<tr>
<td style="padding:24px 32px;border-top:1px solid #e8e8e8;background:#fafafa">
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="font-size:11px;color:#888;line-height:1.6">
      This message was sent on behalf of <strong>${bankName}</strong> via the Zelle&reg; network.<br>
      Zelle&reg; and the Zelle related marks are wholly owned by Early Warning Services, LLC.<br>
      &copy; 2026 Early Warning Services, LLC. All rights reserved.
    </td>
  </tr>
  </table>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`
}

// Template 1 – Bank Payment Notification (with bank logo)
export function generateBankPaymentEmail(data: BankBrandedEmailData): string {
  const {
    recipientName,
    amount = 25,
    transferId = `ZEL-${Date.now().toString().slice(-6)}`,
    depositLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation",
    message,
    bankName,
    bankLogo,
    bankColor = "#6D1ED4",
    institution = "QuantumYield Treasury",
  } = data

  const formattedAmount = `$${amount.toFixed(2)}`
  const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const msgBlock = message
    ? `<tr><td style="padding:0 32px 24px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid ${bankColor};background:#f9f9f9">
          <tr><td style="padding:14px 16px">
            <div style="font-size:12px;color:#888;margin-bottom:4px">Message from sender</div>
            <div style="font-size:14px;color:#222">${message}</div>
          </td></tr>
        </table>
      </td></tr>`
    : ""

  const content = `
<!-- HERO -->
<tr><td class="padded" style="padding:36px 32px 24px">
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111">You've received a payment</h2>
  <p style="margin:0;font-size:15px;color:#555">Hello <strong>${recipientName}</strong>, ${institution} sent you money via ${bankName} using Zelle.</p>
</td></tr>

<!-- AMOUNT BADGE -->
<tr><td align="center" style="padding:0 32px 24px">
  <table cellpadding="0" cellspacing="0" style="width:100%">
  <tr><td align="center" bgcolor="${bankColor}" style="padding:24px;border-radius:8px">
    <div style="font-size:12px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Payment Amount</div>
    <div style="font-size:36px;font-weight:700;color:#fff">${formattedAmount}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px">USD via ${bankName}</div>
  </td></tr>
  </table>
</td></tr>

${msgBlock}

<!-- DETAILS TABLE -->
<tr><td style="padding:0 32px 24px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden">
    <tr style="background:#f9f9f9"><td style="padding:10px 16px;font-size:12px;color:#888;width:120px">Date</td><td style="padding:10px 16px;font-size:14px;color:#222">${currentDate}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Reference</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0;font-family:monospace">${transferId}</td></tr>
    <tr style="background:#f9f9f9"><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">From</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0">${institution}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Bank</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0">${bankName}</td></tr>
  </table>
</td></tr>

<!-- CTA -->
<tr><td align="center" style="padding:0 32px 36px">
  <table cellpadding="0" cellspacing="0">
  <tr><td bgcolor="${bankColor}" style="border-radius:6px">
    <a href="${depositLink}" style="display:inline-block;padding:14px 36px;color:#fff;font-size:15px;font-weight:700">Accept Payment</a>
  </td></tr>
  </table>
  <p style="margin:12px 0 0;font-size:11px;color:#aaa">This link expires in 48 hours</p>
</td></tr>

<!-- SECURITY NOTE -->
<tr><td style="padding:0 32px 24px">
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:14px 16px">
    <div style="font-size:12px;color:#92400e;line-height:1.6"><strong>Security Notice:</strong> ${bankName} will never ask for your password, PIN, or one-time passcode via email. Do not forward this message.</div>
  </div>
</td></tr>`

  return baseEmailWrap(content, bankName, bankLogo, bankColor)
}

// Template 2 – Bank Security Alert
export function generateBankSecurityAlertEmail(data: BankBrandedEmailData): string {
  const {
    recipientName,
    bankName,
    bankLogo,
    bankColor = "#6D1ED4",
    depositLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation",
    institution = "QuantumYield Holdings",
  } = data

  const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

  const content = `
<!-- ALERT BANNER -->
<tr><td style="padding:0">
  <div style="background:#dc2626;padding:14px 32px;display:flex;align-items:center;gap:12px">
    <div style="font-size:14px;font-weight:700;color:#fff;text-align:center;width:100%">SECURITY ALERT — Immediate Action Required</div>
  </div>
</td></tr>

<!-- HERO -->
<tr><td class="padded" style="padding:32px 32px 20px">
  <h2 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111">Unusual Sign-In Activity Detected</h2>
  <p style="margin:0;font-size:15px;color:#555">Hello <strong>${recipientName}</strong>, we detected unusual account activity on your ${bankName} account linked to Zelle.</p>
</td></tr>

<!-- EVENT DETAIL -->
<tr><td style="padding:0 32px 24px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fecaca;border-radius:6px;background:#fef2f2;overflow:hidden">
    <tr><td style="padding:10px 16px;font-size:12px;color:#991b1b;width:140px">Event</td><td style="padding:10px 16px;font-size:14px;color:#222">Unrecognized device login</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#991b1b;border-top:1px solid #fecaca">Date / Time</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #fecaca">${currentDate}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#991b1b;border-top:1px solid #fecaca">Institution</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #fecaca">${institution}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#991b1b;border-top:1px solid #fecaca">Status</td><td style="padding:10px 16px;font-size:14px;border-top:1px solid #fecaca"><span style="background:#dc2626;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">FLAGGED</span></td></tr>
  </table>
</td></tr>

<!-- STEPS -->
<tr><td style="padding:0 32px 24px">
  <h3 style="margin:0 0 12px;font-size:15px;color:#111">Steps to secure your account</h3>
  <ol style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:1.9">
    <li>Click the button below to verify your identity</li>
    <li>Change your ${bankName} online banking password immediately</li>
    <li>Review recent transactions for any unauthorized activity</li>
    <li>Enable two-factor authentication if not already active</li>
  </ol>
</td></tr>

<!-- CTA -->
<tr><td align="center" style="padding:0 32px 32px">
  <table cellpadding="0" cellspacing="0">
  <tr><td bgcolor="#dc2626" style="border-radius:6px">
    <a href="${depositLink}" style="display:inline-block;padding:14px 36px;color:#fff;font-size:15px;font-weight:700">Secure My Account Now</a>
  </td></tr>
  </table>
  <p style="margin:12px 0 0;font-size:11px;color:#aaa">If this was you, no action is needed</p>
</td></tr>`

  return baseEmailWrap(content, bankName, bankLogo, bankColor)
}

// Template 3 – Account Verification / KYC
export function generateBankAccountVerifyEmail(data: BankBrandedEmailData): string {
  const {
    recipientName,
    bankName,
    bankLogo,
    bankColor = "#6D1ED4",
    depositLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation",
    institution = "QuantumYield Holdings",
    transferId = `VER-${Date.now().toString().slice(-8)}`,
  } = data

  const content = `
<!-- HERO -->
<tr><td class="padded" style="padding:36px 32px 20px">
  <div style="width:56px;height:56px;background:${bankColor};border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
    <div style="width:56px;height:56px;line-height:56px;text-align:center;font-size:28px">&#10003;</div>
  </div>
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;text-align:center">Verify Your Account</h2>
  <p style="margin:0;font-size:15px;color:#555;text-align:center">Hello <strong>${recipientName}</strong>, please complete identity verification to activate Zelle on your ${bankName} account.</p>
</td></tr>

<!-- BADGE -->
<tr><td align="center" style="padding:0 32px 24px">
  <table cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;width:80%">
    <tr bgcolor="#f9f9f9"><td style="padding:10px 20px;font-size:12px;color:#888">Verification ID</td><td style="padding:10px 20px;font-size:13px;font-family:monospace;color:#222">${transferId}</td></tr>
    <tr><td style="padding:10px 20px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Institution</td><td style="padding:10px 20px;font-size:13px;color:#222;border-top:1px solid #f0f0f0">${institution}</td></tr>
    <tr bgcolor="#f9f9f9"><td style="padding:10px 20px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Bank</td><td style="padding:10px 20px;font-size:13px;color:#222;border-top:1px solid #f0f0f0">${bankName}</td></tr>
    <tr><td style="padding:10px 20px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Link Expires</td><td style="padding:10px 20px;font-size:13px;color:#dc2626;font-weight:700;border-top:1px solid #f0f0f0">24 hours</td></tr>
  </table>
</td></tr>

<!-- WHAT YOU NEED -->
<tr><td style="padding:0 32px 24px">
  <h3 style="margin:0 0 12px;font-size:15px;color:#111">What you'll need</h3>
  <div style="display:grid;gap:8px">
    <div style="background:#f4f4f7;border-radius:6px;padding:12px 16px;font-size:14px;color:#444;border-left:4px solid ${bankColor}">Government-issued photo ID (passport or driver's license)</div>
    <div style="background:#f4f4f7;border-radius:6px;padding:12px 16px;font-size:14px;color:#444;border-left:4px solid ${bankColor}">Last 4 digits of your Social Security Number</div>
    <div style="background:#f4f4f7;border-radius:6px;padding:12px 16px;font-size:14px;color:#444;border-left:4px solid ${bankColor}">Access to your ${bankName} account credentials</div>
  </div>
</td></tr>

<!-- CTA -->
<tr><td align="center" style="padding:0 32px 32px">
  <table cellpadding="0" cellspacing="0">
  <tr><td bgcolor="${bankColor}" style="border-radius:6px">
    <a href="${depositLink}" style="display:inline-block;padding:14px 36px;color:#fff;font-size:15px;font-weight:700">Verify My Identity</a>
  </td></tr>
  </table>
  <p style="margin:12px 0 0;font-size:11px;color:#aaa">This link is single-use and expires in 24 hours</p>
</td></tr>

<!-- SECURITY -->
<tr><td style="padding:0 32px 24px">
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:14px 16px">
    <div style="font-size:12px;color:#166534;line-height:1.6"><strong>Privacy Protected:</strong> ${bankName} and Zelle use bank-level 256-bit encryption. Your information is never shared with third parties.</div>
  </div>
</td></tr>`

  return baseEmailWrap(content, bankName, bankLogo, bankColor)
}

// Template 4 – Bank Pending Deposit (bank-branded version of existing template)
export function generateBankPendingDepositEmail(data: BankBrandedEmailData): string {
  const {
    recipientName,
    amount = 25,
    transferId = `ZEL-${Date.now().toString().slice(-6)}`,
    depositLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation",
    message,
    bankName,
    bankLogo,
    bankColor = "#6D1ED4",
    institution = "QuantumYield Treasury",
  } = data

  const formattedAmount = `$${amount.toFixed(2)}`
  const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const expiryDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const msgBlock = message
    ? `<tr><td style="padding:0 32px 24px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid ${bankColor};background:#f9f9f9">
          <tr><td style="padding:14px 16px">
            <div style="font-size:12px;color:#888;margin-bottom:4px">Note from sender</div>
            <div style="font-size:14px;color:#222">${message}</div>
          </td></tr>
        </table>
      </td></tr>`
    : ""

  const content = `
<!-- STATUS BANNER -->
<tr><td style="padding:0">
  <div style="background:#fef3c7;padding:10px 32px;text-align:center">
    <span style="font-size:13px;font-weight:700;color:#92400e">PENDING DEPOSIT — Action Required to Accept Funds</span>
  </div>
</td></tr>

<!-- HERO -->
<tr><td class="padded" style="padding:32px 32px 20px">
  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111">Pending Deposit via ${bankName}</h2>
  <p style="margin:0;font-size:15px;color:#555">Hello <strong>${recipientName}</strong>, ${institution} has initiated a Zelle deposit to your ${bankName} account.</p>
</td></tr>

<!-- AMOUNT -->
<tr><td align="center" style="padding:0 32px 24px">
  <table cellpadding="0" cellspacing="0" style="width:100%">
  <tr><td align="center" style="padding:24px;border-radius:8px;background:linear-gradient(135deg,${bankColor},#6D1ED4)">
    <div style="font-size:11px;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Pending Amount</div>
    <div style="font-size:40px;font-weight:700;color:#fff">${formattedAmount}</div>
    <div style="margin-top:8px"><span style="background:rgba(255,255,255,0.2);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase">Pending</span></div>
  </td></tr>
  </table>
</td></tr>

${msgBlock}

<!-- DETAILS -->
<tr><td style="padding:0 32px 24px">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden">
    <tr style="background:#f9f9f9"><td style="padding:10px 16px;font-size:12px;color:#888;width:120px">Initiated</td><td style="padding:10px 16px;font-size:14px;color:#222">${currentDate}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Expires</td><td style="padding:10px 16px;font-size:14px;color:#dc2626;font-weight:600;border-top:1px solid #f0f0f0">${expiryDate}</td></tr>
    <tr style="background:#f9f9f9"><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">Reference</td><td style="padding:10px 16px;font-size:14px;font-family:monospace;color:#222;border-top:1px solid #f0f0f0">${transferId}</td></tr>
    <tr><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">From</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0">${institution}</td></tr>
    <tr style="background:#f9f9f9"><td style="padding:10px 16px;font-size:12px;color:#888;border-top:1px solid #f0f0f0">To Bank</td><td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0">${bankName}</td></tr>
  </table>
</td></tr>

<!-- CTA -->
<tr><td align="center" style="padding:0 32px 32px">
  <table cellpadding="0" cellspacing="0">
  <tr><td bgcolor="${bankColor}" style="border-radius:6px">
    <a href="${depositLink}" style="display:inline-block;padding:14px 36px;color:#fff;font-size:15px;font-weight:700">Accept Deposit Now</a>
  </td></tr>
  </table>
  <p style="margin:12px 0 0;font-size:11px;color:#aaa">Unclaimed deposits are returned after the expiry date</p>
</td></tr>`

  return baseEmailWrap(content, bankName, bankLogo, bankColor)
}

// Utility: get bank color by ID (exported for use in UI)
export { getBankColor, BANK_COLORS }

export function generateUpgradeWarningEmail(data: {
  recipientName: string
  institution?: string
  upgradeDeadline?: string
  supportLink?: string
}): string {
  const {
    recipientName,
    institution = "QuantumYield Holdings",
    upgradeDeadline = "within 3 hours",
    supportLink = "https://www2.swift.com/mystandards/#/c/settlement-and-reconciliation",
  } = data

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Important: Gateway Upgrade Required</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #F5F5F5;
      color: #333333;
    }
    .email-container {
      max-width: 700px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .topbar {
      background-color: #ffffff;
      border-bottom: 4px solid #6D1ED4;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .topbar img {
      height: 50px;
      display: block;
    }
    .dba {
      background-color: #f3f4f6;
      color: #6b7280;
      font-weight: bold;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 4px;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .lang-toggle {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .lang-toggle span {
      color: #374151;
      font-size: 13px;
      opacity: 0.7;
      cursor: pointer;
      user-select: none;
      padding: 4px 8px;
      border-radius: 3px;
      transition: background-color 0.2s, opacity 0.2s;
    }
    .lang-toggle span:hover {
      opacity: 1;
      background-color: rgba(109, 30, 212, 0.1);
    }
    .lang-toggle span.active {
      font-weight: bold;
      text-decoration: underline;
      opacity: 1;
      background-color: #6D1ED4;
      color: #ffffff;
    }
    .brand {
      background-color: #6D1ED4;
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .content-wrapper {
      padding: 32px 24px;
    }
    .lang-section {
      display: none;
    }
    .lang-section.active {
      display: block;
    }
    .warning-banner {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }
    .greeting-section h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #000000;
    }
    .greeting-section p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .alert-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      border-radius: 6px;
      margin: 24px 0;
    }
    .alert-box h3 {
      margin-top: 0;
      color: #856404;
      font-size: 18px;
    }
    .alert-box p {
      color: #856404;
      margin: 8px 0;
    }
    .info-card {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-card h3 {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 16px;
      margin-top: 0;
      color: #6D1ED4;
    }
    .info-card ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    .info-card li {
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .button-section {
      text-align: center;
      margin: 32px 0;
    }
    .action-button {
      background-color: #6D1ED4;
      color: #ffffff;
      padding: 14px 30px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .action-button:hover {
      background-color: #5a18b5;
    }
    .deadline-box {
      background: linear-gradient(135deg, #6D1ED4 0%, #8b5cf6 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(109, 30, 212, 0.3);
    }
    .deadline-box h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    .deadline-box .deadline-text {
      font-size: 24px;
      font-weight: bold;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 16px;
      font-size: 12px;
      color: #666666;
      text-align: center;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .topbar {
        padding: 12px;
      }
      .topbar-left,
      .topbar-right {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="topbar">
      <div class="topbar-left">
        <img src="${ZELLE_LOGO_URL}" alt="Zelle" height="50">
        <div class="dba" data-lang-key="dba">Partnered with QuantumYield Holdings</div>
      </div>
      <div class="topbar-right">
        <div class="lang-toggle">
          <span class="active" data-lang="en">EN</span>
          <span data-lang="fr">FR</span>
        </div>
        <div class="brand">Zelle</div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- English Content Section -->
      <div class="lang-section active" data-lang="en">
        <div class="warning-banner">
          ⚠️ ACTION REQUIRED: Gateway Upgrade Needed
        </div>

        <div class="greeting-section">
          <h1>Hi ${recipientName},</h1>
          <p>We're writing to inform you that a critical gateway upgrade is required for your Zelle integration to continue functioning properly.</p>
        </div>

        <div class="alert-box">
          <h3>🔧 What's Happening?</h3>
          <p>Your current payment gateway configuration requires a custom upgrade to maintain compatibility with the latest Zelle security protocols and payment processing standards within the United States since your configuration under your VPS is under European IPv4-DSN & IPv6-DSN.</p>
        </div>

        <div class="deadline-box">
          <h3>Upgrade Deadline</h3>
          <div class="deadline-text">${upgradeDeadline}</div>
        </div>

        <div class="info-card">
          <h3>Why This Matters for Deposit to be Active & Successful</h3>
          <ul>
            <li><strong>Security Compliance:</strong> Ensures your gateway meets the latest PCI-DSS and banking security standards</li>
            <li><strong>Service Continuity:</strong> Prevents disruption to your payment processing capabilities</li>
            <li><strong>Enhanced Features:</strong> Access to improved transaction speeds and enhanced fraud protection</li>
            <li><strong>Regulatory Requirements:</strong> Maintains compliance with federal banking regulations</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>What You Need to Do</h3>
          <ul>
            <li>Contact our technical support team to schedule your upgrade</li>
            <li>Review the upgrade documentation provided by your integration specialist</li>
            <li>Complete the upgrade before the deadline to avoid service interruption</li>
            <li>Test your integration after the upgrade is complete</li>
          </ul>
        </div>

        <div class="button-section">
          <a href="${supportLink}" class="action-button">Contact Support Now</a>
        </div>

        <div class="greeting-section">
          <p><strong>Need Help?</strong></p>
          <p>Our technical support team is available 24/7 to assist you with the upgrade process. Please don't hesitate to reach out if you have any questions or concerns.</p>
          <p>Thank you for your prompt attention to this matter.</p>
          <p><strong>Best regards,</strong><br>${institution} Technical Support Team</p>
        </div>
      </div>

      <!-- French Content Section -->
      <div class="lang-section" data-lang="fr">
        <div class="warning-banner">
          ⚠️ ACTION REQUISE : Mise à niveau de la passerelle nécessaire
        </div>

        <div class="greeting-section">
          <h1>Bonjour ${recipientName},</h1>
          <p>Nous vous écrivons pour vous informer qu'une mise à niveau critique de la passerelle est nécessaire pour que votre intégration Zelle continue de fonctionner correctement.</p>
        </div>

        <div class="alert-box">
          <h3>🔧 Que se passe-t-il ?</h3>
          <p>Votre configuration actuelle de passerelle de paiement nécessite une mise à niveau personnalisée pour maintenir la compatibilité avec les derniers protocoles de sécurité Zelle et les normes de traitement des paiements.</p>
        </div>

        <div class="deadline-box">
          <h3>Date limite de mise à niveau</h3>
          <div class="deadline-text">${upgradeDeadline}</div>
        </div>

        <div class="info-card">
          <h3>Pourquoi c'est important</h3>
          <ul>
            <li><strong>Conformité de sécurité :</strong> Garantit que votre passerelle répond aux dernières normes de sécurité PCI-DSS et bancaires</li>
            <li><strong>Continuité du service :</strong> Évite l'interruption de vos capacités de traitement des paiements</li>
            <li><strong>Fonctionnalités améliorées :</strong> Accès à des vitesses de transaction améliorées et une protection renforcée contre la fraude</li>
            <li><strong>Exigences réglementaires :</strong> Maintient la conformité avec les réglementations bancaires fédérales</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>Ce que vous devez faire</h3>
          <ul>
            <li>Contactez notre équipe de support technique pour planifier votre mise à niveau</li>
            <li>Examinez la documentation de mise à niveau fournie par votre spécialiste d'intégration</li>
            <li>Effectuez la mise à niveau avant la date limite pour éviter toute interruption de service</li>
            <li>Testez votre intégration une fois la mise à niveau terminée</li>
          </ul>
        </div>

        <div class="button-section">
          <a href="${supportLink}" class="action-button">Contacter le support maintenant</a>
        </div>

        <div class="greeting-section">
          <p><strong>Besoin d'aide ?</strong></p>
          <p>Notre équipe de support technique est disponible 24h/24 et 7j/7 pour vous aider dans le processus de mise à niveau. N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.</p>
          <p>Merci de votre attention rapide à cette question.</p>
          <p><strong>Cordialement,</strong><br>Équipe de support technique ${institution}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 Early Warning Services, LLC. This email was sent to you on behalf of <strong>${institution}</strong>.</p>
      <p style="margin-top: 8px;">
        <a href="https://www.zellepay.com/user-service-agreement">User Service Agreement</a>
      </p>
      <p style="margin-top: 8px;">This is an automated system notification. Please do not reply to this message.</p>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const langToggles = document.querySelectorAll('.lang-toggle span[data-lang]');
      const langSections = document.querySelectorAll('.lang-section[data-lang]');
      const html = document.documentElement;

      langToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
          const selectedLang = this.getAttribute('data-lang');

          langToggles.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          html.setAttribute('lang', selectedLang);

          langSections.forEach(section => {
            if (section.getAttribute('data-lang') === selectedLang) {
              section.classList.add('active');
            } else {
              section.classList.remove('active');
            }
          });

          const dba = document.querySelector('.dba');
          if (selectedLang === 'fr') {
            dba.textContent = 'Partenaire de QuantumYield Holdings';
          } else {
            dba.textContent = 'Partnered with QuantumYield Holdings';
          }
        });
      });
    });
  </script>
</body>
</html>
`
}
