import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/models/Order";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { status } = await req.json();
console.log("Updating order status to:", status);
    // ✅ await params
    const { id } = await context.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating order status:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
