"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Heart, Loader2, ArrowRight, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/api/wishlist");
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const { data } = await axios.post("/api/wishlist", { productId: id });
      setWishlist(data.wishlist || []);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-6 animate-fade-in-up">
        <Heart className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">Save your favorite items here to review them later.</p>
        <Link href="/products">
          <Button variant="primary" className="px-8 py-3.5 shadow-lg shadow-indigo-600/10 font-bold rounded-2xl">
            Browse Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500 fill-pink-500/20" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="glassmorphism bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative flex flex-col">
            <button 
              onClick={() => removeFromWishlist(item._id)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all shadow-sm"
            >
              <Trash2 size={16} />
            </button>
            <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden flex items-center justify-center p-6">
              <img src={item.image} alt={item.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{item.category}</span>
                <Link href={`/products/${item._id}`}>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mt-1 hover:text-indigo-500 transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                <p className="text-slate-900 dark:text-white font-extrabold text-lg mt-2">Rs. {item.price.toFixed(2)}</p>
              </div>
              <Button 
                onClick={() => handleAddToCart(item)}
                className="w-full flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
