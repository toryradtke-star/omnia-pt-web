import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {PortableText} from "@portabletext/react";

import {sanityFetch} from "@/sanity/lib/fetch";
import {urlFor} from "@/sanity/lib/image";
import {formatDate} from "@/lib/date";
import {blogPostQuery, blogSlugsQuery} from "@/sanity/lib/queries";
import type {BlogPost} from "@/sanity/lib/types";

type Props = {params: Promise<{slug: string}>};

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({query: blogSlugsQuery, tags: ["blogPost"]});
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const post = await sanityFetch<BlogPost | null>({query: blogPostQuery, params: {slug}, tags: ["blogPost", `blogPost:${slug}`]});
  if (!post) return {};
  const image = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).auto("format").url() : undefined;
  return {
    title: post.metaTitle || `${post.title} — Omnia Wellness & Recovery`,
    description: post.metaDescription || post.excerpt,
    openGraph: image ? {images: [image]} : undefined,
  };
}

export default async function NewsPostPage({params}: Props) {
  const {slug} = await params;
  const post = await sanityFetch<BlogPost | null>({query: blogPostQuery, params: {slug}, tags: ["blogPost", `blogPost:${slug}`]});
  if (!post) notFound();

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
            {[formatDate(post.publishedAt), post.author].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

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
