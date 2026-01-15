import mongoose, { Schema, type InferSchemaType } from "mongoose";

const YcStartupSchema = new Schema(
  {
    ycId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    logo: { type: String, default: null },
    website: { type: String, default: null },
    oneLiner: { type: String, default: null },
    longDescription: { type: String, default: null },
    batch: { type: String, default: null },
    industries: { type: [String], default: [] },
    regions: { type: [String], default: [] },
    isHiring: { type: Boolean, default: false },
    teamSize: { type: Number, default: null },
    status: { type: String, default: null },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export type YcStartupDoc = InferSchemaType<typeof YcStartupSchema>;

export const YcStartupModel =
  (mongoose.models.YcStartup as mongoose.Model<YcStartupDoc>) ||
  mongoose.model<YcStartupDoc>("YcStartup", YcStartupSchema);
