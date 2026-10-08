import {sanityFetch} from "@/sanity/lib/fetch";
import {SITE_URL} from "@/lib/site";

// A plain-text guide to the site for AI assistants (llmstxt.org). Built from
// Sanity, so new services and news posts show up here when they're published.
const query = `{
  "settings": *[_type == "siteSettings"][0]{phone, email, addressLines, serviceArea},
  "team": *[_type == "homePage"][0]{"names": [teamName] + teamMembers[].name},
  "services": *[_type == "servicesPage"][0].services[]{name, summary},
  "posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){title, "slug": slug.current, excerpt}
}`;

type Data = {
  settings?: {phone?: string; email?: string; addressLines?: string[]; serviceArea?: string};
  team?: {names?: (string | null)[]};
  services?: {name?: string; summary?: string}[];
  posts?: {title: string; slug: string; excerpt?: string}[];
};

const line = (title: string, path: string, note?: string) =>
  `- [${title}](${SITE_URL}${path})${note ? `: ${note.replace(/\s+/g, " ").trim()}` : ""}`;

export async function GET() {
  const d = await sanityFetch<Data>({query, tags: ["siteSettings", "homePage", "servicesPage", "blogPost"]});
  const s = d.settings ?? {};

  const text = [
    "# Omnia Wellness & Recovery",
    "",
    `> One-on-one physical therapy with Doctors of Physical Therapy in Superior, Wisconsin, with in-person care in Superior and Duluth and virtual visits across Minnesota and Wisconsin.`,
    "",
    [
      s.addressLines?.length && `Address: ${s.addressLines.join(", ")}`,
      s.phone && `Phone: ${s.phone}`,
      s.email && `Email: ${s.email}`,
      s.serviceArea && `Service area: ${s.serviceArea}`,
    ]
      .filter(Boolean)
      .join("\n"),
    "",
    ...(d.team?.names?.some(Boolean) ? [`Clinicians: ${d.team.names.filter(Boolean).join("; ")}`, ""] : []),
    "## Pages",
    "",
    line("Services", "/services", "every treatment the clinic offers"),
    line("Book an appointment", "/appointment", "online scheduling"),
    line("Contact", "/contact", "phone, email, address and hours"),
    line("News and articles", "/news"),
    "",
    ...(d.services?.length ? ["## Services", "", ...d.services.map((sv) => `- ${sv.name}${sv.summary ? `: ${sv.summary}` : ""}`), ""] : []),
    ...(d.posts?.length
      ? ["## Articles", "", ...d.posts.map((p) => line(p.title, `/news/${p.slug}`, p.excerpt)), ""]
      : []),
  ].join("\n");

  return new Response(text, {headers: {"content-type": "text/plain; charset=utf-8"}});
}
