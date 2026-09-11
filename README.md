# Omnia Physical Therapy — site and lead pipeline

Production site for a physical therapy clinic in Superior, Wisconsin. The point
of this project is not the pages: it's the path from an ad click to a tracked
lead sitting in the right pipeline stage in the clinic's CRM.

**Live:** https://omniatherapies.com

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Sanity ·
GoHighLevel · GA4 + Google Ads · Vercel

## What's interesting in here

**Lead intake is the product.** `app/api/lead/route.ts` takes submissions from
both the contact page and the paid-traffic landing page, normalizes them, and
upserts the contact into GoHighLevel, then opens an opportunity in the intake
pipeline. A few decisions in there were learned the hard way and are documented
inline:

- **Tags are deliberately not sent.** GHL's upsert treats `tags` as a full
  replacement, so including the field would wipe tags an existing contact already
  carries. Tagging is left to a GHL workflow keyed off `source`.
- **The API version falls back.** GHL ships breaking changes via a version
  header; the docs say `v3` while many live sub-accounts still run `2021-07-28`.
  The route tries the documented value and falls back once, so whichever the
  sub-account expects wins.
- **Pipeline and stage resolve by name, not by id.** Renaming or reordering
  stages in the CRM doesn't silently break intake.
- **Custom field keys are copied, not guessed.** GHL accepts an unrecognized
  field key with a `200` and silently drops the value, so a typo would look like
  success and lose data.

**Conversion tracking that closes the loop.** Google Ads and GA4 are configured
in `app/layout.tsx`, and `components/LandingForm.tsx` fires the lead conversion
on the `/free-session` landing page. The fire is guarded by a module-level flag
so a double submit or a re-render can't report the same lead twice — inflated
conversion counts are worse than none, because they corrupt the bid signal the
Ads account optimizes against.

**Upsert, not create.** Repeat enquiries from the same person update one contact
instead of littering the CRM with duplicates.

## Running it

```bash
npm install
npm run dev
```

Create `.env.local` with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_GA_ID=

# Server-only — must NOT be prefixed NEXT_PUBLIC_.
# Create under GHL Settings -> Private Integrations with contacts write scope.
GHL_API_TOKEN=
GHL_LOCATION_ID=
GHL_OPPORTUNITY_VALUE=
```

## Notes

Built with Claude Code as an AI-assisted development workflow. Content is managed
in a separate Sanity Studio (see `toryradtke-star/omnia-pt`).
