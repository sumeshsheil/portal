import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPayoutRequest extends Document {
  agentId: mongoose.Types.ObjectId;
  amount: number;
  status: "processing" | "decline" | "Paid";
  payoutMethod: {
    type: "bank" | "upi";
    details: {
      accountHolderName?: string;
      accountNumber?: string;
      bankName?: string;
      ifscCode?: string;
      branchName?: string;
      upiId?: string;
    };
  };
  agentNote?: string;
  adminNote?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutRequestSchema = new Schema<IPayoutRequest>(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["processing", "decline", "Paid"],
      default: "processing",
    },
    payoutMethod: {
      type: {
        type: String,
        enum: ["bank", "upi"],
        required: true,
      },
      details: {
        accountHolderName: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String,
        branchName: String,
        upiId: String,
      },
    },
    agentNote: {
      type: String,
      trim: true,
    },
    adminNote: {
      type: String,
      trim: true,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PayoutRequestSchema.index({ agentId: 1, status: 1 });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.PayoutRequest;
}

const PayoutRequest: Model<IPayoutRequest> =
  mongoose.models.PayoutRequest ||
  mongoose.model<IPayoutRequest>("PayoutRequest", PayoutRequestSchema);

export default PayoutRequest;
