"use client";

import backgroundImage from "@/../public/images/landing-bg.png";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { RegistrationModal } from "@/components/admin/auth/RegistrationModal";
import { Briefcase, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminLoginPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full relative flex flex-col xl:flex-row items-center overflow-x-hidden">
      {/* Single Background Image for the whole screen */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <Image
          src={backgroundImage}
          alt="Travel Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Simple single light overlay for the whole screen to ensure text readability */}
        <div className="absolute inset-0 bg-white/75" />
      </div>

      {/* Main Container */}
      <div className="w-full z-10 relative flex flex-col-reverse xl:flex-row max-w-[1400px] mx-auto py-8 xl:py-4">
        
        {/* Left Side: 65% width */}
        <div className="w-full xl:w-[65%] flex flex-col justify-center p-4 sm:p-8 xl:p-12">
          <div className="max-w-2xl mx-auto xl:mx-0 text-black space-y-3 xl:space-y-4">
            <div className="space-y-1.5 text-center xl:text-left">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                Start your travel business from home. Get domestic & international
                leads, sell your own packages, and earn high commissions.
              </p>
              <h1 className="text-3xl sm:text-4xl xl:text-[48px] font-bold tracking-tight xl:whitespace-nowrap text-black leading-tight">
                Become a Travel Partner in India <br className="hidden xl:block" />
                <span className="text-emerald-600 block mt-2">Earn Up to ₹1.5 Lakh/Month</span>
              </h1>
              
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-center xl:text-left">
              Join our travel partner program and start your own travel business
              from home. Our platform provides verified domestic and
              international travel leads, allowing agents to manage bookings,
              connect with customers, and earn high commissions. Partners can
              also upload their own customized travel packages and sell directly
              through the marketplace.
            </p>

            <div className="flex flex-col gap-5 pt-2">
              {/* Why Join */}
              <div className="space-y-3">
                <h2 className="font-bold text-lg text-black text-center xl:text-left tracking-wide uppercase">
                  Why Join Us?
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 text-sm mx-auto xl:mx-0 w-full auto-rows-fr">
                  <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:bg-white/80 transition-colors h-full min-h-[72px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[13px] sm:text-sm">Get verified customer enquiries daily</span>
                  </li>
                  <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors h-full min-h-[72px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[13px] sm:text-sm">Sell domestic & international packages</span>
                  </li>
                  <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors h-full min-h-[72px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[13px] sm:text-sm">Upload and sell your own custom packages</span>
                  </li>
                  <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors h-full min-h-[72px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[13px] sm:text-sm">Manage bookings seamlessly in one portal</span>
                  </li>
                  <li className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors h-full min-h-[72px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[13px] sm:text-sm">Earn high commissions on every conversion</span>
                  </li>
                </ul>
              </div>

              {/* Earning Potential */}
              <div className="space-y-3">
                <h2 className="font-bold text-lg text-black text-center xl:text-left tracking-wide uppercase">
                  Earning Potential
                </h2>
                <div className="grid grid-cols-3 gap-3 mx-auto xl:mx-0 w-full auto-rows-fr">
                  
                  <div className="relative overflow-hidden group bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-emerald-500/30 h-full min-h-[84px] flex flex-col justify-center">
                    <div className="flex flex-col text-center xl:text-left">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Part-Time</span>
                      <span className="text-base sm:text-lg xl:text-xl font-bold text-black leading-tight">₹20K–₹50K<span className="text-[10px] sm:text-xs font-normal text-slate-500 block xl:inline"> /mo</span></span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden group bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-emerald-500/30 h-full min-h-[84px] flex flex-col justify-center">
                    <div className="flex flex-col text-center xl:text-left">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</span>
                      <span className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 leading-tight">₹50K–₹1L<span className="text-[10px] sm:text-xs font-normal text-slate-400 block xl:inline"> /mo</span></span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden group bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-md transition-all hover:-translate-y-1 hover:border-emerald-500/30 h-full min-h-[84px] flex flex-col justify-center">
                    <div className="flex flex-col text-center xl:text-left">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Top Performers</span>
                      <span className="text-base sm:text-lg xl:text-xl font-bold text-emerald-600 leading-tight">Up to ₹1.5L<span className="text-[10px] sm:text-xs font-normal text-slate-400 block xl:inline"> /mo</span></span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            <div className="pt-4 sm:pt-6 flex justify-center xl:justify-start">
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all px-6 sm:px-8 py-3 rounded-full cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 outline-none border-none group"
              >
                <Briefcase className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-base font-bold text-white tracking-wide">
                  Join as a Partner Today
                </span>
              </button>
            </div>
            
            <div className="pt-2 text-center xl:text-left">
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} Budget Travel Packages. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: 35% width */}
        <div className="w-full xl:w-[35%] flex items-center justify-center p-4 sm:p-8 relative z-10">
          <div className="w-full max-w-[380px]">
            <div className="mb-4 text-center xl:hidden text-black">
              <h2 className="text-2xl font-bold">Partner Portal</h2>
              <p className="text-slate-700 text-sm mt-0.5">Sign in to your account</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
              <LoginForm onRegisterClick={() => setIsRegisterModalOpen(true)} />
            </div>
          </div>
        </div>
        
      </div>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isRegisterModalOpen} 
        onOpenChange={setIsRegisterModalOpen} 
      />
    </div>
  );
}
