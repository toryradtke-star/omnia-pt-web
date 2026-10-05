import type {MetadataRoute} from "next";

import {sanityFetch} from "@/sanity/lib/fetch";
import {SITE_URL} from "@/lib/site";

// /free-session is an ad landing page, so it stays out of the sitemap.
const STATIC_ROUTES = ["", "/services", "/appointment", "/contact", "/news"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await sanityFetch<{slug: string; publishedAt?: string}[]>({
    query: `*[_type == "blogPost" && defined(slug.current)]{"slug": slug.current, publishedAt}`,
    tags: ["blogPost"],
  });

  return [
    ...STATIC_ROUTES.map((path) => ({url: `${SITE_URL}${path}`})),
    ...posts.map((post) => ({
      url: `${SITE_URL}/news/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
