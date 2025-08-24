// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Vendor } from "@/models/Vendor";

// CREATE new order

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { placedBy, vendorId, items, totals } = await req.json();
     console.log("Order POST body:", { placedBy, vendorId, items, totals });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.findById(placedBy);

    if (!placedBy || !vendorId) {
      return NextResponse.json(
        { error: "Vendor user required" },
        { status: 403 }
      );
    }

    // 2. Get vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const count = await Order.countDocuments();
    const code = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(
      6,
      "0"
    )}`;

    // 3. Create order
    const order = await Order.create({
      code,
      placedBy: placedBy,
      vendorId: vendorId,
      status: "PENDING",
      totals,
      items: Array.isArray(items) ? items : [], 
    });

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// GET all orders for a vendor
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    let filter = {};
    if (vendorId) {
      filter = { vendorId };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

