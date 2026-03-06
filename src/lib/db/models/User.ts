import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "agent" | "customer";
  status: "active" | "inactive";
  phone?: string;
  altPhone?: string;
  mustChangePassword: boolean;
  isActivated: boolean;
  setPasswordToken?: string;
  setPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  image?: string;
  gender?: "male" | "female" | "other";
  birthDate?: Date;
  age?: number;
  address?: string;
  aadhaarNumber?: string;
  passportNumber?: string;
  panNumber?: string;
  documents?: {
    aadharCard: string[];
    panCard: string[];
    passport: string[];
  };
  verificationStatus: "unverified" | "pending" | "approved" | "rejected";
  verificationNote?: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  members?: IMember[];
  // Subscription fields
  plan: "free" | "basic" | "pro" | "premium" | "enterprise";
  subscriptionStatus: "active" | "expired" | "pending";
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  billingCycle?: "monthly" | "90days" | "yearly";
  transactionId?: string;
  leadCount: number;
  packageCount: number;
}

export interface IMember {
  name: string;
  email?: string;
  gender: "male" | "female" | "other";
  age: number;
  aadhaarNumber?: string;
  passportNumber?: string;
  documents?: {
    aadharCard: string[];
    passport: string[];
  };
}

// ============ SCHEMA ============

const MemberSchema = new Schema<IMember>({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  age: { type: Number, required: true, min: 0, max: 120 },
  aadhaarNumber: { type: String, trim: true },
  passportNumber: { type: String, trim: true },
  documents: {
    aadharCard: [{ type: String }],
    passport: [{ type: String }],
  },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "agent", "customer"],
        message: "{VALUE} is not a valid role",
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    phone: {
      type: String,
      trim: true,
    },
    altPhone: {
      type: String,
      trim: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    setPasswordToken: {
      type: String,
    },
    setPasswordExpires: {
      type: Date,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    image: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    birthDate: { type: Date },
    age: { type: Number },
    address: { type: String, trim: true },
    aadhaarNumber: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    documents: {
      aadharCard: [{ type: String }],
      panCard: [{ type: String }],
      passport: [{ type: String }],
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },
    verificationNote: { type: String },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    members: {
      type: [MemberSchema],
      validate: [
        (val: IMember[]) => val.length <= 30,
        "Cannot exceed 30 members",
      ],
      default: [],
    },
    // === SUBSCRIPTION FIELDS ===
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "premium", "enterprise"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "active",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "90days", "yearly"],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    leadCount: {
      type: Number,
      default: 0,
    },
    packageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ============ INDEXES ============

UserSchema.index({ role: 1, status: 1 });

// ============ MODEL ============

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
