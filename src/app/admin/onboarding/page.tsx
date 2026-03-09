"use client";

import footerLogo from "@/../public/images/logo/footer-logo.svg";
import { CameraCapture } from "@/components/admin/onboarding/CameraCapture";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@imagekit/javascript";
import {
    ArrowLeft, ArrowRight, CheckCircle2,
    Eye,
    EyeOff, FileText, Loader2, ScanFace, User
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Regex constants
const INDIA_PHONE_REGEX = /^\d{10}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PAN_REGEX = /^[a-zA-Z0-9]{10}$/;

// Step 1 schema
const personalSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name"),
  lastName: z.string().trim().min(1, "Please enter your last name"),
  gender: z
    .any()
    .refine((val) => ["male", "female", "other"].includes(String(val)), {
      message: "Please select your gender",
    }),
  age: z
    .any()
    .refine(
      (val) => {
        const num = parseInt(String(val || ""), 10);
        return !isNaN(num) && num >= 18 && num <= 120;
      },
      {
        message: "Please enter a valid age (18-120)",
      },
    )
    .transform((val) => parseInt(String(val), 10)),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(INDIA_PHONE_REGEX, "Please enter a valid 10-digit phone number"),
  address: z.string().trim().min(1, "Please enter your full address"),
});

// Step 3 password
const passwordSchema = z
  .object({
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PersonalData = z.infer<typeof personalSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

function OnboardingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Data across steps
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      age: undefined,
      phone: "",
      address: "",
    },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid Onboarding Link
          </h1>
          <p className="text-slate-500">
            This link is invalid or has expired. Please register again from the
            login page.
          </p>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          >
            <a href="/">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4 max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Registration Complete!
          </h1>
          <p className="text-slate-500">
            Your profile has been submitted for verification. An admin will
            review your documents and activate your account. You&apos;ll be
            notified once verified.
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-medium text-amber-800">
              ⏳ Pending Admin Verification
            </p>
            <p className="text-xs text-amber-600 mt-1">
              You cannot login until your account is verified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function uploadToImageKit(
    dataUrl: string,
    fileName: string,
  ): Promise<string> {
    const authRes = await fetch("/api/auth/imagekit");
    const authParams = await authRes.json();

    // Convert data URL to file
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" });

    const result = await upload({
      file,
      fileName: `${fileName}.jpg`,
      folder: "/agent-onboarding/",
      ...authParams,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });

    return result.url!;
  }

  function handleStep1(data: PersonalData) {
    setPersonalData(data);
    setStep(2);
  }

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const trimmed = digits.slice(0, 12);
    const parts = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      parts.push(trimmed.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 12) {
      setAadhaarNumber(rawValue);
    }
  };

  function handleStep2Next() {
    setError(null);
    if (!AADHAAR_REGEX.test(aadhaarNumber)) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (!PAN_REGEX.test(panNumber)) {
      setError("Please enter a valid 10-character PAN.");
      return;
    }
    if (!aadhaarImage) {
      setError("Please capture your Aadhaar card photo.");
      return;
    }
    if (!panImage) {
      setError("Please capture your PAN card photo.");
      return;
    }
    setStep(3);
  }

  async function handleFinalSubmit(pwData: PasswordData) {
    if (!faceImage) {
      setError("Please capture your face photo.");
      return;
    }
    if (!personalData) return;

    setIsLoading(true);
    setError(null);

    try {
      // Upload all images to ImageKit
      const [aadhaarUrl, panUrl, faceUrl] = await Promise.all([
        uploadToImageKit(aadhaarImage!, `aadhaar-${Date.now()}`),
        uploadToImageKit(panImage!, `pan-${Date.now()}`),
        uploadToImageKit(faceImage, `face-${Date.now()}`),
      ]);

      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...personalData,
          aadhaarNumber,
          panNumber,
          password: pwData.password,
          aadhaarImage: aadhaarUrl,
          panImage: panUrl,
          faceImage: faceUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setDone(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const steps = [
    { num: 1, label: "Details", icon: User },
    { num: 2, label: "Documents", icon: FileText },
    { num: 3, label: "Verify", icon: ScanFace },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Image
          src={footerLogo}
          alt="Budget Travel Packages"
          width={140}
          height={50}
          className="h-16 w-auto object-contain"
          priority
        />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Agent Onboarding
        </span>
      </div>

      {/* Stepper */}
      <div className="px-6 py-6 border-b border-slate-50">
        <div className="flex items-center justify-center gap-0 max-w-sm mx-auto">
          {steps.map((s, i) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            const Icon = s.icon;

            return (
              <React.Fragment key={s.num}>
                {s.num > 1 && (
                  <div
                    className={`h-0.5 w-12 mx-2 rounded-full transition-colors duration-500 ${
                      isDone ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isActive
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-500/15"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-slate-400 border border-slate-200"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      isActive ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {error && (
            <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-sm text-red-600 font-medium flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Personal Details
                </h1>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  Start your journey with us by providing basic info.
                </p>
              </div>

              <Form {...personalForm}>
                <form
                  onSubmit={personalForm.handleSubmit(handleStep1)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              className="h-11 rounded-xl text-slate-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              className="h-11 rounded-xl text-slate-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FormField
                          control={personalForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                Gender
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="py-5 rounded-xl w-full bg-white">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={personalForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                Age
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={18}
                                  placeholder="25"
                                  className="h-11 rounded-xl text-slate-900 bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={personalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 font-medium text-slate-500 flex items-center gap-2 select-none pointer-events-none border-r border-slate-200 pr-2 h-5">
                                  <Image
                                    src="/images/flag/india.jpg"
                                    alt="India"
                                    width={20}
                                    height={14}
                                    className="rounded-sm object-cover"
                                  />
                                  <span className="text-sm">+91</span>
                                </div>
                                <Input
                                  {...field}
                                  type="tel"
                                  maxLength={10}
                                  placeholder="9876543210"
                                  className="h-11 rounded-xl pl-20 text-slate-900 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-medium"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Full address"
                            className="h-11 rounded-xl text-slate-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group mt-6"
                  >
                    Next: Documents
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* STEP 2: Documents */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Identity Verification
                </h1>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  Help us verify your identity for a secure platform.
                </p>
              </div>

              <div className="mb-8 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                <div className="text-amber-600 text-lg mt-0.5 font-bold">
                  ⚠️
                </div>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Please provide clear photos of your documents. Use your camera
                  to capture them directly. No manual uploads allowed.
                </p>
              </div>

              <div className="grid gap-6">
                {/* Aadhaar */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Aadhaar Card
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        12-digit UIDAI number
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input
                      value={formatAadhaar(aadhaarNumber)}
                      onChange={handleAadhaarChange}
                      placeholder="0000 0000 0000"
                      className="h-12 text-lg font-bold tracking-widest text-center rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500"
                    />
                    <CameraCapture
                      label="Capture Aadhaar Front"
                      onCapture={setAadhaarImage}
                      capturedImage={aadhaarImage}
                      autoStart={true}
                    />
                  </div>
                </div>

                {/* PAN */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        PAN Card
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        10-char Alphanumeric
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input
                      value={panNumber}
                      onChange={(e) =>
                        setPanNumber(e.target.value.toUpperCase().slice(0, 10))
                      }
                      placeholder="ABCDE1234F"
                      className="h-12 text-lg font-bold tracking-widest text-center rounded-xl bg-slate-50 border-slate-200 focus:border-emerald-500 uppercase"
                    />
                    <CameraCapture
                      label="Capture PAN Front"
                      onCapture={setPanImage}
                      capturedImage={panImage}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleStep2Next}
                  className="flex-[1.5] h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  Next: Security
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Face + Password + Submit */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Account Security
                </h1>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  Take a clear photo of your face and set your secure password.
                </p>
              </div>

              <div className="space-y-6">
                <CameraCapture
                  label="Capture Your Face"
                  onCapture={setFaceImage}
                  capturedImage={faceImage}
                  autoStart={step === 3}
                />

                <div className="border-t border-slate-100 pt-6">
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(handleFinalSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Create Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Min 8 characters"
                                  className="h-11 rounded-xl pr-12 text-slate-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Re-enter password"
                                className="h-11 rounded-xl text-slate-900"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                          disabled={isLoading}
                        >
                          <ArrowLeft className="h-5 w-5 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-[1.5] h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                          )}
                          {isLoading ? "Submitting..." : "Complete Setup"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
