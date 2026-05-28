import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerInfo, items, subtotal, discount, shippingCost, tax, total } = body;

    if (!customerInfo || !items || items.length === 0 || subtotal === undefined || total === undefined) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    await connectDB();

    // Check if the user is authenticated (to link the order)
    let userId: string | undefined = undefined;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback_secret"
        ) as { id?: string; userId?: string };
        userId = decoded.id || decoded.userId;
      } catch (err) {
        // Token is invalid/expired, but we still allow guest checkouts
        console.warn("Invalid token for order, creating guest order instead");
      }
    }

    // Generate a unique order number
    let orderNumber = "";
    let isUnique = false;
    while (!isUnique) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      orderNumber = `SE-${rand}`;
      const existing = await Order.findOne({ orderNumber });
      if (!existing) {
        isUnique = true;
      }
    }

    const order = await Order.create({
      orderNumber,
      userId,
      customerInfo,
      items,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      status: "Processing",
    });

    return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    await connectDB();

    const userId = decoded.id || decoded.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
