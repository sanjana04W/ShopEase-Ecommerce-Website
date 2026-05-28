"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Home, Eye, Trash2, X, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, MapPin, User, Mail, Calendar, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export default function OrdersManagementPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error();

      toast.success("Order status updated successfully");
      
      // Update local state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order record? This cannot be undone.")) return;

    try {
      const loadToast = toast.loading("Deleting order record...");
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.dismiss(loadToast);
      if (!res.ok) throw new Error();

      toast.success("Order deleted successfully");
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock size={12} className="text-amber-500 animate-pulse" />;
      case "Shipped": return <Truck size={12} className="text-blue-500" />;
      case "Delivered": return <CheckCircle2 size={12} className="text-emerald-500" />;
      case "Cancelled": return <XCircle size={12} className="text-red-500" />;
      default: return <Clock size={12} className="text-slate-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Processing": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "Shipped": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "Delivered": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default: return "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      {/* Decorative blurs */}
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
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/40 dark:bg-slate-900/30 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-slate-800/50"
          >
            <Home size={15} />
            <span>Dashboard</span>
          </Link>
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
      <main className="max-w-6xl mx-auto px-6 mt-10 animate-fade-in-up">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Customer Orders</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Track and dispatch customer shipments, process invoices, modify statuses, and cancel orders.
          </p>
        </div>

        {loading ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Loading customer order files...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3 animate-scale-in">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
            <p className="text-base text-gray-800 dark:text-gray-200 font-bold">No Orders Placed Yet</p>
            <p className="text-sm text-gray-400 max-w-sm">
              As soon as users checkout on the main store, their invoices and details will instantly populate here.
            </p>
          </div>
        ) : (
          <div className="glassmorphism rounded-2xl border border-glass-border/20 overflow-hidden shadow-xl animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 dark:bg-slate-900/40 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-glass-border/20">
                  <tr>
                    <th className="px-6 py-4">Order Number</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date Placed</th>
                    <th className="px-6 py-4">Items Count</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/40">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-colors duration-200">
                      <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{order.customerInfo.name}</div>
                        <div className="text-xs text-gray-450 dark:text-gray-500">{order.customerInfo.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-bold">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                      </td>
                      <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-black">
                        Rs. {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updatingStatusId === order._id}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-xl cursor-pointer outline-none ${getStatusClass(order.status)}`}
                        >
                          <option value="Processing" className="bg-white dark:bg-slate-900 text-amber-500">Processing</option>
                          <option value="Shipped" className="bg-white dark:bg-slate-900 text-blue-500">Shipped</option>
                          <option value="Delivered" className="bg-white dark:bg-slate-900 text-emerald-500">Delivered</option>
                          <option value="Cancelled" className="bg-white dark:bg-slate-900 text-red-500">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View Invoice Details"
                            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            title="Delete Record"
                            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Invoice details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="glassmorphism rounded-2xl shadow-2xl border border-glass-border/40 w-full max-w-2xl p-6 md:p-8 animate-scale-in relative overflow-hidden">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-full transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800/40 pb-4 mb-6">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Invoice: #{selectedOrder.orderNumber}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${getStatusClass(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 dark:text-slate-300">
              {/* Left Column: Customer details */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-slate-100 dark:border-slate-800/40 pb-1.5">Customer details</h4>
                
                <div className="flex items-start gap-2.5">
                  <User size={15} className="text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">FullName</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{selectedOrder.customerInfo.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={15} className="text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</span>
                    <a href={`mailto:${selectedOrder.customerInfo.email}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{selectedOrder.customerInfo.email}</a>
                  </div>
                </div>

                {selectedOrder.customerInfo.phone && (
                  <div className="flex items-start gap-2.5">
                    <Truck size={15} className="text-slate-450 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</span>
                      <span className="font-semibold text-gray-850 dark:text-white">{selectedOrder.customerInfo.phone}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <Calendar size={15} className="text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Date</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {new Date(selectedOrder.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Shipping address */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white border-b border-slate-100 dark:border-slate-800/40 pb-1.5">Shipping Address</h4>
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-slate-450 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.customerInfo.address}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.zip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle part: Items table */}
            <div className="mt-6">
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mb-3">Order items</h4>
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-gray-400 uppercase text-[9px] font-bold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Array.from(selectedOrder.items.reduce((map: Map<string, any>, item: any) => {
                      const id = item.productId || item._id || item.name;
                      if (map.has(id)) {
                        map.get(id).quantity = Number(map.get(id).quantity) + Number(item.quantity || 1);
                      } else {
                        map.set(id, { ...item, quantity: Number(item.quantity || 1) });
                      }
                      return map;
                    }, new Map()).values()).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-white flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-6 h-6 object-contain rounded" />
                          <span className="truncate max-w-[150px]">{item.name}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium">Rs. {item.price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-gray-700 dark:text-slate-300 font-bold">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-gray-900 dark:text-indigo-400">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Invoice pricing */}
            <div className="mt-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between text-gray-450 dark:text-gray-400 font-medium">
                <span>Items Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount:</span>
                  <span>-Rs. {selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-450 dark:text-gray-400 font-medium">
                <span>Shipping cost:</span>
                <span>Rs. {selectedOrder.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-450 dark:text-gray-400 font-medium">
                <span>Sales Tax (8%):</span>
                <span>Rs. {selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 dark:text-white text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Grand Total:</span>
                <span className="text-indigo-600 dark:text-indigo-400">Rs. {selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 border-t border-gray-200 dark:border-slate-800 pt-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  disabled={updatingStatusId === selectedOrder._id}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer outline-none ${getStatusClass(selectedOrder.status)}`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Order</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-slate-700/80 active:scale-95 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
