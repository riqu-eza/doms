import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IDistributorOrganization extends Document {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address: {
    line1: string;
    city: string;
    country: string;
    postalCode: string;
  };
  settings: {
    currency: string;
    timezone: string;
    invoicePrefix: string;
    webhookSecret?: string;
    features: {
      chat: boolean;
      invoicing: boolean;
      erpSync: boolean;
    };
  };
}

// Schema
const distributorOrgSchema = new Schema<IDistributorOrganization>(
  {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },

    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    settings: {
      currency: { type: String, required: true },
      timezone: { type: String, required: true },
      invoicePrefix: { type: String, required: true },
      webhookSecret: { type: String },

      features: {
        chat: { type: Boolean, default: false },
        invoicing: { type: Boolean, default: false },
        erpSync: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

// Index
distributorOrgSchema.index({ name: 1 });

// Model export
export const DistributorOrganization =
  mongoose.models.DistributorOrganization ||
  mongoose.model<IDistributorOrganization>(
    "DistributorOrganization",
    distributorOrgSchema
  );
