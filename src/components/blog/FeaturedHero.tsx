"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress/types";
import { decodeHtmlEntities, extractFeaturedImage } from "@/lib/wordpress/utils";

interface FeaturedHeroProps {
  post: Post;
}

export default function FeaturedHero({ post }: FeaturedHeroProps) {
  const title = post.title.rendered;
  const description = decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]+>/g, ""));

  const image = extractFeaturedImage(post);

  const rawCategory = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Travel";
  const category =
    ["QUESTIONS", "Q&A", "Q&AMP;A", "QA"].includes(rawCategory.toUpperCase()) ||
    rawCategory === "Travel insights"
      ? "Travel Insights"
      : rawCategory;
  const authorName = post._embedded?.author?.[0]?.name || "Budget Travel Team";
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden py-20 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Dark Overlay Gradient - More sophisticated multi-stop gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="container-box px-4 relative z-20 w-full mt-10 lg:mt-0">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="bg-primary text-black text-[10px] md:text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-[0.2em]">
                Featured
              </span>
              <span className="w-10 h-px bg-white/40"></span>
              <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest font-open-sans">
                {category}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-white tracking-tight font-open-sans"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <p className="text-gray-100 text-base md:text-xl mb-10 leading-relaxed font-open-sans max-w-2xl opacity-90">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm font-semibold text-white/80 font-open-sans uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-black shadow-lg">
                  {authorName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white">{authorName}</span>
                  <span className="text-white/50 text-[10px] normal-case tracking-normal">
                    Author
                  </span>
                </div>
              </div>
              <span className="hidden sm:block w-px h-8 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-white">{formattedDate}</span>
                <span className="text-white/50 text-[10px] normal-case tracking-normal">
                  Published Date
                </span>
              </div>
            </div>

            {/* View Post Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="inline-flex items-center gap-5 text-white hover:text-primary transition-all duration-300 group"
              >
                <span className="text-sm md:text-base font-black uppercase tracking-[0.3em] font-open-sans">
                  Read Full Story
                </span>
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-xl">
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
