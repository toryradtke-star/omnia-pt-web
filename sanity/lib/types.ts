import type {PortableTextBlock} from '@portabletext/react'

export type SanityImage = {
  _type: 'image'
  alt?: string
  asset: {
    _ref?: string
    _id?: string
    url?: string
  }
}

export type LinkItem = {label: string; href: string}

export type HeadingLine = {highlight: string; rest: string}

export type Stat = {number: string; label: string}

export type WhyListItem = {lead: string; rest: string}

export type FaqItem = {question: string; answer: PortableTextBlock[]}

export type SiteSettings = {
  brandName: string
  navLinks: LinkItem[]
  navCtaLabel: string
  navCtaHref: string
  footerBrandLines: string[]
  footerTagline: string
  footerExploreLinks: LinkItem[]
  phone: string
  phoneHref: string
  email: string
  addressLines: string[]
  fax?: string
  copyrightLine: string
  serviceArea: string
}

export type HomePage = {
  heroImage: SanityImage
  heroEyebrow: string
  heroHeadingLines: HeadingLine[]
  heroSubheading: string
  heroPrimaryCtaLabel: string
  heroPrimaryCtaHref: string
  heroSecondaryCtaLabel: string
  heroSecondaryCtaHref: string
  missionEyebrow: string
  missionHeading: string
  missionStats: Stat[]
  missionBody: PortableTextBlock[]
  teamEyebrow: string
  teamPhoto: SanityImage
  teamBadgeName: string
  teamBadgeTitle: string
  teamHeading: string
  teamName: string
  teamBio: PortableTextBlock[]
  servicesEyebrow: string
  servicesHeading: string
  servicesIntro: string
  servicesViewAllLabel: string
  servicesViewAllHref: string
  whyEyebrow: string
  whyHeading: string
  whyImage: SanityImage
  whyBody: PortableTextBlock[]
  whyList: WhyListItem[]
  howCanWeHelpEyebrow: string
  howCanWeHelpCards: PortableTextBlock[]
  ctaEyebrow: string
  ctaHeading: string
  ctaBody: string
  ctaButtonLabel: string
  ctaButtonHref: string
  faqHeading: string
  faqs: FaqItem[]
}

export type Service = {
  displayNumber: string
  icon: string
  name: string
  slug?: {current: string}
  summary: string
  description?: PortableTextBlock[]
}

export type ServicesPage = {
  pageHeading: string
  intro: PortableTextBlock[]
  services: Service[]
}

export type Reassurance = {lead: string; rest: string}

export type AppointmentPage = {
  backLinkLabel: string
  backLinkHref: string
  leadHeading: string
  leadBody: string
  reassurances: Reassurance[]
  launchEyebrow: string
  launchHeading: string
  launchBody: string
  launchButtonLabel: string
  launchNote: string
  onlineBookingUrl: string
}

export type HoursRow = {label: string; hours: string}

export type ContactPage = {
  pageHeading: string
  intro: PortableTextBlock[]
  clinicName: string
  addressLines: string[]
  phone: string
  email: string
  fax?: string
  hours: HoursRow[]
  servingArea: string
  mapEmbedUrl: string
  formNote: string
}
