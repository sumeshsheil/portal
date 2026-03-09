"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface FormState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const initialState: FormState = { success: false };

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Profile updated successfully");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={initialData.email} disabled />
        <p className="text-xs text-muted-foreground">
          Email address cannot be changed. Contact admin for help.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData.name}
          required
          disabled={isPending}
        />
        {state.fieldErrors?.name && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={initialData.phone}
          placeholder="Contact number"
          disabled={isPending}
        />
        {state.fieldErrors?.phone && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.phone[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
