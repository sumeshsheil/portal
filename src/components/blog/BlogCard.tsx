import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress/types";
import { decodeHtmlEntities, extractFeaturedImage } from "@/lib/wordpress/utils";

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  // Determine badge color based on category (mapped from WP terms)
  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Domestic":
        return "bg-blue-600";
      case "International":
        return "bg-purple-600";
      case "Travel insights":
      case "Q&A":
      case "Questions":
        return "bg-orange-600";
      default:
        return "bg-primary";
    }
  };

  const title = post.title.rendered;
  const description =
    decodeHtmlEntities(
      post.excerpt.rendered
        .replace(/<[^>]+>/g, "")
        .split(" ")
        .slice(0, 20)
        .join(" "),
    ) + "...";

  const image = extractFeaturedImage(post);

  const rawCategory = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Travel";
  const category =
    ["QUESTIONS", "Q&A", "Q&AMP;A", "QA"].includes(rawCategory.toUpperCase()) ||
    rawCategory === "Travel insights"
      ? "Travel Insights"
      : rawCategory;
  const authorName = post._embedded?.author?.[0]?.name || "Budget Travel Team";
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group flex flex-col sm:flex-row items-stretch bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100 hover:border-primary/40",
        className,
      )}
    >
      {/* Image Section - Slimmer height version */}
      {image && (
        <div className="relative w-full sm:w-[32%] shrink-0 overflow-hidden bg-gray-50">
          <div className="aspect-21/9 sm:aspect-auto sm:h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Content Section - Compact padding */}
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm",
                getBadgeColor(category),
              )}
            >
              {category}
            </span>
            <span className="text-gray-400 text-[10px] md:text-xs font-semibold font-open-sans">
              {formattedDate}
            </span>
          </div>

          <h3
            className="text-lg md:text-xl font-bold text-secondary-text leading-tight group-hover:text-primary transition-colors duration-300 font-open-sans line-clamp-2"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-snug font-open-sans opacity-80">
            {description}
          </p>
        </div>

        {/* Footer - Tighter spacing */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-black text-gray-900 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              {authorName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] md:text-xs font-bold text-gray-900 leading-none">
                {authorName}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                Verified
              </span>
            </div>
          </div>

          <div className="text-primary/50 group-hover:text-primary transition-colors duration-300">
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
