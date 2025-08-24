import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Vendor } from "@/models/Vendor";
import { NextResponse } from "next/server";

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