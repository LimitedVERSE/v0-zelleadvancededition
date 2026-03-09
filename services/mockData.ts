import type { Bank, DepositInfo } from "@/types/bank"

export const mockBanks: Bank[] = [
  {
    id: "chase",
    name: "Chase",
    logo: "/chase-logo.jpg",
    loginUrl: "https://www.chase.com/",
  },
  {
    id: "bofa",
    name: "Bank of America",
    logo: "/bank-of-america-logo.jpg",
    loginUrl: "https://www.bankofamerica.com/",
  },
  {
    id: "wells-fargo",
    name: "Wells Fargo",
    logo: "/wells-fargo-logo.jpg",
    loginUrl: "https://www.wellsfargo.com/",
  },
  {
    id: "citibank",
    name: "Citibank",
    logo: "/citibank-logo.jpg",
    loginUrl: "https://online.citi.com/",
  },
  {
    id: "usbank",
    name: "U.S. Bank",
    logo: "/us-bank-logo.jpg",
    loginUrl: "https://onlinebanking.usbank.com/",
  },
  {
    id: "pnc",
    name: "PNC Bank",
    logo: "/pnc-logo.jpg",
    loginUrl: "https://www.pnc.com/",
  },
  {
    id: "capital-one",
    name: "Capital One",
    logo: "/capital-one-logo.jpg",
    loginUrl: "https://www.capitalone.com/",
  },
  {
    id: "truist",
    name: "Truist",
    logo: "/truist-logo.jpg",
    loginUrl: "https://www.truist.com/",
  },
  {
    id: "td-bank",
    name: "TD Bank",
    logo: "/td-bank-logo.jpg",
    loginUrl: "https://onlinebanking.tdbank.com/",
  },
  {
    id: "bmo-harris",
    name: "BMO Harris",
    logo: "/bmo-harris-logo.jpg",
    loginUrl: "https://www.bmoharris.com/",
  },
  {
    id: "fifth-third",
    name: "Fifth Third Bank",
    logo: "/fifth-third-logo.jpg",
    loginUrl: "https://www.53.com/",
  },
  {
    id: "regions",
    name: "Regions Bank",
    logo: "/regions-logo.jpg",
    loginUrl: "https://www.regions.com/",
  },
  {
    id: "ally",
    name: "Ally Bank",
    logo: "/ally-logo.jpg",
    loginUrl: "https://www.ally.com/",
  },
  {
    id: "marcus",
    name: "Marcus by Goldman Sachs",
    logo: "/marcus-logo.jpg",
    loginUrl: "https://www.marcus.com/",
  },
  {
    id: "discover",
    name: "Discover Bank",
    logo: "/discover-logo.jpg",
    loginUrl: "https://www.discover.com/",
  },
  {
    id: "navy-federal",
    name: "Navy Federal Credit Union",
    logo: "/navy-federal-logo.jpg",
    loginUrl: "https://www.navyfederal.org/",
  },
]

export const mockDeposit: DepositInfo = {
  amount: "25,000.00",
  currency: "USD",
  sender: "Zelle Partner Network | QuantumYield Holdings",
  expiryDate: "December 29th, 2025",
  notice: "The deposit will appear on your next statement.",
}
