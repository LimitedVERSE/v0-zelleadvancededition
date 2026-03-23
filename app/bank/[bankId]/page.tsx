import { getBankConnector } from "@/services/bankConnectorService"
import BankConnectorScreen from "@/components/BankConnectorScreen"

interface BankConnectorPageProps {
  params: Promise<{ bankId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BankConnectorPage({ params, searchParams }: BankConnectorPageProps) {
  const { bankId } = await params
  const sp = await searchParams
  const connector = await getBankConnector(bankId)

  // Merge transfer context from URL params into connector so BankConnectorScreen can display it
  const connectorWithContext = {
    ...connector,
    transferId: typeof sp.transferId === "string" ? sp.transferId : undefined,
    transferAmount: typeof sp.amount === "string" ? sp.amount : undefined,
    transferRecipient: typeof sp.recipient === "string" ? sp.recipient : undefined,
    transferRecipientName: typeof sp.recipientName === "string" ? sp.recipientName : undefined,
    transferMessage: typeof sp.message === "string" ? sp.message : undefined,
    transferTimestamp: typeof sp.timestamp === "string" ? sp.timestamp : undefined,
  }

  return <BankConnectorScreen connector={connectorWithContext} />
}

export function generateMetadata({ params }: { params: Promise<{ bankId: string }> }) {
  return {
    title: "Redirecting to Bank - Zelle Money Transfer",
    description: "Securely connecting to your financial institution",
  }
}
