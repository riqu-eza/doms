// app/api/vendor/route.ts
import { NextResponse } from "next/server";
import { Vendor } from "@/models/Vendor";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

// GET profile by userId
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const vendor = await Vendor.findOne({ userId });
    return NextResponse.json(vendor || null);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// CREATE or UPDATE vendor profile
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, name, type, billingAddress, shippingAddress } = await req.json();

    // 1. Ensure user exists and is VENDOR_ADMIN
    const user = await User.findById(userId);
    if (!user || user.role !== "VENDOR_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 2. Create vendor
    const vendor = await Vendor.create({
      userId,
      name,
      type,
      billingAddress,
      shippingAddress,
      accountStatus: "ACTIVE",
    });

    // 3. Update user with vendorId
    user.vendorId = vendor._id;
    await user.save();

    return NextResponse.json({ vendor });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
