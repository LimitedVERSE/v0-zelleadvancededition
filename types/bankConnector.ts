export interface BankConnector {
  bankId: string
  bankName: string
  loginUrl: string
  status: "online" | "offline" | "maintenance"
  transferId?: string
  transferAmount?: string
  transferRecipient?: string
  transferRecipientName?: string
  transferMessage?: string
  transferTimestamp?: string
}
