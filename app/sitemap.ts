import type {MetadataRoute} from "next";

import {client} from "@/sanity/lib/client";
import {SITE_URL} from "@/lib/site";

// /free-session is an ad landing page, so it stays out of the sitemap.
const STATIC_ROUTES = ["", "/services", "/appointment", "/contact", "/news"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<{slug: string; publishedAt?: string}[]>(
    `*[_type == "blogPost" && defined(slug.current)]{"slug": slug.current, publishedAt}`,
  );

  return [
    ...STATIC_ROUTES.map((path) => ({url: `${SITE_URL}${path}`})),
    ...posts.map((post) => ({
      url: `${SITE_URL}/news/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
