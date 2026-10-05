import type {QueryParams} from "next-sanity";
import {client} from "./client";

/**
 * Tagged fetch. Each result is cached under its document type (and slug), and
 * the Sanity webhook hitting /api/revalidate purges just those tags on publish,
 * so Studio edits go live in seconds without a redeploy.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T> {
  // In development, always refetch so Studio edits show up locally.
  if (process.env.NODE_ENV === "development") {
    return client.fetch<T>(query, params, {next: {revalidate: 0}});
  }
  // Tags and time-based revalidation are mutually exclusive in Next:
  // with tags present, invalidation is on demand only.
  return client.fetch<T>(query, params, {next: {revalidate: false, tags}});
}
