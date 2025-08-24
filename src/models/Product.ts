import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IProduct extends Document {
  orgId: mongoose.Types.ObjectId;
  sku: string; // unique per org
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  available: boolean;
  unit: "BOX" | "BOTTLE" | "PACK" | "PIECE"; // can extend as needed
  packSize: number;

  regulatory: {
    gtin?: string;
    drugCode?: string;
    controlled: boolean;
  };

  pricing: {
    basePrice: number;
    tierPrices: { tier: string; price: number }[];
  };

  trackByBatch: boolean;
  trackExpiry: boolean;
}

// Schema
const productSchema = new Schema<IProduct>(
  {
    // orgId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "DistributorOrganization",
    //   required: true,
    // },

    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },

    category: { type: String, required: true },
    subCategory: { type: String },
    available: { type: Boolean, default: true },

    unit: {
      type: String,
      enum: ["BOX", "BOTTLE", "PACK", "PIECE"],
      required: true,
    },
    packSize: { type: Number, required: true },

    regulatory: {
      gtin: { type: String },
      drugCode: { type: String },
      controlled: { type: Boolean, default: false },
    },

    pricing: {
      basePrice: { type: Number, required: true },
      tierPrices: [
        {
          tier: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },

    trackByBatch: { type: Boolean, default: false },
    trackExpiry: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ orgId: 1, sku: 1 }, { unique: true });
productSchema.index({ name: "text" });

// Model export
export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
