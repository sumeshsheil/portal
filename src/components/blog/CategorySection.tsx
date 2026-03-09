import { Post } from "@/lib/wordpress/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BlogCard from "./BlogCard";

interface CategorySectionProps {
  title: string;
  description: string;
  slug: string;
  posts: Post[];
  totalPosts: number;
  icon: string;
  accentColor: string; // e.g. "blue", "purple", "orange"
}

const accentMap: Record<
  string,
  { border: string; bg: string; text: string; button: string }
> = {
  blue: {
    border: "border-l-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  purple: {
    border: "border-l-purple-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  orange: {
    border: "border-l-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
    button: "bg-orange-500 hover:bg-orange-600",
  },
};

export default function CategorySection({
  title,
  description,
  slug,
  posts,
  totalPosts,
  icon,
  accentColor,
}: CategorySectionProps) {
  const colors = accentMap[accentColor] || accentMap.blue;

  if (posts.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-box px-4">
        {/* Section Header */}
        <div
          className={`border-l-4 ${colors.border} pl-6 mb-10 md:mb-12 transition-all`}
        >
          <div className="flex items-center mb-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 font-open-sans tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-gray-500 text-base md:text-lg max-w-3xl font-open-sans leading-relaxed opacity-90">
            {description}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.slice(0, 6).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Show More Button */}
        {totalPosts > 6 && (
          <div className="mt-8 text-center">
            <Link
              href={`/blogs/category/${slug}`}
              className={`inline-flex items-center gap-3 ${colors.button} text-white font-black text-xs md:text-sm px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-1 uppercase tracking-widest font-open-sans`}
            >
              Explore {title}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
