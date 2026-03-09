"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import Image from "next/image";
import { toast } from "sonner";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Separate schema for OTP verification step
const otpVerificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView =
  | "LOGIN"
  | "REGISTER"
  | "FORGOT_PASSWORD"
  | "OTP_VERIFICATION"
  | "RESET_PASSWORD"
  | "SET_PASSWORD";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>("LOGIN");
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for flow data
  const [resetEmail, setResetEmail] = useState<string>("");
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");

  // Countdown timer state
  const [countdown, setCountdown] = useState(0);

  // Forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpVerificationForm = useForm<OtpVerificationFormValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { otp: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const setPasswordForm = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const token = searchParams.get("token");
      const action = searchParams.get("action");

      if (token && action === "set-password") {
        setView("SET_PASSWORD");
      } else {
        setView("LOGIN");
      }

      setError(null);
      setSuccessMessage(null);
      setResetEmail("");
      setVerifiedOtp("");
      setCountdown(0);
      loginForm.reset();
      registerForm.reset();
      forgotPasswordForm.reset();
      otpVerificationForm.reset();
      resetPasswordForm.reset();
      setPasswordForm.reset();
    }
  }, [isOpen, searchParams]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-verify OTP when 6 digits are entered
  const otpValue = otpVerificationForm.watch("otp");
  useEffect(() => {
    if (otpValue?.length === 6 && !isLoading && view === "OTP_VERIFICATION") {
      otpVerificationForm.handleSubmit(onVerifyOtp)();
    }
  }, [otpValue, isLoading, view, otpVerificationForm]);

  // Handlers
  async function onLogin(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Pre-validate to get specific error messages
      const validateRes = await fetch("/api/auth/validate-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const validateData = await validateRes.json();

      if (!validateRes.ok) {
        setError(validateData.error || "Invalid email or password.");
        return;
      }

      // Step 2: Validation passed — proceed with NextAuth signIn
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // This shouldn't happen since we pre-validated, but handle as fallback
        setError("Invalid email or password. Please try again.");
        return;
      }

      onClose();
      router.push("/dashboard");
      router.refresh();
      toast.success("Logged in successfully");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegister(values: RegisterFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccessMessage(
        data.message || "Check your email to activate your account.",
      );
      registerForm.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSetPassword(values: SetPasswordFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const token = searchParams.get("token");
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password.");
        return;
      }

      toast.success("Password set successfully! Logging you in...");

      // Auto-login after setting password
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: values.password,
        redirect: false,
      });

      if (loginResult?.error) {
        setView("LOGIN");
        setError("Account activated. Please login with your new password.");
        return;
      }

      onClose();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onForgotPassword(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process request.");
        return;
      }

      setResetEmail(values.email);
      // Start countdown when OTP is successfully sent
      setCountdown(60);
      setSuccessMessage(`OTP sent to ${values.email}`);
      setView("OTP_VERIFICATION");
      forgotPasswordForm.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    if (countdown > 0) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        setError("Failed to resend OTP. Please try again.");
      } else {
        setCountdown(60);
        setSuccessMessage(`OTP resent to ${resetEmail}`);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyOtp(values: OtpVerificationFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: values.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      setVerifiedOtp(values.otp);
      setView("RESET_PASSWORD");
      otpVerificationForm.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPassword(values: ResetPasswordFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      // Double verify by sending OTP again with the password
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: verifiedOtp,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccessMessage("Password reset successfully. Please login.");
      setView("LOGIN");
      resetPasswordForm.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />
          <div className="fixed inset-0 overflow-y-auto z-70">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {view !== "LOGIN" && (
                  <button
                    onClick={() => {
                      if (view === "RESET_PASSWORD") {
                        // If going back from reset password, maybe warn or just go to login essentially cancelling flow
                        setView("LOGIN");
                      } else if (view === "OTP_VERIFICATION") {
                        setView("FORGOT_PASSWORD");
                      } else {
                        setView("LOGIN");
                      }
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                <div className="flex flex-col items-center justify-center pt-8 pb-4">
                  <div className="relative w-66 h-28 mb-2">
                    <Image
                      src="/images/logo/footer-logo.svg"
                      alt="Budget Travel Packages"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {view === "LOGIN" && "Welcome Back"}
                    {view === "REGISTER" && "Create Account"}
                    {view === "FORGOT_PASSWORD" && "Forgot Password"}
                    {view === "OTP_VERIFICATION" && "Verify Email"}
                    {view === "RESET_PASSWORD" && "Reset Password"}
                    {view === "SET_PASSWORD" && "Set Password"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 px-6 text-center">
                    {view === "LOGIN" && "Sign in to access your account"}
                    {view === "REGISTER" && "Sign up to start your journey"}
                    {view === "FORGOT_PASSWORD" &&
                      "Enter your email to receive an OTP"}
                    {view === "RESET_PASSWORD" &&
                      "Create a new password for your account"}
                    {view === "SET_PASSWORD" &&
                      "Secure your account with a new password"}
                  </p>
                </div>

                <div className="p-8 pt-2">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {successMessage}
                    </div>
                  )}

                  {/* LOGIN FORM */}
                  {view === "LOGIN" && (
                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLogin)}
                        className="space-y-5"
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="name@example.com"
                                  disabled={isLoading}
                                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-gray-700 font-medium">
                                  Password
                                </FormLabel>
                                <button
                                  type="button"
                                  onClick={() => setView("FORGOT_PASSWORD")}
                                  className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium cursor-pointer"
                                >
                                  Forgot password?
                                </button>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* REGISTER FORM */}
                  {view === "REGISTER" && (
                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onRegister)}
                        className="space-y-5"
                      >
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="name@example.com"
                                  disabled={isLoading}
                                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Join Budget Travel"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* SET PASSWORD FORM */}
                  {view === "SET_PASSWORD" && (
                    <Form {...setPasswordForm}>
                      <form
                        onSubmit={setPasswordForm.handleSubmit(onSetPassword)}
                        className="space-y-5"
                      >
                        <FormField
                          control={setPasswordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                New Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={setPasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  disabled={isLoading}
                                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 pr-10"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Setting Password...
                            </>
                          ) : (
                            "Activate Account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* FORGOT PASSWORD FORM */}
                  {view === "FORGOT_PASSWORD" && (
                    <Form {...forgotPasswordForm}>
                      <form
                        onSubmit={forgotPasswordForm.handleSubmit(
                          onForgotPassword,
                        )}
                        className="space-y-5"
                      >
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="name@example.com"
                                  disabled={isLoading}
                                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* OTP VERIFICATION FORM */}
                  {view === "OTP_VERIFICATION" && (
                    <Form {...otpVerificationForm}>
                      <form
                        onSubmit={otpVerificationForm.handleSubmit(onVerifyOtp)}
                        className="space-y-5"
                      >
                        <FormField
                          control={otpVerificationForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Enter OTP Code
                              </FormLabel>
                              <FormControl>
                                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 space-y-4">
                                  <div className="text-center">
                                    <p
                                      className="text-sm text-gray-600"
                                      role="status"
                                    >
                                      Enter OTP sent to{" "}
                                      <span className="font-bold text-black">
                                        {resetEmail}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex justify-center">
                                    <OtpInput
                                      value={field.value}
                                      onChange={field.onChange}
                                      length={6}
                                      disabled={isLoading}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs text-center" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            disabled={countdown > 0 || isLoading}
                            onClick={resendOtp}
                            className={`text-sm font-medium flex items-center justify-center w-full cursor-pointer ${
                              countdown > 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-emerald-600 hover:text-emerald-700 hover:underline"
                            }`}
                          >
                            {countdown > 0 ? (
                              <>Resend code in {countdown}s</>
                            ) : (
                              <>Resend OTP Code</>
                            )}
                          </button>
                        </div>
                      </form>
                    </Form>
                  )}

                  {/* RESET PASSWORD FORM */}
                  {view === "RESET_PASSWORD" && (
                    <Form {...resetPasswordForm}>
                      <form
                        onSubmit={resetPasswordForm.handleSubmit(
                          onResetPassword,
                        )}
                        className="space-y-5"
                      >
                        <FormField
                          control={resetPasswordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                New Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 chars"
                                    disabled={isLoading}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resetPasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    disabled={isLoading}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 pr-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Resetting Password...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  <div className="mt-6 text-center">
                    {view === "LOGIN" && (
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          onClick={() => setView("REGISTER")}
                          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold cursor-pointer"
                        >
                          Sign up
                        </button>
                      </p>
                    )}
                    {(view === "REGISTER" || view === "FORGOT_PASSWORD") && (
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          onClick={() => setView("LOGIN")}
                          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold cursor-pointer"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
