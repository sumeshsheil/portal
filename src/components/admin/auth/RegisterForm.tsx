"use client";

import { useState } from "react";
import { Loader2, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import logo from "@/../public/images/logo/footer-logo.svg";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registerEmail, setRegisterEmail] = useState("");

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/agent-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      setSuccessMessage(
        data.message || "Check your email to complete registration!",
      );
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-10 min-h-[500px] flex flex-col justify-center">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="Budget Travel Packages"
            width={180}
            height={70}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Partner Registration
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Enter your email to get started
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {successMessage && !error && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <form onSubmit={onRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-gray-700 text-xs font-bold ml-1 uppercase tracking-wider">
            Email Address
          </label>
          <Input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            placeholder="agent@example.com"
            disabled={isLoading}
            required
            className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/10 transition-all rounded-xl text-base text-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all rounded-xl shadow-lg shadow-emerald-500/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <UserPlus className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Registering..." : "Register as Agent"}
        </Button>
      </form>
    </div>
  );
}
