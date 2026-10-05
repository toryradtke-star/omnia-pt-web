// Anchor-only hrefs (e.g. "#why") in Sanity should always resolve against the homepage,
// not against the current route.
export function resolveHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}
