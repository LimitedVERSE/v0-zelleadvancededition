import type React from "react"
import { ZelleHeader } from "./zelle-header"
import { ZelleFooter } from "./zelle-footer"

interface ZelleEmailLayoutProps {
  children: React.ReactNode
  senderName?: string
  institution?: string
}

export function ZelleEmailLayout({ children, senderName, institution }: ZelleEmailLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <div className="max-w-[600px] mx-auto bg-white">
        <ZelleHeader />

        <div className="bg-[#f9f9f9] rounded-b-[24px] min-h-[600px] pb-12">
          {children}

          <div className="px-[72px] mt-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs">
                <a href="https://www.zellepay.com/faq" className="text-blue-600 hover:underline">
                  FAQ
                </a>
                <span className="text-[#c5b9ac]">|</span>
                <span className="italic text-[#404040]">This is a secure transaction.</span>
                <svg
                  width="11"
                  height="14"
                  viewBox="0 0 11 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block"
                >
                  <path
                    d="M9.5 6H9V4C9 2.067 7.433 0.5 5.5 0.5C3.567 0.5 2 2.067 2 4V6H1.5C0.948 6 0.5 6.448 0.5 7V12.5C0.5 13.052 0.948 13.5 1.5 13.5H9.5C10.052 13.5 10.5 13.052 10.5 12.5V7C10.5 6.448 10.052 6 9.5 6ZM3 4C3 2.619 4.119 1.5 5.5 1.5C6.881 1.5 8 2.619 8 4V6H3V4Z"
                    fill="#666"
                  />
                </svg>
              </div>

              <p className="text-xs text-[#666666] italic">
                For your security, please do not forward this email as it contains confidential information meant only
                for you. Zelle will never request access to this email notification from you.
              </p>

              <p className="text-xs text-[#666666]">
                Click here to{" "}
                <a href="#" className="text-blue-600 underline">
                  manage notification preferences
                </a>{" "}
                from this contact. You will still be able to receive Zelle payment notifications.
              </p>
            </div>
          </div>
        </div>

        <ZelleFooter senderName={senderName} institution={institution} />
      </div>
    </div>
  )
}
