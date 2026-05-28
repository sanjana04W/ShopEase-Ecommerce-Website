"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, LogOut, Home, Plus, Edit2, Trash2, X, Star, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

const CATEGORIES = ["Electronics", "Footwear", "Accessories", "Bags"];

export default function ProductsManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setCategory("Electronics");
    setImage("/images/wireless_headphones.jpg"); // Premium prefilled default image path
    setDescription("");
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    setCategory(prod.category);
    setImage(prod.image);
    setDescription(prod.description);
    setFeatured(prod.featured);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim() || !image.trim() || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const url = "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const payload = {
        id: editingProduct?._id,
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image: image.trim(),
        category,
        featured,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
      handleCloseModal();
      fetchProducts();
    } catch {
      toast.error("Operation failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product from the inventory?")) return;

    try {
      const loadToast = toast.loading("Deleting product...");
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.dismiss(loadToast);
      if (!res.ok) throw new Error();

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-12">
      {/* Decorative blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Products Inventory</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Add new catalog listings, update pricing, descriptions, and manage categories.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition shadow-md hover:shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Listing</span>
          </button>
        </div>

        {loading ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Loading product records...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="glassmorphism rounded-2xl p-12 text-center border border-glass-border/20 flex flex-col items-center justify-center gap-3 animate-scale-in">
            <Sparkles className="w-10 h-10 text-gray-400" />
            <p className="text-base text-gray-805 dark:text-gray-200 font-bold">No Products in Database</p>
            <p className="text-sm text-gray-400 max-w-sm">
              Your inventory is currently empty! Click Add New Listing to insert products into MongoDB.
            </p>
          </div>
        ) : (
          <div className="glassmorphism rounded-2xl border border-glass-border/20 overflow-hidden shadow-xl animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100/50 dark:bg-slate-900/40 text-gray-500 dark:text-gray-405 uppercase text-xs font-bold border-b border-glass-border/20">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/40">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200/50 dark:border-slate-800 flex items-center justify-center p-1.5">
                          <img src={prod.image} alt={prod.name} className="max-h-full object-contain" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-905 dark:text-white">
                        <div className="max-w-[200px] truncate" title={prod.name}>
                          {prod.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold text-xs">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-indigo-400 font-extrabold text-sm">
                        Rs. {prod.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {prod.featured ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Star size={12} className="fill-amber-500" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            title="Edit Listing"
                            className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            title="Delete Listing"
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

      {/* CRUD Add/Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="glassmorphism rounded-2xl shadow-2xl border border-glass-border/40 w-full max-w-lg p-6 md:p-8 animate-scale-in relative overflow-hidden">
            
            <button
              onClick={handleCloseModal}
              disabled={submitting}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-full transition cursor-pointer disabled:opacity-50"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800/40 pb-4 mb-6">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {editingProduct ? "Edit Catalog Item" : "Create Catalog Item"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Wireless Headset"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="4999.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Image URL</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="/images/wireless_headphones.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <ImageIcon className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Premium detail description of the product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                  Feature this product on homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-slate-700/80 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Listing</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
