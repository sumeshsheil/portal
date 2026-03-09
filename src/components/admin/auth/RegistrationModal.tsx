"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";

interface RegistrationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationModal({
  isOpen,
  onOpenChange,
}: RegistrationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border-none bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Partner Registration</DialogTitle>
        </DialogHeader>
        <RegisterForm />
      </DialogContent>
    </Dialog>
  );
}
