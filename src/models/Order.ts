import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IOrder extends Document {
  orgId: mongoose.Types.ObjectId; // distributor org
  vendorId: mongoose.Types.ObjectId; // vendor placing order
  code: string; // human-readable order ID (e.g., ORD-2025-000123)

  placedBy: mongoose.Types.ObjectId; // user who placed the order

  status:
    | "PENDING"
    | "VERIFIED"
    | "ASSIGNED"
    | "APPROVED"
    | "REJECTED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"; // FSM

  totals: {
    subtotal: number;
    discount?: number;
    tax?: number;
    shipping?: number;
    grandTotal: number;
    currency: string;
  };
  items: {
    productId: mongoose.Types.ObjectId;
    qty: number;
  }[];

  verification?: {
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    notes?: string;
  };

  assignment?: {
    assigneeId?: mongoose.Types.ObjectId;
    assignedAt?: Date;
  };

  approval?: {
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    notes?: string;
  };
}

// Schema
const orderSchema = new Schema<IOrder>(
  {
    // orgId: { type: Schema.Types.ObjectId, ref: "DistributorOrganization", required: true },
    // vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    code: { type: String, required: true, unique: true },

    placedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    status: {
      type: String,
      enum: [
        "PENDING",
        "VERIFIED",
        "ASSIGNED",
        "APPROVED",
        "REJECTED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    totals: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
      currency: { type: String, required: true },
    },

    items: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          qty: { type: Number, required: true, min: 1 },
        },
      ],
      required: true,
      default: [],
    },

    verification: {
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      verifiedAt: { type: Date },
      notes: { type: String },
    },

    assignment: {
      assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
      assignedAt: { type: Date },
    },

    approval: {
      approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
      approvedAt: { type: Date },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ orgId: 1 });
orderSchema.index({ status: 1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
