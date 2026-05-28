import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const contactsCount = await Contact.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    // Calculate total revenue from non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return NextResponse.json({
      contactsCount,
      productsCount,
      ordersCount,
      totalRevenue
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to compile dashboard metrics" },
      { status: 550 }
    );
  }
}
