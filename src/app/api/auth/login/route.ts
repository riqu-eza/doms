import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check status
    if (user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash || "");
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // 5. Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        orgId: user.orgId,
        vendorId: user.vendorId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ user, token });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
