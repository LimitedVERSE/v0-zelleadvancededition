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

export type EmailLang = "en" | "fr"
export type EmailLangMode = EmailLang | "dual"

export function renderZelleEmail(data: EmailData, mode: EmailLangMode = "en"): string {
  return generateZelleEmailHtml(data)
}

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
