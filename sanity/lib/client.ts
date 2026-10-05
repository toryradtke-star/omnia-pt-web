import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  // No Sanity CDN: Next caches every result by tag, and the CDN can serve a
  // minute-old answer right after a publish, which would then stay cached.
  useCdn: false,
})
