import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {PortableText} from "@portabletext/react";

import {sanityFetch} from "@/sanity/lib/fetch";
import {urlFor} from "@/sanity/lib/image";
import {formatDate} from "@/lib/date";
import {blogPostQuery, blogSlugsQuery} from "@/sanity/lib/queries";
import type {BlogPost} from "@/sanity/lib/types";
import {SITE_URL} from "@/lib/site";
import {CLINIC_ID} from "@/components/ClinicJsonLd";

type Block = {_type: string; style?: string; children?: {text?: string}[]};
const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? "").join("").trim();

/** The Q&A under the body's "Frequently asked questions" heading (### question, then answer paragraphs). */
function faqFrom(body: BlogPost["body"]) {
  const blocks = body as unknown as Block[];
  const start = blocks.findIndex((b) => b.style === "h2" && /frequently asked questions/i.test(blockText(b)));
  if (start < 0) return [];
  const faq: {question: string; answer: string}[] = [];
  for (const b of blocks.slice(start + 1)) {
    if (b.style === "h2") break;
    if (b.style === "h3") faq.push({question: blockText(b), answer: ""});
    else if (faq.length && b._type === "block") faq[faq.length - 1].answer = `${faq[faq.length - 1].answer} ${blockText(b)}`.trim();
  }
  return faq.filter((qa) => qa.question && qa.answer);
}

type Props = {params: Promise<{slug: string}>};

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({query: blogSlugsQuery, tags: ["blogPost"]});
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const post = await sanityFetch<BlogPost | null>({query: blogPostQuery, params: {slug}, tags: ["blogPost", `blogPost:${slug}`, "homePage"]});
  if (!post) return {};
  const image = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).auto("format").url() : undefined;
  return {
    title: post.metaTitle || `${post.title} — Omnia Wellness & Recovery`,
    description: post.metaDescription || post.excerpt,
    alternates: {canonical: `/news/${slug}`},
    openGraph: {
      type: "article",
      url: `/news/${slug}`,
      title: post.title,
      description: post.metaDescription || post.excerpt,
      siteName: "Omnia Wellness & Recovery",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      images: image ? [image] : undefined,
    },
    twitter: {card: "summary_large_image"},
  };
}

export default async function NewsPostPage({params}: Props) {
  const {slug} = await params;
  const post = await sanityFetch<BlogPost | null>({query: blogPostQuery, params: {slug}, tags: ["blogPost", `blogPost:${slug}`, "homePage"]});
  if (!post) notFound();

  const url = `${SITE_URL}/news/${slug}`;
  const image = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).height(675).auto("format").url() : undefined;
  const reviewer = post.reviewedBy && {
    "@type": "Person",
    name: post.reviewedBy,
    ...(/\bDPT\b/.test(post.reviewedBy) && {jobTitle: "Doctor of Physical Therapy"}),
    worksFor: {"@id": CLINIC_ID},
  };
  const faq = faqFrom(post.body);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": url,
        url,
        name: post.title,
        description: post.metaDescription || post.excerpt,
        ...(reviewer && {reviewedBy: reviewer, lastReviewed: (post.reviewedAt ?? post.publishedAt)?.slice(0, 10)}),
        isPartOf: {"@type": "WebSite", name: "Omnia Wellness & Recovery", url: SITE_URL},
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        mainEntityOfPage: {"@id": url},
        datePublished: post.publishedAt,
        dateModified: post._updatedAt,
        ...(image && {image}),
        author: {"@id": CLINIC_ID},
        publisher: {"@id": CLINIC_ID},
      },
      ...(faq.length
        ? [{
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faq.map((qa) => ({
              "@type": "Question",
              name: qa.question,
              acceptedAnswer: {"@type": "Answer", text: qa.answer},
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/news">News</Link>
          </div>
          <h1 className="page-head__title">{post.title}</h1>
          <p className="page-head__intro post__meta">
            {[
              formatDate(post.publishedAt),
              post.reviewedBy ? `Clinically reviewed by ${post.reviewedBy}` : post.author,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}}
      />
      <main>
        <section className="section post" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap">
            {post.mainImage?.asset && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="post__img"
                src={urlFor(post.mainImage).width(900).auto("format").url()}
                alt={post.mainImage.alt || ""}
              />
            )}
            <div className="legal">
              <PortableText value={post.body} />
            </div>
            <div className="post__foot">
              <Link className="btn" href="/appointment">
                Book an appointment <span className="arr">→</span>
              </Link>
              <Link className="btn btn--ghost" href="/news">
                All news
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
