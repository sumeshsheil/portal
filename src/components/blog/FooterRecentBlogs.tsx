"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { decodeHtmlEntities } from "@/lib/wordpress/utils";

interface RecentPost {
  slug: string;
  title: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string | string[];
    }>;
  };
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=60";

function extractImage(post: RecentPost): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return FALLBACK_IMAGE;
  const raw = media.source_url;
  if (Array.isArray(raw)) {
    return typeof raw[0] === "string" && raw[0].length > 0
      ? raw[0]
      : FALLBACK_IMAGE;
  }
  return typeof raw === "string" && raw.length > 0 ? raw : FALLBACK_IMAGE;
}

export default function FooterRecentBlogs() {
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
    if (!wpUrl) return;

    fetch(`${wpUrl}/wp-json/wp/v2/posts?_embed&per_page=3&status=publish`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RecentPost[]) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-black font-bold text-base lg:text-lg font-open-sans flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full block"></span>
        Recent Blogs
      </h3>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group flex items-start gap-3 hover:opacity-80 transition-opacity"
          >
            {/* Small Thumbnail */}
            <div className="relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 border border-gray-200/50">
              <Image
                src={extractImage(post)}
                alt={decodeHtmlEntities(post.title.rendered.replace(/<[^>]+>/g, ""))}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="80px"
              />
            </div>

            {/* Title */}
            <p className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug font-open-sans">
              {decodeHtmlEntities(post.title.rendered.replace(/<[^>]+>/g, ""))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
