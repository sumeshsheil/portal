import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export const LEAD_STAGES = [
  "new",
  "contacted",
  "booked",
  "proposal_sent",
  "negotiation",
  "won",
  "dropped",
  "abandoned",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_SOURCES = [
  "website",
  "referral",
  "social_media",
  "phone",
  "email",
  "walk_in",
  "manual",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface ITraveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  email?: string;
  phone?: string;
  altPhone?: string;
  memberId?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  documents?: {
    aadharCard: string[];
    panCard: string[];
    passport: string[];
  };
}

export const DOCUMENT_TYPES = [
  "ticket",
  "voucher",
  "visa",
  "itinerary_pdf",
  "invoice",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface IDocument {
  name: string;
  url: string;
  type: DocumentType;
  uploadedAt: Date;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  hotel?: string;
  transport?: string;
}

export interface IBookingPayment {
  amount: number;
  type: "booking" | "trip_cost";
  transactionId: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: Date;
}

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;

  // From landing page form — Step 1
  tripType: "domestic" | "international";
  departureCity: string;
  destination: string;
  travelDate: string; // DD/MM/YYYY format
  duration: string;
  guests: number;
  budget: number;

  // From landing page form — Step 2
  specialRequests?: string;
  travelers: ITraveler[];

  // CRM fields — Admin Panel
  source: LeadSource;
  stage: LeadStage;
  previousStage?: string;
  notes?: string;
  agentId?: mongoose.Types.ObjectId;
  ipAddress?: string;

  // Customer link
  customerId?: mongoose.Types.ObjectId;
  contactId?: mongoose.Types.ObjectId;

  // Payment tracking
  paymentStatus: "pending" | "partial" | "paid";
  paymentAmount?: number;
  bookingPayments?: IBookingPayment[];

  // Trip details — Admin managed
  documents?: IDocument[];
  itinerary?: IItineraryDay[];
  itineraryPdfUrl?: string;
  travelDocumentsPdfUrl?: string;
  inclusions?: string[];
  exclusions?: string[];
  hotelName?: string;
  hotelRating?: number;

  // Trip financial details - Admin managed
  netAmount?: number;
  tripCost?: number; // Calculated as netAmount + tripProfit
  tripProfit?: number;

  // Comments/Notes array
  comments?: Array<{
    text: string;
    agentName: string;
    agentId: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;

  // Timestamps
  lastActivityAt: Date;
  stageUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============ SUB-SCHEMAS ============

const TravelerSchema = new Schema<ITraveler>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    altPhone: {
      type: String,
      trim: true,
    },
    memberId: {
      type: String,
      trim: true,
    },
    aadhaarNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    documents: {
      aadharCard: { type: [String], default: [] },
      panCard: { type: [String], default: [] },
      passport: { type: [String], default: [] },
    },
  },
  { _id: false },
);

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: DOCUMENT_TYPES,
      default: "other",
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ItineraryDaySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    meals: { type: String, trim: true },
    hotel: { type: String, trim: true },
    transport: { type: String, trim: true },
  },
  { _id: false },
);

// ============ MAIN SCHEMA ============

const LeadSchema = new Schema<ILead>(
  {
    // === FROM LANDING PAGE FORM (Step 1) ===
    tripType: {
      type: String,
      enum: ["domestic", "international"],
      required: [true, "Trip type is required"],
    },
    departureCity: {
      type: String,
      required: [true, "Departure city is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    travelDate: {
      type: String,
      required: [true, "Travel date is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
      max: 50,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 1,
    },

    // === FROM LANDING PAGE FORM (Step 2) ===
    specialRequests: {
      type: String,
      maxlength: 500,
    },
    travelers: {
      type: [TravelerSchema],
      validate: {
        validator: (v: ITraveler[]) => v.length >= 1,
        message: "At least one traveler is required",
      },
    },

    // === CRM FIELDS (Admin Panel) ===
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: "website",
    },
    stage: {
      type: String,
      enum: LEAD_STAGES,
      default: "new",
    },
    previousStage: {
      type: String,
      enum: LEAD_STAGES,
    },
    notes: {
      type: String,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },

    // === CUSTOMER LINK ===
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },

    // === PAYMENT TRACKING ===
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    paymentAmount: {
      type: Number,
    },
    bookingPayments: [{
      amount: { type: Number, required: true },
      type: { type: String, enum: ["booking", "trip_cost"], required: true },
      transactionId: { type: String, required: true, trim: true },
      status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
      submittedAt: { type: Date, default: Date.now },
    }],

    // === TRIP DETAILS (Admin-managed) ===
    documents: {
      type: [DocumentSchema],
      default: [],
    },
    itinerary: {
      type: [ItineraryDaySchema],
      default: [],
    },
    itineraryPdfUrl: {
      type: String,
      trim: true,
    },
    travelDocumentsPdfUrl: {
      type: String,
      trim: true,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    hotelName: {
      type: String,
      trim: true,
    },
    hotelRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    // === FINANCIAL DETAILS (Admin-managed) ===
    netAmount: {
      type: Number,
      min: 0,
    },
    tripCost: {
      type: Number,
      min: 0,
    },
    tripProfit: {
      type: Number,
    },

    // === COMMENTS ===
    comments: [
      {
        text: String,
        agentName: String,
        agentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // === ACTIVITY TRACKING ===
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    stageUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ============ INDEXES ============

LeadSchema.index({ stage: 1 });
LeadSchema.index({ agentId: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ lastActivityAt: 1 });
LeadSchema.index({ stage: 1, lastActivityAt: 1 }); // For abandoned lead detection
LeadSchema.index({ customerId: 1 }); // For customer dashboard queries

// ============ MODEL ============

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
