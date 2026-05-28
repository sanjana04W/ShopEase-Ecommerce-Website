import { Sparkles, Compass, ShieldCheck, Heart, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 space-y-24 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Our Journey
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">ShopEase</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          We're on a mission to simplify digital commerce by providing Curated masterpieces at exceptional prices with premium customer support.
        </p>
      </div>

      {/* Story Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Story</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Founded in 2024, ShopEase started with a simple belief — premium lifestyle products and modern utilities should be accessible to everyone at transparent pricing.
          </p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Today, we serve thousands of satisfied customers globally. We partner with expert developers, craft studios, and secure logistics firms to ensure your order arrives in perfect shape, every single time.
          </p>
          <div className="pt-4">
            <Link href="/products">
              <Button className="font-bold rounded-2xl shadow-md shadow-indigo-600/10">
                Explore Collection
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 rounded-3xl blur-2xl -z-10" />
          <div className="premium-card p-10 rounded-3xl border border-slate-100/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 text-center space-y-6 flex flex-col items-center shadow-lg hover:rotate-1 hover:scale-[1.01] transition-all">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-4xl">
              🛍️
            </div>
            <p className="text-indigo-700 dark:text-indigo-400 font-extrabold text-xl leading-relaxed italic">
              "Shopping made simple, beautiful, and extremely secure."
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Our Brand Promise</p>
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: "10K+", label: "Happy Shoppers", icon: <Compass className="w-5 h-5" /> },
          { value: "500+", label: "Premium Items", icon: <Sparkles className="w-5 h-5" /> },
          { value: "50+", label: "Verified Brands", icon: <Award className="w-5 h-5" /> },
          { value: "4.9★", label: "Average Review", icon: <Heart className="w-5 h-5" /> },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="premium-card p-6 rounded-3xl border border-slate-100/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 shadow-sm flex flex-col justify-between h-40 group hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-0.5">
                {stat.value}
              </div>
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Pillars</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">We build experiences grounded in three core principles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "💡", title: "Constant Innovation", desc: "We continually upgrade our shop interfaces, checkout pipelines, and catalog details to make shopping hassle-free." },
            { icon: "🤝", title: "Complete Transparency", desc: "No hidden charges, no surprise delays. We offer flat clear shipping timelines and transparent return policies." },
            { icon: "🌍", title: "Sustainable Logistics", desc: "We actively source eco-friendly packaging and partner with local logistics centers to reduce transit emissions." },
          ].map((val, idx) => (
            <div
              key={idx}
              className="premium-card p-8 rounded-3xl border border-slate-100/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/40 space-y-6 flex flex-col justify-between h-64 hover:shadow-md"
            >
              <div className="text-4xl w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center">
                {val.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">{val.title}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}