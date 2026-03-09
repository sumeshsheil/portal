"use client";

import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      toast.success(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.message || "Failed to subscribe. Please try again.",
      );
      toast.error(error.message || "Failed to subscribe. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-box px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto  bg-[url('/images/blog/newsletter-bg.png')] bg-cover bg-center bg-no-repeat rounded-xl p-8 md:p-16 text-center relative overflow-hidden shadow-xl"
        >
          {/* Overlay to make text readable */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-secondary-text mb-4 tracking-tight">
              Get Travel Deals
            </h2>
            <p className="text-gray-800 text-base md:text-lg mb-10 max-w-md mx-auto font-medium">
              Join our newsletter for the best budget guides and exclusive
              itineraries.
            </p>

            <div className="max-w-xl mx-auto">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 border border-white/20 p-8 rounded-3xl"
                >
                  <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">
                    Check Your Inbox!
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    We&apos;ve sent an activation link to your email.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-xs font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    Add another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white p-2 rounded-2xl md:rounded-full shadow-lg gap-2">
                    <div className="flex-1 flex items-center px-4">
                      <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-4 text-gray-900 outline-none font-open-sans text-base placeholder:text-gray-400 bg-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="bg-new-blue text-white px-10 py-4 rounded-xl md:rounded-full font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Subscribe
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="mt-3 text-red-500 text-xs font-bold font-open-sans">
                      {errorMessage || "Please enter a valid email."}
                    </p>
                  )}
                </form>
              )}
              <p className="mt-6 text-[13px] text-black font-bold tracking-wide uppercase opacity-80">
                NO SPAM • ONE-CLICK UNSUBSCRIBE • PRIVACY-FIRST
              </p>
              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-secondary">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@budgettravelpackages.in"
                  className="hover:underline underline-offset-4"
                >
                  hello@budgettravelpackages.in
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
