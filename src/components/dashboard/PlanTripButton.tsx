"use client";

import { Button } from "@/components/ui/button";
import { Plane, ShieldAlert } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { PlanTripModal } from "./PlanTripModal";

interface PlanTripButtonProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: Date;
    isPhoneVerified: boolean;
    isProfileComplete: boolean;
  };
}

export const PlanTripButton: React.FC<PlanTripButtonProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user.isProfileComplete) {
    return (
      <Button
        asChild
        className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg flex items-center gap-2 border-none"
      >
        <Link href="/dashboard/profile">
          <ShieldAlert className="h-4 w-4" />
          <span>Complete Profile to Plan Trip</span>
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-new-blue text-white hover:opacity-90 shadow-lg flex items-center gap-2 border-none"
      >
        <Plane className="h-4 w-4" />
        <span>Plan New Trip</span>
      </Button>

      <PlanTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
};
