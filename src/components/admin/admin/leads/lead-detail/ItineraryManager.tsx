"use client";

import {
    addItineraryDay,
    removeItineraryDay,
    updateTripDetails
} from "@/app/admin/(dashboard)/leads/[id]/itinerary-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Bus, Hotel, Loader2, MapPin, Plus, Trash2, UtensilsCrossed
} from "lucide-react";
import { useState, useTransition } from "react";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  hotel?: string;
  transport?: string;
}

export function ItineraryManager({
  leadId,
  itinerary,
  inclusions,
  exclusions,
  hotelName,
  hotelRating,
}: {
  leadId: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  hotelName?: string;
  hotelRating?: number;
}) {
  const [showDayForm, setShowDayForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleAddDay = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await addItineraryDay(leadId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowDayForm(false);
      }
    });
  };

  const handleRemoveDay = (index: number) => {
    startTransition(async () => {
      await removeItineraryDay(leadId, index);
    });
  };

  const handleUpdateDetails = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await updateTripDetails(leadId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowDetailsForm(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Trip Details Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Hotel className="h-5 w-5 text-emerald-600" />
            Trip Details
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDetailsForm(!showDetailsForm)}
          >
            {showDetailsForm ? "Cancel" : "Edit Details"}
          </Button>
        </CardHeader>
        <CardContent>
          {showDetailsForm ? (
            <form action={handleUpdateDetails} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Hotel Name
                  </label>
                  <Input
                    name="hotelName"
                    defaultValue={hotelName || ""}
                    placeholder="Hotel Grand Goa"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Hotel Rating (1-5)
                  </label>
                  <Input
                    name="hotelRating"
                    type="number"
                    min={1}
                    max={5}
                    defaultValue={hotelRating || ""}
                    placeholder="3"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Inclusions (one per line)
                </label>
                <textarea
                  name="inclusions"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  defaultValue={inclusions.join("\n")}
                  placeholder={"Breakfast\nAirport transfer\nSightseeing"}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Exclusions (one per line)
                </label>
                <textarea
                  name="exclusions"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  defaultValue={exclusions.join("\n")}
                  placeholder={"Airfare\nPersonal expenses\nTravel insurance"}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Details"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              {hotelName && (
                <div className="flex items-center gap-2 text-sm">
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{hotelName}</span>
                  {hotelRating && (
                    <span className="text-amber-500">
                      {"★".repeat(hotelRating)}
                      {"☆".repeat(5 - hotelRating)}
                    </span>
                  )}
                </div>
              )}
              {inclusions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Inclusions
                  </p>
                  <ul className="text-sm space-y-0.5">
                    {inclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-500">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exclusions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Exclusions
                  </p>
                  <ul className="text-sm space-y-0.5">
                    {exclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-red-500">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!hotelName &&
                inclusions.length === 0 &&
                exclusions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No trip details added yet. Click &quot;Edit Details&quot; to
                    add.
                  </p>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itinerary Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Itinerary
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDayForm(!showDayForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Day
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {showDayForm && (
            <form
              action={handleAddDay}
              className="space-y-3 p-4 border rounded-lg bg-muted/30"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  name="day"
                  type="number"
                  min={1}
                  placeholder="Day #"
                  defaultValue={itinerary.length + 1}
                  required
                />
                <Input
                  name="title"
                  placeholder="Day title"
                  className="sm:col-span-2"
                  required
                />
              </div>
              <textarea
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Day description..."
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  name="meals"
                  placeholder="Meals (e.g., Breakfast, Lunch)"
                />
                <Input name="hotel" placeholder="Hotel name" />
                <Input
                  name="transport"
                  placeholder="Transport (e.g., AC Bus)"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Day"
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDayForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {itinerary.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No itinerary added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {itinerary.map((day, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
                          {day.day}
                        </span>
                        <h4 className="font-semibold text-sm">{day.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-9">
                        {day.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 ml-9">
                        {day.meals && (
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <UtensilsCrossed className="h-3 w-3" />
                            {day.meals}
                          </span>
                        )}
                        {day.hotel && (
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Hotel className="h-3 w-3" />
                            {day.hotel}
                          </span>
                        )}
                        {day.transport && (
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Bus className="h-3 w-3" />
                            {day.transport}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 shrink-0"
                      onClick={() => handleRemoveDay(index)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
