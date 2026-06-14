# Omnia Wellness & Recovery — Frontend (omnia-pt-web) Build Spec

## Context

`omnia-pt-web` is a fresh `create-next-app` scaffold (App Router, Tailwind v4,
React 19, `next-sanity` already in package.json). The Sanity Studio
(`omnia-pt`, separate project) now has all content schemas and seeded,
published content for: `siteSettings`, `homePage`, `servicesPage`,
`appointmentPage`, `contactPage`.

**Goal:** Build the real site — Home, Services, Appointment, Contact — pulling
all copy/images from Sanity, visually matching the approved design (the
"Omnia Design Files" static HTML/CSS prototype).

**Important — locate the design source files first.** The static prototype
(`Omnia Wellness.html`, `Contact.html`, `Appointment.html`, `styles.css`,
`app.js`, `image-slot.js`, and `images/`) was delivered as `Omnia_PT.zip`.
Search the filesystem (e.g. `~/Downloads`, `~/Desktop`, project root) for a
folder called "Omnia Design Files" or `Omnia_PT.zip`. If you can't find it,
stop and ask the user where it is — don't recreate the CSS/markup from
scratch by guessing, since pixel-accurate porting depends on the real files.

Treat `styles.css` as the source of truth for the design system (colors,
type, spacing, component classes like `.btn`, `.svc`, `.hero`, `.footer`,
etc.) and the three HTML files as the source of truth for markup structure
and class usage per section.

---

## 1. Sanity client setup

Add env vars to `.env.local` (and `.env.example` template):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ksx13wmz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Create `sanity/lib/client.ts`:

```ts
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
})
```

Create `sanity/lib/image.ts` using `@sanity/image-url` (add as a dependency)
for a `urlFor(source)` helper used with `next/image`.

Create `sanity/lib/queries.ts` with one named GROQ query per document type
(see field names in each page section below — query `*[_type == "X"][0]{...}`
for singletons).

---

## 2. Global styles & fonts

Port `styles.css` into `app/globals.css`:
- Keep `@import "tailwindcss";` at the top (Tailwind v4 syntax already in the
  scaffold).
- Below that, paste in the `:root` CSS custom properties block, the reset,
  and all component classes from `styles.css` (palette, typographic helpers,
  buttons, nav, hero, sections, mission, team, services, why-us, FAQ, CTA
  band, footer, forms, contact grid, reveal animation, responsive rules).
- Skip the Tweak-driven alt palette/accent blocks (`[data-palette=...]`,
  `[data-accent=...]`, `[data-type=...]`) — not needed for production.
- Remove `image-slot` element references; the design's CSS already has
  "baked-in photos" rules (`.hero__media img.hero__img`, `.why__media
  img.why__img`, etc.) — use plain `<img>`/`next/image` with those classes.

Fonts: replace Geist fonts in `app/layout.tsx` with the design's Google Fonts
— Bricolage Grotesque (weights 500/600/700/800), Hanken Grotesk
(400/500/600/700), Space Mono (400/700), and Spectral (used minimally, can
include for parity). Use `next/font/google` and map them to the CSS variables
`--font-display`, `--font-body`, `--font-mono` used throughout `styles.css`.

---

## 3. Shared icon sprite

Create `components/IconSprite.tsx` — a server component rendered once in the
root layout, containing the `<svg><symbol>...</symbol></svg>` sprite from
`Omnia Wellness.html` (ids: `i-leaf`, `i-mark`, `i-needle`, `i-hand`,
`i-dumbbell`, `i-cupping`, `i-mobility`, `i-recovery`, `i-ultrasound`,
`i-manipulation`, `i-athlete`). Copy the exact `<symbol>` markup from the
design HTML (lines ~14–77 of `Omnia Wellness.html`) verbatim.

Create a small helper, e.g. `components/Icon.tsx`:

```tsx
export function Icon({name, className}: {name: string; className?: string}) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}
```

This is how `servicesPage.services[].icon` (values: `needle`, `hand`,
`dumbbell`, `cupping`, `mobility`, `recovery`, `ultrasound`, `manipulation`,
`athlete`) maps to `<Icon name={service.icon} className="svc-icon" />`.

---

## 4. Layout: Nav, mobile menu, Footer

Both come from `siteSettings` (singleton — query `*[_type == "siteSettings"][0]`).

**Nav** (`components/Nav.tsx`, client component):
- Brand: `siteSettings.brandName` + `<Icon name="mark" className="mark" />`
- `navLinks[]` → `<a class="nav__link">`
- `navCtaLabel`/`navCtaHref` → `<a class="nav__cta">`
- Mobile menu toggle button + `<div class="mobile-menu">` (same links)
- Port the scroll-based `.is-stuck` class toggle logic from `app.js` (adds
  `is-stuck` class on scroll for the backdrop-blur nav state) as a
  `useEffect` + scroll listener.
- Handle `nav--solid` variant (used on Services/Appointment/Contact pages —
  dark-on-light nav from first paint) vs. the default transparent-over-hero
  variant (Home page). Accept a prop e.g. `variant: 'transparent' | 'solid'`.
- Mark the active link based on current route (`is-active` class) using
  `usePathname()`.

**Footer** (`components/Footer.tsx`, server component is fine):
- `footerBrandLines[]`, `footerTagline`
- `footerExploreLinks[]`
- Contact column: `phone`/`phoneHref`, `email`, `addressLines[]` or `fax`
  depending on page (home footer shows email/phone/fax + schedule link;
  contact footer shows email/phone/address — match each HTML file's footer
  markup respectively, both pull from the same `siteSettings` fields)
- `footerBottom`: `copyrightLine` + `serviceArea` (from `siteSettings` or
  `contactPage.servingArea` — use `siteSettings.serviceArea`)

Add both to `app/layout.tsx` so they wrap every page. Fetch `siteSettings`
in the root layout (Server Component) and pass down via props.

---

## 5. Reveal-on-scroll + FAQ accordion

Port from `app.js`:
- **Reveal animation**: IntersectionObserver that adds `.is-in` to elements
  with class `.reveal` when they enter the viewport. Implement as a small
  client component wrapper, e.g. `<Reveal><div className="...">...</div></Reveal>`
  that renders its child with `reveal` (and `is-in` once visible) classes —
  or a `useReveal()` hook applied via `ref`. Respect
  `prefers-reduced-motion` (already handled in CSS via media query, so the JS
  just needs to add the class; CSS no-ops under reduced motion).
- **FAQ accordion**: client component `components/Faq.tsx` taking
  `faqs: {question: string, answer: PortableTextBlock}[]`. Toggles
  `.is-open` on click, animates `.faq__a` height (can use a simple
  `maxHeight` style toggle via ref instead of the original's height
  calculation — same visual result).

---

## 6. Page-by-page mapping

For all pages: use `PortableText` (from `@portabletext/react`) to render
`blockContent` fields. Keep custom components minimal — default rendering of
`normal`/`h2`/`h3`/`blockquote`/lists/`strong`/`em`/links should match the
design's typographic CSS automatically via the existing classes on parent
containers (e.g. `.mission__body p`, `.why__body p`).

### `/` — Home (`app/page.tsx`)

Query `homePage` (singleton) + `servicesPage` (for the services preview grid
— first 9 services) + `siteSettings`.

Sections, in order, mapped to design markup in `Omnia Wellness.html`:

1. **Hero** (`<header class="hero" id="top">`) — `nav variant="transparent"`,
   `data-hero` default (full-bleed, not split).
   - `heroImage` → `<img class="hero__img">` inside `.hero__media`, plus
     `.hero__tint`
   - `heroEyebrow` → `.hero__eyebrow` with leaf icon
   - `heroHeadingLines[]` → `<h1 class="display">`, each line rendered as
     `<span class="em">{highlight}</span> {rest}` then a line break — match
     the original's per-word coloring (highlight = moss-soft green via `.em`
     class already defined for hero h1; check exact color application in the
     original — original used inline `style="color: rgb(174,192,154)"` on
     the whole h1 then white spans for "BETTER./FASTER./STRONGER." — i.e.
     **highlight word is the green/default h1 color, `rest` is white**. Use
     `<span style={{color: '#fff'}}>{rest}</span>` for the rest segment, h1
     itself takes the default green.)
   - `heroSubheading` → `.hero__sub`
   - `heroPrimaryCtaLabel/Href` → `.btn.btn--lg`
   - `heroSecondaryCtaLabel/Href` → `.btn.btn--ghost.btn--lg`
   - `.hero__curve` SVG — static, copy from design HTML verbatim

2. **Mission** (`<section id="mission">`)
   - `missionEyebrow`, `missionHeading` (render with `<em>` around
     "healthier" and "recover" — split the string on those two words, or
     simplest: do a string `.replace()` for "healthier" → `<em>healthier</em>`
     and "recover" → `<em>recover</em>` when rendering, matching original copy)
   - `missionStats[]` → `.stat` cards in `.mission__stats`
   - `missionBody` (PortableText) → `.mission__body`

3. **Team** (`<section id="team" class="section section--cream2">`)
   - `teamEyebrow`
   - `teamPhoto` + `teamBadgeName`/`teamBadgeTitle` → `.team__photo` +
     `.team__badge`
   - `teamHeading` → `.section-title`
   - `teamName` → `.team__name`
   - `teamBio` (PortableText) → `.team__body`

4. **Services preview** (`<section id="services" class="section section--forest">`)
   - `servicesEyebrow`, `servicesHeading`, `servicesIntro`,
     `servicesViewAllLabel/Href`
   - Grid of `.svc` cards from `servicesPage.services[]` — each card:
     `<Icon name={icon}>` in `.svc__media`, `displayNumber` in `.svc__num`,
     `name` in `.svc__title`, `summary` in `.svc__desc`, and a static
     "Book this →" link to `/appointment` (`.svc__more`)
   - Note the original has a 9th card (`.svc--center` class on one) for grid
     layout — check `Omnia Wellness.html` for which position gets
     `svc--center` and replicate.

5. **Why Us** (`<section id="why">`)
   - `whyEyebrow`, `whyHeading`, `whyImage`, `whyBody` (PortableText)
   - `whyList[]` → `.why__list li` — each `<svg class="leaf">` +
     `<b>{lead}</b> {rest}`
   - `howCanWeHelpEyebrow` + `howCanWeHelpCards[]` (each PortableText) →
     `.help-grid` / `.help` cards

6. **CTA band** (`<section class="section section--forest cta-band">`)
   - `ctaEyebrow`, `ctaHeading`, `ctaBody`, `ctaButtonLabel/Href`

7. **FAQ** (`<section id="faq" class="section section--cream2">`)
   - `faqHeading`, `faqs[]` → `<Faq>` component from section 5

Footer at the bottom (shared component).

### `/services` — Services (`app/services/page.tsx`)

The original `Services.html` wasn't included in the design export, so
construct this page using:
- `nav variant="solid"`, `.page-head` band: use `servicesPage.pageHeading`
  as the `.page-head__title`, `intro` (blockContent) as `.page-head__intro`,
  with breadcrumbs `Home / Services`
- Then render `servicesPage.services[]` as detail rows using the
  `.svc-row` classes seen in `styles.css` (icon in `.svc-row__media
  .svc-row__icon` per the `.svc-row__svg` rule, `displayNumber` in
  `.svc-row__num`, `name` in `.svc-row__title`, `description` (blockContent,
  fall back to `summary` if empty) in `.svc-row__desc`). Alternate rows
  left/right via the `.rev` class as in `styles.css` (`.svc-row.rev
  .svc-row__media { order: 2 }`).
- End with the homepage's CTA band pattern (reuse `homePage.cta*` fields via
  the homePage query, or hardcode a "Schedule an appointment" band — your
  call, keep consistent with `ctaButtonHref`).

### `/appointment` — Appointment (`app/appointment/page.tsx`)

Matches `Appointment.html` structure closely — this page has its own
embedded `<style>` block in the design (the `.book`, `.book__aside`,
`.book__main`, `.launch*` classes) since it's a unique split-screen layout
not in `styles.css`. Port that embedded `<style>` block into a CSS module or
append to `globals.css` under a clearly commented section.

- `.book__aside` (forest bg):
  - brand + `backLinkLabel/Href` (`.book__back`)
  - `leadHeading`/`leadBody` (`.book__lead`)
  - `reassurances[]` → `.reassure li` (`<b>{lead}</b> {rest}` + leaf icon)
  - `.book__help`: phone/email from `siteSettings`
- `.book__main` → `.launch`:
  - `launch__card` with mark icon
  - `launchEyebrow`, `launchHeading`, `launchBody`
  - `launchButtonLabel` → `<a class="btn btn--lg" href={onlineBookingUrl}
    target="_blank">` with `↗` arrow
  - `launchNote`

No nav/footer on this page in the original (it's a focused booking flow) —
confirm against `Appointment.html`; if the design omits global nav/footer
here, do the same (render this route without the shared layout chrome, e.g.
via a route group or conditional in layout).

### `/contact` — Contact (`app/contact/page.tsx`)

Matches `Contact.html`:
- `nav variant="solid"`, `.page-head` with `pageHeading` + `intro`
  (blockContent, contains a link to `/appointment` — handle the inline link
  annotation from blockContent's `link` mark)
- `.contact-grid`:
  - Left: `.info-list` (`dl`) built from `clinicName`/`addressLines[]`/
    `phone`/`email`/`fax`/`hours[]`/`servingArea`, then `.map-slot` iframe
    using `mapEmbedUrl`, then "Get directions" button (derive Google Maps
    link from `addressLines`)
  - Right: contact form — port the form markup + the validation/success
    logic from `Contact.html`'s inline `<script>` as a client component
    (`components/ContactForm.tsx`). `formNote` → `.form-note`. The "I'm
    interested in" dropdown options can stay hardcoded (per spec discussion —
    form config, not Sanity content). No backend submission required yet;
    keep the existing client-side-only success-banner behavior, but leave a
    `// TODO: wire to an actual form endpoint` comment.

---

## 7. Suggested order of operations

1. Locate "Omnia Design Files" (see top of doc). If missing, ask the user.
2. Sanity client/queries setup (section 1) + `.env.local` / `.env.example`.
3. Port `styles.css` → `app/globals.css`, fonts → `app/layout.tsx` (section 2).
4. Icon sprite + `Icon` helper (section 3).
5. `Nav` + `Footer` components wired to `siteSettings`, added to root layout
   (section 4).
6. `Reveal` wrapper + `Faq` component (section 5).
7. Build `/` (Home) — highest content density, validates the whole pipeline.
8. Build `/services`, `/appointment`, `/contact` in that order.
9. Run `npm run dev`, visually compare each route against the corresponding
   design HTML file (open the static HTML files directly in a browser
   side-by-side) for layout/spacing parity.
10. Fix any TypeScript types for GROQ query results (hand-written interfaces
    are fine — no need for codegen at this stage).

Flag any schema fields that come back empty/missing during this pass — that
likely means the seed script (earlier step) didn't populate something, and
the fix is in Sanity content, not the frontend code.
