// models/Vendor.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId; // linked to User
  name: string;
  type: "PHARMACY" | "CLINIC" | "HOSPITAL" | "WHOLESALER";
  billingAddress: {
    line1: string;
    city: string;
    country: string;
    postalCode: string;
  };
  shippingAddress: {
    line1: string;
    city: string;
    country: string;
    postalCode: string;
  };
  accountStatus: "ACTIVE" | "ON_HOLD";
  pricingTier?: string;
  notes?: string;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["PHARMACY", "CLINIC", "HOSPITAL", "WHOLESALER"],
      required: true,
    },

    billingAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    shippingAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    accountStatus: {
      type: String,
      enum: ["ACTIVE", "ON_HOLD"],
      default: "ACTIVE",
    },
    pricingTier: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);


export const Vendor =
  mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", vendorSchema);
