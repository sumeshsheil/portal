"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
    CalendarIcon, Check, ChevronsUpDown, Globe, Loader2,
    Plus, Search,
    User as UserIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
// ... (rest of imports same)
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from "@/components/ui/command";
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
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { createLead, getCustomers } from "@/app/admin/(dashboard)/leads/actions";
import { useDebounce } from "@/hooks/use-debounce";

const DEPARTURE_CITIES = [
  "Agartala",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Amritsar",
  "Asansol",
  "Aurangabad",
  "Bagdogra",
  "Belagavi",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Bilaspur",
  "Bokaro",
  "Calicut",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Dibrugarh",
  "Dimapur",
  "Durgapur",
  "Erode",
  "Gaya",
  "Guwahati",
  "Hubballi",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Itanagar",
  "Jabalpur",
  "Jaipur",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kadapa",
  "Kannur",
  "Kanpur",
  "Kanyakumari",
  "Karimnagar",
  "Kochi",
  "Kolhapur",
  "Kolkata",
  "Korba",
  "Kurnool",
  "Lucknow",
  "Madurai",
  "Mangaluru",
  "Mumbai",
  "Nagpur",
  "Nellore",
  "Nizamabad",
  "Patna",
  "Port Blair",
  "Pune",
  "Raipur",
  "Rajahmundry",
  "Ranchi",
  "Salem",
  "Shillong",
  "Silchar",
  "Siliguri",
  "Srinagar",
  "Surat",
  "Tezpur",
  "Thiruvananthapuram",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirupati",
  "Tiruppur",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

// ... (schemas same)
const formSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  tripType: z.enum(["domestic", "international"]),
  destination: z.string().min(2, "Destination is required"),
  departureCity: z.string().min(2, "Departure city is required"),
  travelDate: z.date(),
  duration: z.string().min(1, "Duration is required"),
  guests: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Must be at least 1 guest",
  }),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget must be fixed",
  }),
  specialRequests: z.string().optional(),
});

interface CreateLeadDialogProps {
  triggerClassName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  fullWidth?: boolean;
}

export function CreateLeadDialog({
  triggerClassName,
  variant,
  fullWidth,
}: CreateLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const debouncedCustomerSearch = useDebounce(customerSearch, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      tripType: "domestic",
      destination: "",
      departureCity: "",
      duration: "",
      guests: "1",
      budget: "",
      specialRequests: "",
    },
  });

  const { control, handleSubmit, formState, setValue } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoadingCustomers(true);
      const res = await getCustomers(debouncedCustomerSearch);
      if (res.success) {
        setCustomers(res.customers || []);
      }
      setIsLoadingCustomers(false);
    }
    if (open) {
      fetchCustomers();
    }
  }, [debouncedCustomerSearch, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "travelDate") {
          formData.append(key, format(value as Date, "dd/MM/yyyy"));
        } else {
          formData.append(key, String(value));
        }
      });

      const result = await createLead(null, formData);

      if (result.success) {
        toast.success("Inquiry created successfully");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create inquiry");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  }

  const selectedCustomer = customers.find((c) => c._id === form.watch("customerId"));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-emerald-600 hover:bg-emerald-700 text-white",
            fullWidth && "w-full justify-start",
            triggerClassName,
          )}
          variant={variant || "default"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Manual Inquiry
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl w-full lg:max-w-[1000px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl"
        data-lenis-prevent
      >
        <div className="bg-primary/5 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              Create New Manual Inquiry
            </DialogTitle>
            <DialogDescription className="text-base">
              Link this inquiry to an existing customer and fill in the travel details.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Customer Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground/80 mb-4">
                <UserIcon className="w-5 h-5 text-primary" />
                <h3>Customer Information</h3>
              </div>

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Customer</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-12 text-left font-normal border-2 hover:border-primary/50 transition-colors",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <div className="flex flex-col items-start overflow-hidden">
                                <span className="font-medium text-foreground truncate w-full">
                                  {selectedCustomer?.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate w-full">
                                  {selectedCustomer?.email}
                                </span>
                              </div>
                            ) : (
                              "Search and select a customer..."
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                        <div className="flex flex-col">
                          <div className="flex items-center border-b px-3 h-11">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-full w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search by name or email..."
                              value={customerSearch}
                              onChange={(e) => setCustomerSearch(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-1">
                            {isLoadingCustomers ? (
                              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching customers...
                              </div>
                            ) : customers.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                No customers found.
                              </div>
                            ) : (
                              customers.map((customer) => (
                                <div
                                  key={customer._id}
                                  className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
                                    field.value === customer._id && "bg-accent"
                                  )}
                                  onClick={() => {
                                    form.setValue("customerId", customer._id);
                                    setPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === customer._id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="font-medium truncate">{customer.name}</span>
                                    <span className="text-xs text-muted-foreground truncate">
                                      {customer.email} • {customer.phone}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="opacity-50" />

            {/* Travel Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground/80 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h3>Travel Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={control}
                  name="tripType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-semibold text-foreground/70">
                        Trip Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 py-[20px] w-full pl-12 relative overflow-hidden flex border-2 focus:ring-2 focus:ring-primary/20">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          data-lenis-prevent
                          position="popper"
                          className="w-(--radix-select-trigger-width) rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1"
                        >
                          <SelectItem
                            value="domestic"
                            className="rounded-lg py-2.5 cursor-pointer"
                          >
                            Domestic
                          </SelectItem>
                          <SelectItem
                            value="international"
                            className="rounded-lg py-2.5 cursor-pointer"
                          >
                            International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Maldives, Goa, Dubai"
                          {...field}
                          className="h-11 border-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="departureCity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure City</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between h-11 border-2 text-left font-normal focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value || "Select city..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search city..."
                              onValueChange={setSearchTerm}
                            />
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                              {DEPARTURE_CITIES.filter((city) =>
                                city.toLowerCase().includes(searchTerm.toLowerCase())
                              ).map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={() => {
                                    form.setValue("departureCity", city);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === city
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="travelDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Travel</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-11 border-2 focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 5 Days / 4 Nights"
                          {...field}
                          className="h-11 border-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of Guests</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          className="h-11 border-2 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3">
                      <FormLabel>Expected Budget (Fixed)</FormLabel>
                      <FormControl>
                        <div className="relative w-full sm:w-1/2 lg:w-1/3">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            type="number"
                            placeholder="50000"
                            {...field}
                            className="pl-7 h-11 border-2 focus-visible:ring-primary/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Special Requests Section */}
            <div className="space-y-4">
              <FormField
                control={control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests / Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific hotels, dietary requirements, or activities..."
                        className="min-h-[120px] resize-none border-2 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                className="flex-1 h-12 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Inquiry...
                  </>
                ) : (
                  "Create Manual Inquiry"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 border-2"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
