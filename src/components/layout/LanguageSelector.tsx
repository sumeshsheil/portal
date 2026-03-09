"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Language {
  code: string;
  name: string;
  label: string;
}

const languages: Language[] = [
  { code: "en", name: "English", label: "En" },
  { code: "bn", name: "Bengali", label: "Bn" },
  { code: "hi", name: "Hindi", label: "Hi" },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  // Initialize Google Translate
  useEffect(() => {
    // Inject custom styles to hide Google Translate banner
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0px !important; }
      .goog-tooltip { display: none !important; }
      .goog-tooltip:hover { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      #google_translate_element { display: none !important; }
      
      /* Hide top banner */
      body > .skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);

    // Check if script is already added
    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Define the callback function globally
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn,hi",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
  }, []);

  // Handle language change
  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);

    // Set the cookie that Google Translate uses

    // Format: /sourceLang/targetLang
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;

    // Reload the page to apply translation
    window.location.reload();
  };

  // Detect current language from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(";");
    const googtransCookie = cookies.find((c) =>
      c.trim().startsWith("googtrans="),
    );
    if (googtransCookie) {
      const lang = googtransCookie.split("/").pop();
      if (lang && languages.some((l) => l.code === lang)) {
        setSelectedLang(lang);
      }
    }
  }, []);

  return (
    <div className="relative">
      {/* Hidden Google Translate Element */}
      <div
        id="google_translate_element"
        className="absolute w-0 h-0 overflow-hidden"
        style={{ display: "none" }}
      ></div>

      {/* Custom Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-bold uppercase hidden sm:block">
          {languages.find((l) => l.code === selectedLang)?.label || "EN"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close on click outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-4 w-40 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-2"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="w-full text-left px-4 py-2.5 text-sm text-secondary-text hover:bg-gray-50 transition-colors flex items-center justify-between group font-medium"
                >
                  <span
                    className={
                      selectedLang === lang.code
                        ? "font-bold text-primary"
                        : "font-medium"
                    }
                  >
                    {lang.name}
                  </span>
                  {selectedLang === lang.code && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add types for Google Translate
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default LanguageSelector;
