"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Check,
  ShieldAlert,
  ShieldCheck,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Smartphone,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import {
  updateAgentProfile,
  submitVerification,
} from "@/app/admin/(dashboard)/profile/actions";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  age: z.number().min(18, "Must be at least 18 years old").max(100),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(3, "Address must be at least 3 characters"),
  aadhaarNumber: z.string().min(10, "Aadhaar must be at least 10 characters"),
  panNumber: z.string().min(10, "PAN must be at least 10 characters"),
  image: z.string().optional(),
  bankDetails: z.object({
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    ifscCode: z.string().optional(),
    branchName: z.string().optional(),
  }).optional(),
  upiId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AgentProfileFormProps {
  initialData: any;
}

export function AgentProfileForm({ initialData }: AgentProfileFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  const [aadharCards, setAadharCards] = useState<string[]>(
    initialData.documents?.aadharCard || [],
  );
  const [panCards, setPanCards] = useState<string[]>(
    initialData.documents?.panCard || [],
  );
  const [profileImage, setProfileImage] = useState<string[]>(
    initialData.image ? [initialData.image] : [],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || "",
      phone: initialData.phone || "",
      age: initialData.age || 0,
      gender: initialData.gender || "male",
      address: initialData.address || "",
      aadhaarNumber: initialData.aadhaarNumber || "",
      panNumber: initialData.panNumber || "",
      image: initialData.image || "",
      bankDetails: {
        accountHolderName: initialData.bankDetails?.accountHolderName || "",
        accountNumber: initialData.bankDetails?.accountNumber || "",
        bankName: initialData.bankDetails?.bankName || "",
        ifscCode: initialData.bankDetails?.ifscCode || "",
        branchName: initialData.bankDetails?.branchName || "",
      },
      upiId: initialData.upiId || "",
    },
  });

  async function onProfileSubmit(values: ProfileFormValues) {
    setIsPending(true);
    try {
      const result = await updateAgentProfile({
        ...values,
        image: profileImage[0] || "",
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  }

  async function onDocSubmit() {
    if (!aadharCards.length || !panCards.length) {
      toast.error("Please upload both Aadhaar and PAN cards");
      return;
    }

    setIsSubmittingDoc(true);
    try {
      const result = await submitVerification({
        aadharCard: aadharCards,
        panCard: panCards,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit verification");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmittingDoc(false);
    }
  }

  const statusColors = {
    unverified:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Status Banner */}
      <Card
        className={`border-none ${statusColors[initialData.verificationStatus as keyof typeof statusColors]}`}
      >
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {initialData.verificationStatus === "approved" ? (
              <ShieldCheck className="h-6 w-6" />
            ) : initialData.verificationStatus === "rejected" ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <Loader2
                className={`h-6 w-6 ${initialData.verificationStatus === "pending" ? "animate-spin" : ""}`}
              />
            )}
            <div>
              <p className="font-bold flex items-center gap-2">
                Verification Status:{" "}
                <span className="capitalize">
                  {initialData.verificationStatus}
                </span>
              </p>
              {initialData.verificationNote && (
                <p className="text-sm opacity-90">
                  {initialData.verificationNote}
                </p>
              )}
            </div>
          </div>
          {initialData.verificationStatus === "unverified" && (
            <Badge variant="outline" className="border-current">
              Action Required
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Pic & Docs */}
        <div className="space-y-8 col-span-1">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ImageUpload
                value={profileImage}
                onChange={setProfileImage}
                onRemove={() => setProfileImage([])}
                maxFiles={1}
                folder="/agent-profiles"
                accept="image/*"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Your professional agent profile photo.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Personal Info Form */}
        <Card className="col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Your contact and identification details (Read-only).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onProfileSubmit, (errors) => {
                  console.error("Form Validation Errors:", errors);
                  toast.error("Please fix the validation errors in the form.");
                })} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-muted/50"
                          value={initialData.email}
                          disabled
                        />
                      </div>
                    </FormControl>
                  </FormItem>

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Age */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
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

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Aadhaar Number */}
                  <FormField
                    control={form.control}
                    name="aadhaarNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number (12 Digits)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PAN Number */}
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number (e.g. ABCDE1234F)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9 uppercase"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="md:col-span-2" />

                  {/* Identity Documentation Integrated here */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
                        <FileText className="h-4 w-4 text-emerald-600" /> Identity Documents
                      </h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        Verified identity documents (Read-only).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Aadhaar Card (PDF)</Label>
                        <ImageUpload
                          value={aadharCards}
                          onChange={setAadharCards}
                          onRemove={() => setAadharCards([])}
                          maxFiles={1}
                          folder="/agent-docs/aadhaar"
                          accept="application/pdf"
                          disabled={true}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">PAN Card (PDF)</Label>
                        <ImageUpload
                          value={panCards}
                          onChange={setPanCards}
                          onRemove={() => setPanCards([])}
                          maxFiles={1}
                          folder="/agent-docs/pan"
                          accept="application/pdf"
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="md:col-span-2" />

                {/* Payout Details Section */}
                <div className="md:col-span-2 space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                        <div className="h-5 w-5 bg-amber-500 rounded-lg flex items-center justify-center text-[11px] text-white font-black shadow-sm">₹</div> 
                        Payout & Bank Details
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Required for automated payouts. Keep this information accurate.
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-bold text-[10px] uppercase tracking-tighter animate-pulse">
                      Coming Soon: More Methods
                    </Badge>
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-8">
                    {/* UPI Section */}
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Smartphone className="h-3 w-3" /> UPI Identification
                      </Label>
                      <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="e.g. username@okhdfcbank" 
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus-visible:ring-amber-500 transition-all shadow-xs"
                                  {...field} 
                                />
                                <div className="absolute right-3 top-3.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900">
                                  ACTIVE
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription className="text-[10px]">
                              Verify your UPI ID before saving.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Bank Details Grid */}
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Banknote className="h-3 w-3" /> Bank Account Details
                      </Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField
                          control={form.control}
                          name="bankDetails.accountHolderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-slate-600 dark:text-slate-400">Account Holder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name as per Passbook" className="bg-white dark:bg-slate-950 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bankDetails.accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-slate-600 dark:text-slate-400">Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Account Number" className="font-mono bg-white dark:bg-slate-950 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bankDetails.bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-slate-600 dark:text-slate-400">Bank Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. HDFC Bank" className="bg-white dark:bg-slate-950 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bankDetails.ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-slate-600 dark:text-slate-400">IFSC Code</FormLabel>
                              <FormControl>
                                <Input placeholder="HDFC0001234" className="uppercase font-mono bg-white dark:bg-slate-950 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bankDetails.branchName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold text-slate-600 dark:text-slate-400">Branch Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Downtown Branch" className="bg-white dark:bg-slate-950 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end md:col-span-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
