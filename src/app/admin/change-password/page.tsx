"use client";

import { useActionState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "./actions";

interface FormState {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

const initialState: FormState = { success: false };

export default function ChangePasswordPage() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState,
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Password changed successfully");
      // Sign out so they log in with the new password
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 1500);
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Lock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl">Change Your Password</CardTitle>
          <CardDescription>
            You must set a new password before continuing. Your temporary
            password needs to be replaced with a secure one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && !state.fieldErrors && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your temporary password"
                  required
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {state.fieldErrors?.currentPassword && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.currentPassword[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  required
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must contain uppercase, lowercase, and a number.
              </p>
              {state.fieldErrors?.newPassword && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.newPassword[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your new password"
                required
                disabled={isPending}
              />
              {state.fieldErrors?.confirmPassword && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
