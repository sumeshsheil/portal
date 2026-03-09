"use client";

import { cn } from "@/lib/utils";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Blogs", href: "/blogs" },
    { name: "Domestic", href: "/blogs/category/domestic" },
    { name: "International", href: "/blogs/category/international" },
    { name: "Travel insights", href: "/blogs/category/travel-insights" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container-box px-4">
        <div className="h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          <div className="relative w-full max-w-[340px] hidden lg:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
            />
          </div>
          {/* Logo/Brand for Blog (Optional, but here we just have navigation) */}
          <div className="flex-1 md:flex-none flex items-center">
            <nav className="flex items-center overflow-x-auto scrollbar-hide gap-5 md:gap-8 py-4 -mb-px">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.name === "Blogs") {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      <Home className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] md:text-sm font-bold transition-all whitespace-nowrap pb-1 border-b-2 ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Search Bar */}

          {/* Mobile Search Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 transition-all duration-300 ease-in-out">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none transition-all text-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
