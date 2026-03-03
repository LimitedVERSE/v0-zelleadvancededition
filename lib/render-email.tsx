import { renderToStaticMarkup } from "react-dom/server"
import { ZelleEmailLayout } from "@/components/email/zelle-email-layout"
import { TransferCard } from "@/components/email/transfer-card"
import { MessageSection } from "@/components/email/message-section"

interface EmailData {
  recipientName: string
  amount: number
  message?: string
  transferId: string
  depositLink: string
}

export function renderZelleEmail(data: EmailData): string {
  const emailComponent = (
    <ZelleEmailLayout senderName="Your Institution" institution="Your Bank">
      <MessageSection
        recipientName={data.recipientName}
        greeting={`Hi ${data.recipientName},`}
        description="You've received a secure Zelle payment."
      />

      <TransferCard
        amount={data.amount}
        message={data.message}
        depositLink={data.depositLink}
        transferId={data.transferId}
      />
    </ZelleEmailLayout>
  )

  const html = renderToStaticMarkup(emailComponent)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Zelle Payment</title>
  <style>
    body { margin: 0; padding: 0; }
    img { border: 0; display: block; }
    table { border-collapse: collapse; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `
}
