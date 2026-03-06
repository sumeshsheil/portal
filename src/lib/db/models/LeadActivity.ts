import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export interface ILeadActivity extends Document {
  _id: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  details?: string;
  fromStage?: string;
  toStage?: string;
  createdAt: Date;
}

// ============ SCHEMA ============

const LeadActivitySchema = new Schema<ILeadActivity>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Lead ID is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: [
        "created",
        "stage_changed",
        "agent_assigned",
        "agent_unassigned",
        "note_added",
        "details_updated",
        "auto_abandon",
        "abandon_recovered",
      ],
    },
    details: {
      type: String,
    },
    fromStage: {
      type: String,
    },
    toStage: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// ============ INDEXES ============

LeadActivitySchema.index({ leadId: 1, createdAt: -1 });

// ============ MODEL ============

const LeadActivity: Model<ILeadActivity> =
  mongoose.models.LeadActivity ||
  mongoose.model<ILeadActivity>("LeadActivity", LeadActivitySchema);

export default LeadActivity;
