/**
 * US states and territories types
 */

export type StateCode =
  | "AL"
  | "AK"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "FL"
  | "GA"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY"
  | "DC"

export interface State {
  code: StateCode
  name: string
  nameEn: string
  nameFr: string
}

export const states: State[] = [
  { code: "AL", name: "Alabama", nameEn: "Alabama", nameFr: "Alabama" },
  { code: "AK", name: "Alaska", nameEn: "Alaska", nameFr: "Alaska" },
  { code: "AZ", name: "Arizona", nameEn: "Arizona", nameFr: "Arizona" },
  { code: "AR", name: "Arkansas", nameEn: "Arkansas", nameFr: "Arkansas" },
  { code: "CA", name: "California", nameEn: "California", nameFr: "Californie" },
  { code: "CO", name: "Colorado", nameEn: "Colorado", nameFr: "Colorado" },
  { code: "CT", name: "Connecticut", nameEn: "Connecticut", nameFr: "Connecticut" },
  { code: "DE", name: "Delaware", nameEn: "Delaware", nameFr: "Delaware" },
  { code: "FL", name: "Florida", nameEn: "Florida", nameFr: "Floride" },
  { code: "GA", name: "Georgia", nameEn: "Georgia", nameFr: "Géorgie" },
  { code: "HI", name: "Hawaii", nameEn: "Hawaii", nameFr: "Hawaï" },
  { code: "ID", name: "Idaho", nameEn: "Idaho", nameFr: "Idaho" },
  { code: "IL", name: "Illinois", nameEn: "Illinois", nameFr: "Illinois" },
  { code: "IN", name: "Indiana", nameEn: "Indiana", nameFr: "Indiana" },
  { code: "IA", name: "Iowa", nameEn: "Iowa", nameFr: "Iowa" },
  { code: "KS", name: "Kansas", nameEn: "Kansas", nameFr: "Kansas" },
  { code: "KY", name: "Kentucky", nameEn: "Kentucky", nameFr: "Kentucky" },
  { code: "LA", name: "Louisiana", nameEn: "Louisiana", nameFr: "Louisiane" },
  { code: "ME", name: "Maine", nameEn: "Maine", nameFr: "Maine" },
  { code: "MD", name: "Maryland", nameEn: "Maryland", nameFr: "Maryland" },
  { code: "MA", name: "Massachusetts", nameEn: "Massachusetts", nameFr: "Massachusetts" },
  { code: "MI", name: "Michigan", nameEn: "Michigan", nameFr: "Michigan" },
  { code: "MN", name: "Minnesota", nameEn: "Minnesota", nameFr: "Minnesota" },
  { code: "MS", name: "Mississippi", nameEn: "Mississippi", nameFr: "Mississippi" },
  { code: "MO", name: "Missouri", nameEn: "Missouri", nameFr: "Missouri" },
  { code: "MT", name: "Montana", nameEn: "Montana", nameFr: "Montana" },
  { code: "NE", name: "Nebraska", nameEn: "Nebraska", nameFr: "Nebraska" },
  { code: "NV", name: "Nevada", nameEn: "Nevada", nameFr: "Nevada" },
  { code: "NH", name: "New Hampshire", nameEn: "New Hampshire", nameFr: "New Hampshire" },
  { code: "NJ", name: "New Jersey", nameEn: "New Jersey", nameFr: "New Jersey" },
  { code: "NM", name: "New Mexico", nameEn: "New Mexico", nameFr: "Nouveau-Mexique" },
  { code: "NY", name: "New York", nameEn: "New York", nameFr: "New York" },
  { code: "NC", name: "North Carolina", nameEn: "North Carolina", nameFr: "Caroline du Nord" },
  { code: "ND", name: "North Dakota", nameEn: "North Dakota", nameFr: "Dakota du Nord" },
  { code: "OH", name: "Ohio", nameEn: "Ohio", nameFr: "Ohio" },
  { code: "OK", name: "Oklahoma", nameEn: "Oklahoma", nameFr: "Oklahoma" },
  { code: "OR", name: "Oregon", nameEn: "Oregon", nameFr: "Oregon" },
  { code: "PA", name: "Pennsylvania", nameEn: "Pennsylvania", nameFr: "Pennsylvanie" },
  { code: "RI", name: "Rhode Island", nameEn: "Rhode Island", nameFr: "Rhode Island" },
  { code: "SC", name: "South Carolina", nameEn: "South Carolina", nameFr: "Caroline du Sud" },
  { code: "SD", name: "South Dakota", nameEn: "South Dakota", nameFr: "Dakota du Sud" },
  { code: "TN", name: "Tennessee", nameEn: "Tennessee", nameFr: "Tennessee" },
  { code: "TX", name: "Texas", nameEn: "Texas", nameFr: "Texas" },
  { code: "UT", name: "Utah", nameEn: "Utah", nameFr: "Utah" },
  { code: "VT", name: "Vermont", nameEn: "Vermont", nameFr: "Vermont" },
  { code: "VA", name: "Virginia", nameEn: "Virginia", nameFr: "Virginie" },
  { code: "WA", name: "Washington", nameEn: "Washington", nameFr: "Washington" },
  { code: "WV", name: "West Virginia", nameEn: "West Virginia", nameFr: "Virginie-Occidentale" },
  { code: "WI", name: "Wisconsin", nameEn: "Wisconsin", nameFr: "Wisconsin" },
  { code: "WY", name: "Wyoming", nameEn: "Wyoming", nameFr: "Wyoming" },
  { code: "DC", name: "District of Columbia", nameEn: "District of Columbia", nameFr: "District de Columbia" },
]
