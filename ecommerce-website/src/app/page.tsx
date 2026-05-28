"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Star, CheckCircle, Percent, ArrowUpRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

const FEATURED_PRODUCTS: Product[] = [
  { _id: "1", name: "Wireless Headphones", price: 11850.00, description: "Premium sound quality with noise cancellation.", image: "/images/wireless_headphones.jpg", category: "Electronics" },
  { _id: "2", name: "Running Shoes", price: 4690.00, description: "Lightweight and comfortable for daily runs.", image: "/images/running_shoes.jpg", category: "Footwear" },
  { _id: "4", name: "Smart Watch", price: 10620.00, description: "Track fitness, calls, and notifications.", image: "/images/smart_watch.jpg", category: "Electronics" },
];

const CATEGORIES = [
  { name: "Electronics", icon: "⚡", count: "120+ Products", bg: "from-blue-500/10 to-indigo-500/10", border: "hover:border-blue-500/20" },
  { name: "Footwear", icon: "👟", count: "80+ Products", bg: "from-emerald-500/10 to-teal-500/10", border: "hover:border-emerald-500/20" },
  { name: "Accessories", icon: "🕶️", count: "150+ Products", bg: "from-amber-500/10 to-orange-500/10", border: "hover:border-amber-500/20" },
  { name: "Bags", icon: "🎒", count: "60+ Products", bg: "from-rose-500/10 to-pink-500/10", border: "hover:border-rose-500/20" },
];

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 px-4 bg-gradient-to-br from-indigo-900/5 via-violet-500/5 to-transparent">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-400/15 rounded-full filter blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/15 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-150/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider animate-scale-in">
              <Sparkles className="w-3.5 h-3.5" /> Curated Premium Collection
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              Shop Smarter,<br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Discover thousands of quality, award-winning products delivered fast and free directly to your door.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button className="px-8 py-3.5 text-base w-full sm:w-auto shadow-lg shadow-indigo-600/20">
                  Shop Curated Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="px-8 py-3.5 text-base w-full sm:w-auto">
                  Our Values
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">10k+</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Happy Shoppers</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">500+</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Premium Items</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">4.9★</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Top Rating</p>
              </div>
            </div>
          </div>

          {/* Interactive Hero Asset (Interactive floating elements and cards) */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-500/5 animate-fade-in">
              
              {/* Central Premium Graphic */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex flex-col items-center justify-center text-white shadow-2xl p-6 text-center z-10 glowing-primary hover:rotate-1 hover:scale-105 transition-all duration-300">
                <Sparkles className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="font-extrabold text-2xl mt-4 leading-tight">SUMMER SALE</h3>
                <p className="text-xs text-indigo-200 mt-1.5 uppercase font-semibold tracking-widest">Active Discount Code</p>
                <div className="mt-3.5 bg-amber-400 text-slate-950 font-black text-sm px-4 py-1.5 rounded-full border-2 border-white shadow-md">
                  SAVE10
                </div>
              </div>

              {/* Floating widget 1 */}
              <div className="absolute top-8 left-8 glassmorphism p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-bounce z-20" style={{ animationDuration: '4s' }}>
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-500">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flash Discount</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">Up to 40% Off</p>
                </div>
              </div>

              {/* Floating widget 2 */}
              <div className="absolute bottom-8 right-8 glassmorphism p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-bounce z-20" style={{ animationDuration: '5s' }}>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secured Delivery</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">100% Tracking</p>
                </div>
              </div>

              {/* Glowing circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Choose from our beautifully sorted sections designed to elevate your routine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className={`premium-card p-8 rounded-3xl bg-gradient-to-br ${cat.bg} border-2 border-slate-100/50 dark:border-slate-800/50 ${cat.border} flex flex-col justify-between h-48 group hover:shadow-xl`}
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300 w-14 h-14 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm flex items-center justify-center">
                {cat.icon}
              </div>
              <div className="flex items-end justify-between mt-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">{cat.count}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-650 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlighted Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Masterpieces
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Hand-picked designs that combine premium utility and elegance.
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="group">
              View Entire Collection
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onAddToCart={() => addToCart(prod, 1)}
            />
          ))}
        </div>
      </section>

      {/* Premium Trust & Values */}
      <section className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative border-y border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight">Why ShopEase Stands Out</h2>
            <p className="text-slate-400 max-w-md mx-auto">Our principles ensure you enjoy the smoothest possible shopping checkout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <CheckCircle className="w-10 h-10 text-indigo-400" />, title: "Curated Excellence", desc: "Every single listing goes through multiple quality audits to ensure complete satisfaction." },
              { icon: <Star className="w-10 h-10 text-amber-400" />, title: "Award-winning Care", desc: "Our global customer support responds within minutes, 24/7/365, to resolve any concerns." },
              { icon: <Sparkles className="w-10 h-10 text-purple-400" />, title: "Express Logistics", desc: "Packed in eco-friendly packaging and shipped securely with real-time GPS tracking status." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/60 hover:scale-105 transition-all text-center space-y-4 max-w-sm mx-auto">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-16">
          What Our Shoppers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { quote: "ShopEase completely upgraded my setup. The headphones sound unbelievable, and their delivery arrived 2 days ahead of schedule!", author: "Samantha K.", role: "Creative Director", avatar: "👩‍💻" },
            { quote: "The customer service is outstanding. I wanted to alter the shipping address on my wallet order, and they resolved it in less than 5 minutes.", author: "Marcus V.", role: "Tech Lead", avatar: "👨‍💻" }
          ].map((test, idx) => (
            <div key={idx} className="premium-card p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-100/50 dark:border-slate-800/50 text-left flex flex-col justify-between h-56 shadow-sm">
              <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/30 flex items-center justify-center text-xl">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 text-sm">{test.author}</h4>
                  <p className="text-xs text-slate-400">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-8 lg:px-16 text-center space-y-8 shadow-2xl border border-slate-700/40">
          {/* Decorative warm accent glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="relative text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-violet-400 to-amber-400 bg-clip-text text-transparent">
         Ready to Start Your Journey?</h2>
          <p className="relative max-w-lg mx-auto text-base text-slate-300 leading-relaxed">
            Browse our curated high-performance gears and experience premium e-commerce services today.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button variant="outline" className="px-8 py-3.5 rounded-xl font-bold transition !border-white/70 !text-white hover:!bg-white hover:!text-slate-900">
                Explore All Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="px-8 py-3.5 rounded-xl font-bold transition !border-indigo-400/70 !text-indigo-300 hover:!bg-indigo-500 hover:!text-white">
                Speak With Care
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}