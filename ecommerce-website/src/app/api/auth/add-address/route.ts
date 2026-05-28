import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { id: string };

    await connectDB();

    const addressData = await req.json();

    const { label, fullName, street, city, state, zipCode, phone } = addressData;

    if (!label || !fullName || !street || !city || !state || !zipCode || !phone) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newAddress = {
      id: Date.now().toString(),
      label,
      fullName,
      street,
      city,
      state,
      zipCode,
      phone,
      isDefault: false
    };

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address added successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
