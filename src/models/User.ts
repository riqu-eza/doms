import mongoose, { Document, Schema } from "mongoose";

// 1.2 Interface
export interface IUser extends Document {
  orgId?: mongoose.Types.ObjectId | null; // distributor organization
  vendorId?: mongoose.Types.ObjectId | null; // vendor organization
  role:
    | "DISTRIBUTOR_ADMIN"
    | "DISTRIBUTOR_MANAGER"
    | "DISTRIBUTOR_AGENT"
    | "VENDOR_ADMIN"
    | "VENDOR_USER";
  email: string;
  phone?: string;
  name: string;
  status: "ACTIVE" | "SUSPENDED";
  passwordHash?: string; // if using credentials
  oauthProvider?: string; // if using external OAuth
  oauthId?: string;
  lastLoginAt?: Date;
}

// 1.2 Schema
const userSchema = new Schema<IUser>(
  {
    orgId: { type: Schema.Types.ObjectId, ref: "DistributorOrganizations", default: null },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendors", default: null },
    role: {
      type: String,
      enum: [
        "DISTRIBUTOR_ADMIN",
        "DISTRIBUTOR_MANAGER",
        "DISTRIBUTOR_AGENT",
        "VENDOR_ADMIN",
        "VENDOR_USER",
      ],
      required: true,
      default: "VENDOR_ADMIN",
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    name: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "SUSPENDED"], default: "ACTIVE" },
    passwordHash: { type: String },
    oauthProvider: { type: String },
    oauthId: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ orgId: 1 });
// userSchema.index({ vendorId: 1 });
// userSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
