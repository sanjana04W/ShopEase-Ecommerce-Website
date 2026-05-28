import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SAMPLE_PRODUCTS = [
  { name: "Wireless Headphones", price: 11850.00, description: "Premium sound quality with noise cancellation, memory foam ear cups, and 40-hour wireless battery life.", image: "/images/wireless_headphones.jpg", category: "Electronics", featured: true },
  { name: "Running Shoes", price: 4690.00, description: "Lightweight and comfortable for daily runs, featuring a breathable mesh fabric and responsive energy return.", image: "/images/running_shoes.jpg", category: "Footwear", featured: true },
  { name: "Leather Wallet", price: 3600.00, description: "Slim minimalist genuine leather wallet with RFID blocking, built-in card ejector, and premium stitching.", image: "/images/leather_wallet.jpg", category: "Accessories", featured: false },
  { name: "Smart Watch", price: 10620.00, description: "Track fitness, calls, and notifications with a gorgeous AMOLED display, dynamic sleep tracker, and 10-day battery life.", image: "/images/smart_watch.jpg", category: "Electronics", featured: true },
  { name: "Backpack", price: 2700.00, description: "Water-resistant 30L travel backpack with padded laptop sleeve, secret passport pockets, and ergonomic shoulder straps.", image: "/images/backpack.jpg", category: "Bags", featured: false },
  { name: "Sunglasses", price: 4290.00, description: "UV400 protection polarized lenses with lightweight steel golden accents and anti-scratch coating.", image: "/images/sunglasses.jpg", category: "Accessories", featured: false },
  { name: "Bluetooth Speaker", price: 7490.00, description: "360° surround sound portable speaker with deep bass, IPX7 waterproof rating, and 24-hour playtime on a single charge.", image: "/images/bluetooth_speaker.jpg", category: "Electronics", featured: true },
  { name: "Trail Hiking Boots", price: 6250.00, description: "Rugged all-terrain hiking boots with Vibram outsole, Gore-Tex waterproof membrane, and ankle support cushioning.", image: "/images/trail_hiking_boots.jpg", category: "Footwear", featured: false },
  { name: "Aviator Sunglasses", price: 5390.00, description: "Classic aviator frame with gradient polarized lenses, titanium bridge, and spring-loaded temple arms for all-day comfort.", image: "/images/aviator_sunglasses.jpg", category: "Accessories", featured: true },
  { name: "Laptop Messenger Bag", price: 3950.00, description: "Professional canvas messenger bag with padded 15.6-inch laptop compartment, magnetic buckle closure, and adjustable strap.", image: "/images/laptop_messenger_bag.jpg", category: "Bags", featured: false },
  { name: "Fitness Tracker Band", price: 3290.00, description: "Sleek fitness band with heart rate monitor, SpO2 sensor, sleep analysis, and 14-day battery life with AMOLED display.", image: "/images/fitness_tracker_band.jpg", category: "Electronics", featured: false },
  { name: "Canvas Sneakers", price: 2890.00, description: "Casual low-top canvas sneakers with vulcanized rubber sole, reinforced toe cap, and breathable cotton lining.", image: "/images/canvas_sneakers.jpg", category: "Footwear", featured: false },
  { name: "Travel Duffel Bag", price: 4500.00, description: "Spacious 45L weekender duffel with shoe compartment, water-resistant nylon, and detachable shoulder strap.", image: "/images/travel_duffel_bag.jpg", category: "Bags", featured: true },
  { name: "Card Holder", price: 1850.00, description: "Ultra-slim carbon fiber card holder with pull-tab mechanism, holds up to 8 cards with RFID protection.", image: "/images/card_holder.jpg", category: "Accessories", featured: false },
  { name: "Noise Cancelling Earbuds", price: 8990.00, description: "True wireless earbuds with adaptive ANC, spatial audio, wireless charging case, and 30-hour total battery life.", image: "/images/noise_cancelling_earbuds.jpg", category: "Electronics", featured: true },
  { name: "Formal Oxford Shoes", price: 7890.00, description: "Handcrafted genuine leather oxford shoes with blake-stitched sole, polished finish, and cushioned insole.", image: "/images/formal_oxford_shoes.jpg", category: "Footwear", featured: false },
  { name: "Crossbody Sling Bag", price: 2350.00, description: "Compact anti-theft crossbody sling with hidden zipper pockets, USB charging port, and water-repellent fabric.", image: "/images/crossbody_sling_bag.jpg", category: "Bags", featured: false },
  { name: "Mechanical Keyboard", price: 9450.00, description: "Premium wireless mechanical keyboard with hot-swappable switches, RGB backlighting, and CNC aluminum frame.", image: "/images/mechanical_keyboard.jpg", category: "Electronics", featured: false },
  { name: "Polarized Sport Glasses", price: 3750.00, description: "Wraparound sport sunglasses with impact-resistant polycarbonate lenses, rubber nose pads, and anti-slip temple grips.", image: "/images/polarized_sport_glasses.jpg", category: "Accessories", featured: false },
  { name: "Gym Training Shoes", price: 5490.00, description: "Cross-training shoes with flat stable sole, breathable knit upper, reinforced heel counter, and flexible forefoot.", image: "/images/gym_training_shoes.jpg", category: "Footwear", featured: true },
  { name: "Ergonomic Gaming Mouse", price: 4200.00, description: "High-precision 16000 DPI sensor, customizable RGB lighting, and 7 programmable buttons.", image: "/images/ergonomic_gaming_mouse.jpg", category: "Electronics", featured: false },
  { name: "27-inch 4K Monitor", price: 24500.00, description: "Ultra HD IPS display with 144Hz refresh rate, HDR400, and ultra-thin bezels for immersive gaming.", image: "/images/27_inch_4k_monitor.jpg", category: "Electronics", featured: true },
  { name: "Classic Leather Belt", price: 1500.00, description: "Genuine full-grain leather belt with a timeless brass buckle design.", image: "/images/classic_leather_belt.jpg", category: "Accessories", featured: false },
  { name: "Vintage Camera Backpack", price: 5600.00, description: "Durable canvas and leather accents with customizable padded dividers for DSLR cameras and lenses.", image: "/images/vintage_camera_backpack.jpg", category: "Bags", featured: true },
  { name: "Minimalist Silver Ring", price: 1200.00, description: "Elegant sterling silver band with a polished finish, perfect for everyday wear.", image: "/images/minimalist_silver_ring.jpg", category: "Accessories", featured: false },
];

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check if products exist; if not, seed the database
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
    } else if (count < SAMPLE_PRODUCTS.length) {
      // Add newly added products to DB
      const newProducts = SAMPLE_PRODUCTS.slice(count);
      await Product.insertMany(newProducts);
    }

    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const featured = searchParams.get("featured");

    // Build query filter
    const filter: any = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      filter.featured = true;
    }

    // Build sorting options
    let sortOption: any = { createdAt: -1 }; // Default: Newest first
    if (sortBy === "price-asc") {
      sortOption = { price: 1 };
    } else if (sortBy === "price-desc") {
      sortOption = { price: -1 };
    } else if (sortBy === "name-asc") {
      sortOption = { name: 1 };
    }

    const products = await Product.find(filter).sort(sortOption);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
