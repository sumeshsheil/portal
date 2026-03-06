import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  agentId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
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
    notes: {
      type: String,
      maxlength: 1000,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ agentId: 1 });
ContactSchema.index({ createdAt: -1 });

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
