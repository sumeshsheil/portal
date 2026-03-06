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
  address: z.string().min(10, "Address must be at least 10 characters"),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Invalid Aadhaar number (12 digits)"),
  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number (e.g., ABCDE1234F)",
    ),
  image: z.string().optional(),
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
                disabled={true}
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
              <form className="space-y-6">
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
                              disabled
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
                              disabled
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
                              disabled
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
                          disabled
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
                              disabled
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
