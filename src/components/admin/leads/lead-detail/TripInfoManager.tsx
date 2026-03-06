"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  Plane,
  MapPin,
  Users,
  Banknote,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { updateLeadBasicTripDetails } from "@/app/admin/(dashboard)/leads/[id]/itinerary-actions";

interface TripInfoManagerProps {
  leadId: string;
  tripType: string;
  destination: string;
  departureCity: string;
  travelDate: string;
  duration: string;
  guests: number;
  budget: number;
  netAmount?: number;
  tripCost?: number;
  tripProfit?: number;
  specialRequests?: string;
}

export function TripInfoManager({
  leadId,
  tripType,
  destination,
  departureCity,
  travelDate,
  duration,
  guests,
  budget,
  netAmount,
  tripCost,
  tripProfit,
  specialRequests,
}: TripInfoManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [day, month, year] = travelDate.split("/").map(Number);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    day && month && year ? new Date(year, month - 1, day) : undefined,
  );

  const [formNetAmount, setFormNetAmount] = useState(netAmount || 0);
  const [formTripProfit, setFormTripProfit] = useState(tripProfit || 0);

  const formTotalCost = formNetAmount + formTripProfit;

  const handleSave = (formData: FormData) => {
    setError("");
    // Add formatted date to formData
    if (selectedDate) {
      formData.set("travelDate", format(selectedDate, "dd/MM/yyyy"));
    } else {
      formData.set("travelDate", travelDate);
    }

    startTransition(async () => {
      const result = await updateLeadBasicTripDetails(leadId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plane className="h-5 w-5 text-emerald-600" />
          Trip Overview
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Trip"}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form action={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <Select name="tripType" defaultValue={tripType}>
                  <SelectTrigger id="tripType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  defaultValue={destination}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureCity">Departure City</Label>
                <Input
                  id="departureCity"
                  name="departureCity"
                  defaultValue={departureCity}
                  required
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="mb-2">Travel Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={duration}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  defaultValue={guests}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min={1}
                  defaultValue={budget}
                  required
                  disabled
                />
              </div>
              <div></div>

              <div className="space-y-2">
                <Label htmlFor="netAmount">Net ₹</Label>
                <Input
                  id="netAmount"
                  name="netAmount"
                  type="number"
                  min={0}
                  value={formNetAmount}
                  onChange={(e) => setFormNetAmount(Number(e.target.value))}
                  placeholder="Cost to company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tripProfit">
                  Profit ₹
                </Label>
                <Input
                  id="tripProfit"
                  name="tripProfit"
                  type="number"
                  value={formTripProfit}
                  onChange={(e) => setFormTripProfit(Number(e.target.value))}
                  placeholder="Internal margin"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 p-3 bg-muted rounded-md border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-muted-foreground">
                    Total Amount (Trip Cost):
                  </span>
                  <span className="font-bold text-lg text-emerald-600">
                    ₹{formTotalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Customer will see this amount.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                defaultValue={specialRequests}
                placeholder="Any special requirements..."
                className="resize-none min-h-[80px]"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 h-9"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Trip Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Plane className="h-3.5 w-3.5" />
                Type
              </div>
              <p className="capitalize font-medium">{tripType} Trip</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Destination
              </div>
              <p className="font-medium">{destination}</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Travel Date
              </div>
              <p className="font-medium">{travelDate}</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Duration
              </div>
              <p className="font-medium">{duration}</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Departure City
              </div>
              <p className="font-medium">{departureCity}</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Guests
              </div>
              <p className="font-medium">{guests} People</p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5" />
                Budget
              </div>
              <p className="font-medium text-emerald-700">
                ₹{budget.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5 text-blue-600" />
                Net Amount
              </div>
              <p className="font-medium text-blue-700">
                ₹{(netAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5 text-orange-600" />
                Profit Margin
              </div>
              <p className="font-medium text-orange-700">
                ₹{(tripProfit || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2 pt-2 border-t">
              <div className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                <Banknote className="h-4 w-4 text-emerald-600" />
                Total Trip Cost
              </div>
              <p className="font-bold text-lg text-emerald-700">
                ₹{(tripCost || 0).toLocaleString("en-IN")}
              </p>
            </div>

            {specialRequests && (
              <div className="sm:col-span-2 space-y-1 mt-2 pt-2 border-t">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Special Requests
                </div>
                <p className="text-sm leading-relaxed italic text-muted-foreground">
                  &quot;{specialRequests}&quot;
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
