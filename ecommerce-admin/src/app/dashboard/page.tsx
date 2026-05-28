"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, MessageSquare, ArrowRight, ShieldCheck, Clock, Package, ShoppingBag, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Stats {
  contactsCount: number;
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemTime, setSystemTime] = useState<string>("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Elegant current time simulation
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const loadToast = toast.loading("Logging out...");
      await fetch("/api/auth/logout", { method: "POST" });
      toast.dismiss(loadToast);
      toast.success("Successfully logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      {/* Decorative gradient background blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="glassmorphism sticky top-0 z-50 border-b border-glass-border/30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 group">
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-350">
              ShopEase
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/15"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Panel */}
      <main className="max-w-5xl mx-auto px-6 mt-10 animate-fade-in-up">
        {/* Welcome Section */}
        <div className="glassmorphism rounded-2xl border border-glass-border/20 p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Welcome back, Administrator. Manage submissions, database settings, and portal configurations.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 bg-white/40 dark:bg-slate-900/30 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Status: Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/40 dark:bg-slate-900/30 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-slate-800/50">
              <Clock size={16} className="text-indigo-500" />
              <span>{systemTime || "..."}</span>
            </div>
          </div>
        </div>

        {loading || !stats ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Compiling real-time dashboard analytics...
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats Metrics Grid */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
                Live Store Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Revenue card */}
                <div className="premium-card rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between min-h-[140px] border border-indigo-500/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Total Sales
                      </p>
                      <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                        Rs. {stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-450 dark:text-gray-500 font-medium">
                    Excludes cancelled orders
                  </div>
                </div>

                {/* Orders count card */}
                <div className="premium-card rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Customer Orders
                      </p>
                      <p className="text-2xl font-extrabold text-gray-855 dark:text-white tracking-tight">
                        {stats.ordersCount}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-550">
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-450 dark:text-gray-500 font-medium">
                    Placed invoices
                  </div>
                </div>

                {/* Products count card */}
                <div className="premium-card rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Catalog Listings
                      </p>
                      <p className="text-2xl font-extrabold text-gray-855 dark:text-white tracking-tight">
                        {stats.productsCount}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Package size={18} />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-450 dark:text-gray-500 font-medium">
                    Active store items
                  </div>
                </div>

                {/* Messages count card */}
                <div className="premium-card rounded-2xl p-5 relative overflow-hidden group flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Support Inquiries
                      </p>
                      <p className="text-2xl font-extrabold text-gray-855 dark:text-white tracking-tight">
                        {stats.contactsCount}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-450 dark:text-gray-500 font-medium">
                    Customer feedback
                  </div>
                </div>

              </div>
            </div>

            {/* Management Controls Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
                Management Control Center
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Products Control Card */}
                <Link
                  href="/dashboard/products"
                  className="premium-card rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 group flex flex-col justify-between min-h-[200px] transition-all cursor-pointer"
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
                      <Package size={22} />
                    </div>
                    <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Product Inventory
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                      Add, update, and manage catalog descriptions, prices, categories, and photos.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-6 group-hover:gap-2.5 transition-all">
                    <span>Manage Products</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Orders Control Card */}
                <Link
                  href="/dashboard/orders"
                  className="premium-card rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 group flex flex-col justify-between min-h-[200px] transition-all cursor-pointer"
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-4">
                      <ShoppingBag size={22} />
                    </div>
                    <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Customer Orders
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                      Track billing details, ship status, modify dispatch info, and cancel order records.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-6 group-hover:gap-2.5 transition-all">
                    <span>Manage Orders</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Contacts Control Card */}
                <Link
                  href="/contacts"
                  className="premium-card rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 group flex flex-col justify-between min-h-[200px] transition-all cursor-pointer"
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                      <MessageSquare size={22} />
                    </div>
                    <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Contact Messages
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                      Review, filter, read, and delete submissions received through the website contact form.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-6 group-hover:gap-2.5 transition-all">
                    <span>Manage Messages</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

                {/* Theme Settings Control Card */}
                <Link
                  href="/dashboard/theme"
                  className="premium-card rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 group flex flex-col justify-between min-h-[200px] transition-all cursor-pointer"
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 mb-4">
                      <Sparkles size={22} />
                    </div>
                    <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Theme Settings
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                      Customize light and dark mode colors dynamically for the frontend website.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-6 group-hover:gap-2.5 transition-all">
                    <span>Manage Theme</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}