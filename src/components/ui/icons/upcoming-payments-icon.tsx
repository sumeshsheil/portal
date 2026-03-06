import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const UpcomingPaymentsIcon = ({ className }: { className?: string }) => {
  const images = [
    "/images/upcoming-payments/bank.png",
    "/images/upcoming-payments/credit-card.png",
    "/images/upcoming-payments/online-payment.png",
  ];

  return (
    <div className={cn("flex flex-col items-center text-center gap-5 p-4", className)}>
      <div>
        <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight mb-2">
          Card, Bank transfers and other payment methods
        </h4>
        <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase">
          Coming Soon
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        {images.map((src, index) => (
          <div key={index} className="w-10 h-10 relative flex items-center justify-center">
            <Image
              src={src}
              alt={`payment-method-${index}`}
              width={36}
              height={36}
              className="object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPaymentsIcon;
