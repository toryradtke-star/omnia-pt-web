import type {Metadata} from "next";
import Link from "next/link";

import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";
import {formatDate} from "@/lib/date";
import {blogPostsQuery} from "@/sanity/lib/queries";
import type {BlogPostSummary} from "@/sanity/lib/types";

import {Reveal} from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News — Omnia Wellness & Recovery",
  description: "Updates from Omnia Wellness & Recovery, physical therapy in Superior and Duluth.",
};

export default async function NewsPage() {
  const posts = await client.fetch<BlogPostSummary[]>(blogPostsQuery);

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>News</span>
          </div>
          <h1 className="page-head__title">News</h1>
        </div>
      </header>

      <main>
        <section className="section" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap">
            <div className="news-list">
              {posts.map((post, i) => (
                <Reveal as="article" className="news-card" key={post.slug.current} delayIndex={i}>
                  {post.mainImage?.asset && (
                    <Link href={`/news/${post.slug.current}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="news-card__img"
                        src={urlFor(post.mainImage).width(500).auto("format").url()}
                        alt={post.mainImage.alt || ""}
                      />
                    </Link>
                  )}
                  <div>
                    <span className="news-card__date">{formatDate(post.publishedAt)}</span>
                    <h2 className="news-card__title">
                      <Link href={`/news/${post.slug.current}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && <p>{post.excerpt}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
