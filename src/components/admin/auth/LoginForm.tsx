"use client";

import logo from "@/../public/images/logo/footer-logo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle, ArrowLeft,
    CheckCircle2, Eye,
    EyeOff, Loader2, LogIn
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

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
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type AuthView =
  | "LOGIN"
  | "FORGOT_PASSWORD"
  | "OTP_VERIFICATION"
  | "RESET_PASSWORD";

interface LoginFormProps {
  onRegisterClick?: () => void;
}

export function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [view, setView] = useState<AuthView>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Flow data
  const [resetEmail, setResetEmail] = useState<string>("");
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const [countdown, setCountdown] = useState(0);

  // Forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
  }, [otpValue, isLoading, view]);

  // Handlers
  async function onLogin(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      let callbackUrl = searchParams.get("callbackUrl") || "/admin";

      if (callbackUrl === "/admin/login" || callbackUrl === "/") {
        callbackUrl = "/admin";
      }

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

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      toast.success("Logged in successfully");

      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 500);
    } catch {
      setError("An unexpected error occurred. Please try again.");
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
        body: JSON.stringify({ ...values, isAdminFlow: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process request.");
        return;
      }

      setResetEmail(values.email);
      setCountdown(60);
      setSuccessMessage(
        `One-Time Password (OTP) has been sent to ${values.email}`,
      );
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
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, isAdminFlow: true }),
      });
      if (!res.ok) {
        setError("Failed to resend OTP.");
      } else {
        setCountdown(60);
        setSuccessMessage(`New OTP sent to ${resetEmail}`);
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
      toast.success("Password reset successfully. Please login.");
      setSuccessMessage("Password reset successfully. Please login.");
      setView("LOGIN");
      resetPasswordForm.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="pb-2 px-8 pt-4"
        >
          {/* View Specific Header */}
          <div className="mb-8 text-center relative flex flex-col items-center justify-center">
            {view !== "LOGIN" && (
              <button
                onClick={() => {
                  if (view === "OTP_VERIFICATION") setView("FORGOT_PASSWORD");
                  else setView("LOGIN");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="absolute -left-4 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors group z-20 cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-emerald-600" />
              </button>
            )}

            <div className="flex justify-center mb-6 px-10">
              <Image
                src={logo}
                alt="Budget Travel Packages"
                width={200}
                height={80}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>

            {view === "LOGIN" && (
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Travel Portal
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Please sign in to continue
                </p>
              </div>
            )}
            {view === "FORGOT_PASSWORD" && (
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Forgot Password
                </h2>
                <p className="text-sm text-gray-500">
                  Enter email to receive security OTP
                </p>
              </div>
            )}
            {view === "OTP_VERIFICATION" && (
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Verify Email
                </h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to you
                </p>
              </div>
            )}
            {view === "RESET_PASSWORD" && (
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  New Password
                </h2>
                <p className="text-sm text-gray-500">
                  Create a strong password for your account
                </p>
              </div>
            )}
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

          {/* LOGIN VIEW */}
          {view === "LOGIN" && (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-6"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold ml-1">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@example.com"
                          disabled={isLoading}
                          className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/10 transition-all rounded-xl text-base text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-700 text-sm font-bold ml-1">
                          Password
                        </FormLabel>
                        <button
                          type="button"
                          onClick={() => setView("FORGOT_PASSWORD")}
                          className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-bold cursor-pointer"
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
                            className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/10 transition-all rounded-xl text-base pr-12 text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Signing in..." : "Sign In to Portal"}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (onRegisterClick) {
                        onRegisterClick();
                      }
                    }}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Join as Travel Partner
                  </button>
                </p>
              </form>
            </Form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === "FORGOT_PASSWORD" && (
            <Form {...forgotPasswordForm}>
              <form
                onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)}
                className="space-y-6"
              >
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold ml-1">
                        Recovery Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your registered email"
                          disabled={isLoading}
                          className="h-12 bg-gray-50/50 border-gray-200 focus:border-emerald-500 rounded-xl text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* OTP VERIFICATION VIEW */}
          {view === "OTP_VERIFICATION" && (
            <Form {...otpVerificationForm}>
              <form
                onSubmit={otpVerificationForm.handleSubmit(onVerifyOtp)}
                className="space-y-6"
              >
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                  <p className="text-xs text-center text-gray-600 mb-4 font-medium">
                    OTP sent to{" "}
                    <span className="text-emerald-700 font-bold">
                      {resetEmail}
                    </span>
                  </p>
                  <FormField
                    control={otpVerificationForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <OtpInput
                            value={field.value}
                            onChange={field.onChange}
                            length={6}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    disabled={countdown > 0 || isLoading}
                    onClick={resendOtp}
                    className={`text-sm font-bold cursor-pointer ${countdown > 0 ? "text-gray-400" : "text-emerald-600 hover:underline"}`}
                  >
                    {countdown > 0
                      ? `Resend code in ${countdown}s`
                      : "Resend OTP Code"}
                  </button>
                </div>
              </form>
            </Form>
          )}

          {/* RESET PASSWORD VIEW */}
          {view === "RESET_PASSWORD" && (
            <Form {...resetPasswordForm}>
              <form
                onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}
                className="space-y-6"
              >
                <FormField
                  control={resetPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold ml-1">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Min 8 characters"
                          disabled={isLoading}
                          className="h-12 bg-gray-50/50 border-gray-200 focus:border-emerald-500 rounded-xl text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold ml-1">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Re-enter password"
                          disabled={isLoading}
                          className="h-12 bg-gray-50/50 border-gray-200 focus:border-emerald-500 rounded-xl text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-3 flex flex-col gap-3 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Dashboard
            </p>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Privacy Policy
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
