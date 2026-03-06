import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Traveler {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
}

// ============ STATE TYPES ============

interface Step1State {
  tripType: "domestic" | "international";
  departureCity: string;
  destination: string;
  travelDate: string;
  duration: string;
  guests: number;
  budget: string;
}

interface Step2State {
  specialRequests: string;
  primaryContact: Traveler;
  phoneVerified: boolean;
}

interface UIState {
  isDurationOpen: boolean;
}

interface ValidationState {
  step1Errors: Record<string, string>;
  step2Errors: Record<string, string>;
  contactErrors: Record<string, string>;
  budgetError: string;
}

interface BookingState {
  currentStep: 1 | 2;
  step1: Step1State;
  step2: Step2State;
  ui: UIState;
  validation: ValidationState;
}

// ============ INITIAL STATE ============

const initialContact: Traveler = {
  firstName: "",
  lastName: "",
  age: 0,
  gender: "", // The initial value is already an empty string.
  email: "",
  phone: "",
};

const initialState: BookingState = {
  currentStep: 1,
  step1: {
    tripType: "domestic",
    departureCity: "",
    destination: "",
    travelDate: "",
    duration: "",
    guests: 1,
    budget: "",
  },
  step2: {
    specialRequests: "",
    primaryContact: { ...initialContact },
    phoneVerified: false,
  },
  ui: {
    isDurationOpen: false,
  },
  validation: {
    step1Errors: {},
    step2Errors: {},
    contactErrors: {},
    budgetError: "",
  },
};

// ============ SLICE ============

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Step Navigation
    setCurrentStep: (state, action: PayloadAction<1 | 2>) => {
      state.currentStep = action.payload;
    },

    // Step 1 Actions
    setTripType: (
      state,
      action: PayloadAction<"domestic" | "international">,
    ) => {
      state.step1.tripType = action.payload;
    },
    setDepartureCity: (state, action: PayloadAction<string>) => {
      state.step1.departureCity = action.payload;
      delete state.validation.step1Errors.departureCity;
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.step1.destination = action.payload;
      delete state.validation.step1Errors.destination;
    },
    setTravelDate: (state, action: PayloadAction<string>) => {
      state.step1.travelDate = action.payload;
      delete state.validation.step1Errors.travelDate;
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.step1.duration = action.payload;
      delete state.validation.step1Errors.duration;
    },
    incrementGuests: (state) => {
      if (state.step1.guests < 30) {
        state.step1.guests += 1;
      }
    },
    decrementGuests: (state) => {
      if (state.step1.guests > 1) {
        state.step1.guests -= 1;
      }
    },
    setGuests: (state, action: PayloadAction<number>) => {
      state.step1.guests = action.payload;
      delete state.validation.step1Errors.guests;
    },
    setBudget: (state, action: PayloadAction<string>) => {
      state.step1.budget = action.payload;
      delete state.validation.step1Errors.budget;
    },

    // Step 2 Actions
    setSpecialRequests: (state, action: PayloadAction<string>) => {
      state.step2.specialRequests = action.payload;
    },
    setPhoneVerified: (state, action: PayloadAction<boolean>) => {
      state.step2.phoneVerified = action.payload;
    },
    updatePrimaryContact: (
      state,
      action: PayloadAction<{
        field: keyof Traveler;
        value: string | number;
      }>,
    ) => {
      const { field, value } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.step2.primaryContact as any)[field] = value;
      // Clear error for this field
      delete state.validation.contactErrors[field];
      // Reset phone verification if phone changes
      if (field === "phone") {
        state.step2.phoneVerified = false;
      }
    },

    // UI Actions
    toggleDurationDropdown: (state) => {
      state.ui.isDurationOpen = !state.ui.isDurationOpen;
    },
    closeDurationDropdown: (state) => {
      state.ui.isDurationOpen = false;
    },

    // Validation Actions
    setStep1Errors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validation.step1Errors = action.payload;
    },
    setStep2Errors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validation.step2Errors = action.payload;
    },
    setContactErrors: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      state.validation.contactErrors = action.payload;
    },
    setBudgetError: (state, action: PayloadAction<string>) => {
      state.validation.budgetError = action.payload;
    },
    clearStep1Error: (state, action: PayloadAction<string>) => {
      delete state.validation.step1Errors[action.payload];
    },

    // Reset
    resetForm: () => initialState,
  },
});

export const {
  setCurrentStep,
  setTripType,
  setDepartureCity,
  setDestination,
  setTravelDate,
  setDuration,
  incrementGuests,
  decrementGuests,
  setGuests,
  setBudget,
  setSpecialRequests,
  setPhoneVerified,
  updatePrimaryContact,
  toggleDurationDropdown,
  closeDurationDropdown,
  setStep1Errors,
  setStep2Errors,
  setContactErrors,
  setBudgetError,
  clearStep1Error,
  resetForm,
} = bookingSlice.actions;

export default bookingSlice.reducer;
