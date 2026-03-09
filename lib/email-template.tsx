interface EmailData {
  recipientName: string
  amount: number
  message?: string
  transferId: string
  depositLink: string
  senderName?: string
  institution?: string
}

const ZELLE_LOGO_URL = "/images/zelle.svg"

export function generateZelleEmailHtml(data: EmailData): string {
  const {
    recipientName,
    amount,
    message,
    transferId,
    depositLink,
    senderName = "Your Institution",
    institution = "Banking System",
  } = data

  const formattedAmount = amount.toFixed(2)
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentDateFr = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zelle Payment</title>
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
    .amount-box {
      background-color: #6D1ED4;
      color: #ffffff;
      padding: 16px;
      border-radius: 6px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 24px 0;
    }
    .details-card {
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .details-card h3 {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #666666;
      font-size: 14px;
    }
    .detail-value {
      color: #000000;
      font-size: 14px;
      text-align: right;
    }
    .message-box {
      background-color: #f9f9f9;
      border-left: 4px solid #6D1ED4;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .message-box strong {
      display: block;
      margin-bottom: 8px;
      color: #000000;
    }
    .button-section {
      text-align: center;
      margin: 32px 0;
    }
    .deposit-button {
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
    .deposit-button:hover {
      background-color: #5a18b5;
    }
    .instructions {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .instructions h4 {
      margin-top: 0;
      font-size: 16px;
    }
    .instructions ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .security-notice {
      font-size: 13px;
      color: #666666;
      font-style: italic;
      text-align: center;
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
      .detail-row {
        flex-direction: column;
        gap: 4px;
      }
      .detail-value {
        text-align: left;
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
        <div class="greeting-section">
          <h1>Hi ${recipientName},</h1>
          <p>You've received a secure Zelle payment.</p>

          <div class="amount-box">
            Amount: $${formattedAmount} USD
          </div>

          <div class="details-card">
            <h3>Payment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${currentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">From:</span>
              <span class="detail-value">${institution}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment ID:</span>
              <span class="detail-value">${transferId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">$${formattedAmount} USD</span>
            </div>
          </div>

          ${
            message
              ? `<div class="message-box">
            <strong>Message (Optional):</strong>
            ${message}
          </div>`
              : ""
          }

          <div class="button-section">
            <a href="${depositLink}" class="deposit-button">View Your Payment</a>
          </div>

          <div class="instructions">
            <h4>How Zelle works:</h4>
            <ol>
              <li>Funds are sent directly between bank accounts.</li>
              <li>Money is typically available within minutes.</li>
              <li>Check your bank account or Zelle app to see the payment.</li>
              <li>No need to answer security questions - it's automatic!</li>
            </ol>
          </div>

          <p class="security-notice">
            This is a secure transaction. For your security, please do not forward this email as it contains confidential information meant only for you.
          </p>
        </div>
      </div>

      <!-- French Content Section -->
      <div class="lang-section" data-lang="fr">
        <div class="greeting-section">
          <h1>Bonjour ${recipientName},</h1>
          <p>Vous avez reçu un paiement Zelle sécurisé.</p>

          <div class="amount-box">
            Montant : ${formattedAmount} $ USD
          </div>

          <div class="details-card">
            <h3>Détails du paiement</h3>
            <div class="detail-row">
              <span class="detail-label">Date :</span>
              <span class="detail-value">${currentDateFr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">De :</span>
              <span class="detail-value">${institution}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID du paiement :</span>
              <span class="detail-value">${transferId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Montant :</span>
              <span class="detail-value">${formattedAmount} $ USD</span>
            </div>
          </div>

          ${
            message
              ? `<div class="message-box">
            <strong>Message (facultatif) :</strong>
            ${message}
          </div>`
              : ""
          }

          <div class="button-section">
            <a href="${depositLink}" class="deposit-button">Voir votre paiement</a>
          </div>

          <div class="instructions">
            <h4>Comment fonctionne Zelle :</h4>
            <ol>
              <li>Les fonds sont envoyés directement entre comptes bancaires.</li>
              <li>L'argent est généralement disponible en quelques minutes.</li>
              <li>Vérifiez votre compte bancaire ou l'application Zelle pour voir le paiement.</li>
              <li>Pas besoin de répondre à des questions de sécurité - c'est automatique!</li>
            </ol>
          </div>

          <p class="security-notice">
            Ceci est une transaction sécurisée. Pour votre sécurité, veuillez ne pas transférer cet courriel car il contient des informations confidentielles destinées uniquement à vous.
          </p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 Early Warning Services, LLC. This email was sent to you on behalf of <strong>${institution}</strong> at <strong>${senderName}</strong>.</p>
      <p style="margin-top: 8px;">
        <a href="https://www.zellepay.com/user-service-agreement">User Service Agreement</a>
      </p>
      <p style="margin-top: 8px;">This is an automated email. Please do not reply to this message.</p>
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
    supportLink = "https://support.zellepay.com",
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
