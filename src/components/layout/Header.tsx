"use client";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import MenuIcon from "../icons/Menu";

import { SOCIAL_LINKS } from "@/lib/constants";
import { useDebouncedCallback } from "use-debounce";
import YoutubeIcon from "../icons/Youtube";
import { Button } from "../ui/button";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoginModal from "../auth/LoginModal";

/**
 * Inner component that reads search params and opens the login modal
 * when a set-password token is present. Wrapped in Suspense by Header.
 */
function SearchParamsHandler({ onOpenLogin }: { onOpenLogin: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const action = searchParams.get("action");
    if (token && action === "set-password") {
      onOpenLogin();
    }
  }, [searchParams, onOpenLogin]);

  return null;
}

// Logos
import logoFooter from "@/../public/images/logo/footer-logo.svg";
import logoPrimary from "@/../public/images/logo/logo.svg";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Logo Logic
  // On /, always use primary logo
  // On other pages, use footer logo (dark) when not scrolled, primary logo when scrolled
  const isHomePage = pathname === "/";
  const currentLogo = isHomePage
    ? logoPrimary
    : isScrolled
      ? logoPrimary
      : logoFooter;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openLoginModal = React.useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.07, ease: "easeIn" }}
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 transform-gpu ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-3 shadow-lg border-b border-white/10"
            : "py-5 bg-linear-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="container-box flex items-center justify-between relative">
          <div className="relative z-50">
            <Link href="/" aria-label="Home">
              <Image
                src={currentLogo}
                alt="Budget Travel Packages Logo"
                width={240}
                height={102}
                priority
                className="w-32 sm:w-40 md:w-48 lg:w-60 h-auto transition-all duration-300"
              />
            </Link>
          </div>
          <nav
            aria-label="Social Media"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 hidden sm:block"
          >
            <div className="flex items-center gap-2 md:gap-4 text-white">
              <Link
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Image
                  src="/images/footer/social/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all object-contain"
                />
              </Link>
              <Link
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Image
                  src="/images/footer/social/instagram-2.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all object-contain"
                />
              </Link>
              <Link
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Subscribe to our YouTube channel"
              >
                <YoutubeIcon className="w-auto h-5 md:h-6 transition-all" />
              </Link>
            </div>
          </nav>
          <div>
            <div className="flex items-center gap-4 min-h-8">
              <div className="bg-white/30 h-6 w-px mx-0"></div>

              <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={toggleMenu}
                className="focus:outline-none cursor-pointer"
                aria-label="Toggle Menu"
              >
                <MenuIcon className="text-[#01FF70]" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="absolute right-4 top-16 md:top-20 mt-6 bg-white rounded-2xl shadow-xl overflow-hidden z-50 w-60 origin-top-right border border-gray-100"
            >
              <div className="p-6 flex flex-col gap-6">
                <ul className="flex flex-col items-center gap-4">
                  <Button
                    className="w-full text-white"
                    variant="secondary"
                    onClick={() => {
                      if (session) {
                        router.push("/dashboard");
                      } else {
                        setIsOpen(false);
                        setIsLoginModalOpen(true);
                      }
                    }}
                  >
                    My Account
                  </Button>
                  <div className="w-full bg-gray-600 h-px" />
                  {[
                    { href: "#services", label: "Services" },
                    { href: "#travel-purpose", label: "Travel Purpose" },
                    { href: "#start-planning", label: "Customize Trip" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#faqs", label: "FAQs" },
                    { href: "#contact", label: "Contact" },
                    { href: "#contact", label: "About" },
                  ].map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="block text-secondary-text hover:text-primary transition-colors font-semibold text-sm md:text-lg font-open-sans"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Social Icons */}
                <div className="sm:hidden pt-4 border-t border-gray-100 flex flex-col items-center">
                  <p className="text-secondary-text text-sm font-semibold mb-3">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-6 text-white">
                    <Link
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <Image
                        src="/images/footer/social/facebook.png"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <Image
                        src="/images/footer/social/instagram-2.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <YoutubeIcon className="w-auto h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={null}>
          <SearchParamsHandler onOpenLogin={openLoginModal} />
        </Suspense>
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </Suspense>
      </motion.header>
    </>
  );
};

export default Header;
