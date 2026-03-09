"use server";

import { searchPosts } from "@/lib/wordpress/api";
import { Post } from "@/lib/wordpress/types";

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: string;
}

export async function searchBlogPosts(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const posts = await searchPosts(query);

    // Map to a simpler structure for the client
    return posts.map((post: Post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      excerpt:
        post.excerpt.rendered.replace(/<[^>]*>?/gm, "").slice(0, 100) + "...",
      date: new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      featuredImage:
        (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url as string) ||
        undefined,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
