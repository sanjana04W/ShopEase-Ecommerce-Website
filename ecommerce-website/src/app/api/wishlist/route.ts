import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Product } from "@/models/Product"; // Assume Product model exists here
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      ) as { id?: string; userId?: string };
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      ) as { id?: string; userId?: string };
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    await connectDB();
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert ObjectIds to strings to check
    const wishlistIds = user.wishlist?.map(id => id.toString()) || [];
    
    if (wishlistIds.includes(productId)) {
      // Remove it
      user.wishlist = user.wishlist?.filter(id => id.toString() !== productId);
    } else {
      // Add it
      if (!user.wishlist) user.wishlist = [];
      user.wishlist.push(productId as any);
    }

    await user.save();
    await user.populate("wishlist");

    return NextResponse.json({ wishlist: user.wishlist, message: "Wishlist updated" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
