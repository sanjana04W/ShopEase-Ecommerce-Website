"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  User as UserIcon,
  Package,
  Settings,
  LogOut,
  Edit2,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
  X,
  Save,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  RotateCcw,
  ChevronRight,
  Star,
  Download,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type Tab = 'profile' | 'orders' | 'settings';

export default function ProfilePage() {
  const { user, loading, logout, setUser } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Sync form fields when user data is available or changes
  useEffect(() => {
    if (user && !isEditing) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (user) {
      // Fetch user's orders from the database
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const { data } = await axios.get("/api/orders");
          setOrders(data.orders || []);
        } catch (error: any) {
          console.error("Failed to load orders", error);
          toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to load orders");
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!editEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(editEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.put("/api/auth/update-profile", {
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      });

      setUser(data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case "Shipped": return <Truck className="w-4 h-4 text-blue-500 animate-bounce" style={{ animationDuration: '3s' }} />;
      case "Delivered": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "Cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Processing": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "Shipped": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "Delivered": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      case "Cancelled": return -1;
      default: return 1;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-2 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order History</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="premium-card rounded-2xl flex flex-col items-center justify-center py-16 text-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-400">Fetching your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="premium-card rounded-2xl flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No orders yet</h3>
                <p className="text-slate-400 text-sm max-w-xs mb-6 leading-relaxed">Looks like you haven't placed any orders yet. Browse our collection to get started.</p>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const step = getStatusStep(order.status);
                  const isCancelled = order.status === "Cancelled";
                  const steps = ["Ordered", "Processing", "Shipped", "Delivered"];
                  return (
                    <div key={order._id} className="premium-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/60 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-200 shadow-sm hover:shadow-md">

                      {/* ── Order Summary Header Bar ── */}
                      <div className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/60 px-5 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Order</span>
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">#{order.orderNumber}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Placed</span>
                              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm leading-tight">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Ship To</span>
                              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm leading-tight">
                                {[order.customerInfo.city, order.customerInfo.province, order.customerInfo.country].filter(Boolean).join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
                            <p className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg leading-tight">Rs. {order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 space-y-6">

                        {/* ── Status Stepper ── */}
                        {!isCancelled ? (
                          <div className="flex items-center gap-0">
                            {steps.map((label, i) => {
                              const active = i < step;
                              const current = i === step - 1;
                              return (
                                <div key={label} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                      active
                                        ? current
                                          ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-600/20"
                                          : "bg-indigo-600 border-indigo-600 text-white"
                                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                                    }`}>
                                      {active ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                                    </div>
                                    <span className={`text-[10px] font-bold whitespace-nowrap ${
                                      active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"
                                    }`}>{label}</span>
                                  </div>
                                  {i < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all ${
                                      i < step - 1 ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                                    }`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">This order was cancelled</p>
                          </div>
                        )}

                        {/* ── Order Items ── */}
                        <div className="space-y-4">
                          {Array.from(order.items.reduce((map: Map<string, any>, item: any) => {
                            const id = item.productId || item._id || item.name;
                            if (map.has(id)) {
                              map.get(id).quantity = Number(map.get(id).quantity) + Number(item.quantity || 1);
                            } else {
                              map.set(id, { ...item, quantity: Number(item.quantity || 1) });
                            }
                            return map;
                          }, new Map()).values()).map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-start">
                              {/* Large Thumbnail */}
                              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>

                              {/* Info + Actions */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{item.name}</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Qty: <span className="font-semibold text-slate-600 dark:text-slate-300">{item.quantity}</span>
                                      &nbsp;&middot;&nbsp;
                                      Rs. {item.price.toFixed(2)} each
                                    </p>
                                  </div>
                                  <div className="text-left sm:text-right flex-shrink-0">
                                    <p className="font-extrabold text-slate-900 dark:text-white text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  <button
                                    onClick={() => {
                                      addToCart({ _id: item.productId || item._id || idx.toString(), name: item.name, price: item.price, image: item.image, description: "", category: "" }, item.quantity);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow-md shadow-indigo-600/20 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Buy it again
                                  </button>
                                  <button
                                    onClick={() => toast.success("Review feature coming soon!")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                                  >
                                    <Star className="w-3 h-3" />
                                    Write a Review
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ── Footer: Shipping + Actions ── */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                          {/* Shipping details */}
                          <div className="flex-1 flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customerInfo.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {order.customerInfo.address}, {order.customerInfo.city} {order.customerInfo.zip}
                              </p>
                              {order.customerInfo.phone && order.customerInfo.phone !== "No phone number saved" && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{order.customerInfo.phone}</p>
                              )}
                            </div>
                          </div>

                          {/* Order actions */}
                          <div className="flex flex-col gap-2 justify-center sm:min-w-[140px]">
                            <button
                              onClick={() => toast.success("Tracking feature coming soon!")}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md shadow-indigo-600/20 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              Track Package
                            </button>
                            <button
                              onClick={() => toast.success("Invoice download coming soon!")}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download Invoice
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="premium-card p-6 md:p-8 rounded-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-gray-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium mb-1">Change Password</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                <button onClick={() => toast.success("This feature will be updated in a future release!")} className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-white transition-colors border border-slate-200 dark:border-gray-800 cursor-pointer">
                  Update Password
                </button>
              </div>
              <div className="p-4 border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-red-650 dark:text-red-400 font-medium mb-1">Delete Account</h3>
                  <p className="text-sm text-slate-550 dark:text-gray-400">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button onClick={() => toast.success("This feature will be updated in a future release!")} className="whitespace-nowrap px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-colors border border-red-300 dark:border-red-500/30 cursor-pointer">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      case 'profile':
      default:
        return (
          <div className="premium-card p-6 md:p-8 rounded-2xl animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-400">
                  {isEditing
                    ? "Edit your details below and click Save to update."
                    : "Update your account name, email address, and phone number."}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex items-center px-4 py-2 border border-slate-300 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center px-5 py-2 bg-indigo-600 rounded-xl text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 border border-slate-350 dark:border-gray-700 hover:border-slate-500 dark:hover:border-gray-500 rounded-xl text-sm font-medium text-slate-800 dark:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div className={`p-4 rounded-xl transition-all duration-200 ${isEditing ? 'bg-slate-100/50 dark:bg-[#0a0a0f] border-2 border-indigo-500/40 ring-1 ring-indigo-500/20' : 'bg-slate-50/50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-gray-800'}`}>
                <div className="flex items-center text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Full Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-transparent text-slate-900 dark:text-white font-medium outline-none border-b border-slate-300 dark:border-gray-700 focus:border-indigo-500 pb-1 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
                    placeholder="Enter your full name"
                    autoFocus
                  />
                ) : (
                  <div className="text-slate-900 dark:text-white font-medium">{user.name}</div>
                )}
              </div>
 
              {/* Email Address */}
              <div className={`p-4 rounded-xl transition-all duration-200 ${isEditing ? 'bg-slate-100/50 dark:bg-[#0a0a0f] border-2 border-indigo-500/40 ring-1 ring-indigo-500/20' : 'bg-slate-50/50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-gray-800'}`}>
                <div className="flex items-center text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-900 dark:text-white font-medium outline-none border-b border-slate-300 dark:border-gray-700 focus:border-indigo-500 pb-1 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="text-slate-900 dark:text-white font-medium">{user.email}</div>
                )}
              </div>
 
              {/* Phone Number */}
              <div className={`p-4 rounded-xl md:col-span-2 transition-all duration-200 ${isEditing ? 'bg-slate-100/50 dark:bg-[#0a0a0f] border-2 border-indigo-500/40 ring-1 ring-indigo-500/20' : 'bg-slate-50/50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-gray-800'}`}>
                <div className="flex items-center text-slate-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-transparent text-slate-900 dark:text-white font-medium outline-none border-b border-slate-300 dark:border-gray-700 focus:border-indigo-500 pb-1 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
                    placeholder="Enter your phone number"
                  />
                ) : user.phone ? (
                  <div className="text-slate-900 dark:text-white font-medium">{user.phone}</div>
                ) : (
                  <div className="text-slate-500 italic">
                    No phone number saved. Add one by editing your profile.
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-500 font-medium text-sm mb-1">
                    Need to update your security settings?
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Head over to the{" "}
                    <button onClick={() => setActiveTab('settings')} className="text-indigo-400 hover:underline bg-transparent border-0 cursor-pointer p-0">
                      Account Settings
                    </button>{" "}
                    tab to change your password or security preferences.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner / Header Card */}
      <div className="premium-card p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start justify-between animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {userInitial}
            </div>
            {user.role === 'admin' && (
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-[#0f0f19]">
                Admin
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.name}
            </h1>
            <p className="text-gray-400 text-sm mb-3">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 text-xs font-medium text-indigo-455 bg-indigo-500/10 border border-indigo-500/20 rounded-full capitalize">
                {user.role} Account
              </span>
              <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 mt-6 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{orders.length}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">Orders</div>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-5 h-5 mr-1" />
              <span className="font-medium text-sm">Safe</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-gray-400">Security</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          <div className="premium-card p-4 rounded-2xl flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors w-full text-left cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'}`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors w-full text-left cursor-pointer ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'}`}
            >
              <Package className="w-5 h-5 mr-3" />
              My Orders
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors w-full text-left cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'}`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Account Settings
            </button>
            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-gray-800">
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl font-medium transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

