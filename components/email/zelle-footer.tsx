interface ZelleFooterProps {
  senderName?: string
  institution?: string
}

export function ZelleFooter({ senderName = "Sender", institution = "Financial Institution" }: ZelleFooterProps) {
  return (
    <div className="px-8 py-8 border-t">
      <div className="flex items-start justify-between mb-4">
        <div className="h-16 w-32">
          <img
            src="https://www.zellepay.com/sites/default/files/2018-05/zelle-logo-hd.png"
            alt="Zelle"
            className="h-16 block"
          />
        </div>
        <div className="text-right text-sm">
          <p>© 2025 Early Warning Services, LLC.</p>
          <p>All rights reserved.</p>
          <a href="https://www.zellepay.com/user-service-agreement" className="text-blue-600 hover:underline">
            User Service Agreement
          </a>
          <p className="mt-1">Zelle and the Zelle related marks</p>
          <p>are wholly owned by Early Warning Services, LLC</p>
          <p>and are used herein under license.</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-[#373737]">
          Zelle moves money directly between bank accounts in minutes. Funds are typically available within minutes when
          the recipient is already enrolled.
          <br />
          <br />
          This email was sent to you on behalf of <strong>{senderName}</strong> at <strong>{institution}</strong>.
        </p>
      </div>
    </div>
  )
}
