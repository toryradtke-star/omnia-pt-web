export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName,
  navLinks[]{label, href},
  navCtaLabel,
  navCtaHref,
  footerBrandLines,
  footerTagline,
  footerExploreLinks[]{label, href},
  phone,
  phoneHref,
  email,
  addressLines,
  fax,
  copyrightLine,
  serviceArea
}`

export const homePageQuery = `*[_type == "homePage"][0]{
  heroImage{..., asset->},
  heroEyebrow,
  heroHeadingLines[]{highlight, rest},
  heroSubheading,
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
  missionEyebrow,
  missionHeading,
  missionStats[]{number, label},
  missionBody,
  teamEyebrow,
  teamPhoto{..., asset->},
  teamBadgeName,
  teamBadgeTitle,
  teamHeading,
  teamName,
  teamBio,
  servicesEyebrow,
  servicesHeading,
  servicesIntro,
  servicesViewAllLabel,
  servicesViewAllHref,
  whyEyebrow,
  whyHeading,
  whyImage{..., asset->},
  whyBody,
  whyList[]{lead, rest},
  howCanWeHelpEyebrow,
  howCanWeHelpCards,
  ctaEyebrow,
  ctaHeading,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref,
  faqHeading,
  faqs[]{question, answer}
}`

export const servicesPageQuery = `*[_type == "servicesPage"][0]{
  pageHeading,
  intro,
  services[]{displayNumber, icon, name, slug, summary, description}
}`

export const appointmentPageQuery = `*[_type == "appointmentPage"][0]{
  backLinkLabel,
  backLinkHref,
  leadHeading,
  leadBody,
  reassurances[]{lead, rest},
  launchEyebrow,
  launchHeading,
  launchBody,
  launchButtonLabel,
  launchNote,
  onlineBookingUrl
}`

export const contactPageQuery = `*[_type == "contactPage"][0]{
  pageHeading,
  intro,
  clinicName,
  addressLines,
  phone,
  email,
  fax,
  hours[]{label, hours},
  servingArea,
  mapEmbedUrl,
  formNote
}`
