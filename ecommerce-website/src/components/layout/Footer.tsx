"use client";

import Link from "next/link";
import { Sparkles, Globe, Share2, Heart, ShieldCheck, Truck, RefreshCw } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-900">
      
      {/* Mini features banner */}
      <div className="border-b border-slate-900 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express Free Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">On all premium orders over $50</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Checkout</h4>
              <p className="text-xs text-slate-500 mt-0.5">Encrypted multi-layer payments</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">30-day satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white group">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                ShopEase
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your one-stop destination for quality lifestyle products, state-of-the-art tech accessories, and curated trends.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Globe size={18} />, href: "#" },
                { icon: <Share2 size={18} />, href: "#" },
                { icon: <Heart size={18} />, href: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-550/5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Explore</h4>
            <ul className="space-y-3.5 text-sm">
              {["Home", "Products", "About", "Contact"].map((label, i) => (
                <li key={label}>
                  <Link
                    href={["/", "/products", "/about", "/contact"][i]}
                    className="text-slate-400 hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Contact Us</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex flex-col">
                <span className="text-xs text-slate-650">Customer Support</span>
                <span className="text-white">support@shopease.com</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-slate-650">Toll Free Hotline</span>
                <span className="text-white">011 744 4444</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-slate-650">Global Headquarters</span>
                <span className="text-slate-400">High Level Road, Kandy</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe to unlock early sale access, custom drops, and 10% off your first purchase.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="relative">
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} ShopEase Global Ltd. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}