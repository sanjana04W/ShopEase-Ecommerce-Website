"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Search, X, Star, Plus, Minus, ShoppingCart, ArrowUpDown, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

const CATEGORIES = ["All", "Electronics", "Footwear", "Accessories", "Bags"];
const SORT_OPTIONS = [
  { value: "default", label: "Default Sorting" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Read initial category from query parameter on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat && CATEGORIES.includes(cat)) {
        setSelected(cat);
      }
    }
    
    // Fetch wishlist
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("/api/wishlist");
        setWishlistIds(data.wishlist.map((w: any) => typeof w === 'string' ? w : w._id));
      } catch (error) {
        // user might not be logged in, ignore
      }
    };
    fetchWishlist();
  }, []);

  // Fetch products from database when filter criteria changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selected !== "All") queryParams.append("category", selected);
        if (search.trim()) queryParams.append("search", search.trim());
        if (sortBy !== "default") queryParams.append("sortBy", sortBy);

        const { data } = await axios.get(`/api/products?${queryParams.toString()}`);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid excessive API requests
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(handler);
  }, [selected, search, sortBy]);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleModalAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, modalQuantity);
      handleCloseModal();
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    try {
      const { data } = await axios.post("/api/wishlist", { productId: product._id });
      setWishlistIds(data.wishlist.map((w: any) => typeof w === 'string' ? w : w._id));
      if (wishlistIds.includes(product._id)) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to save to wishlist");
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Curated Collection</h1>
        <p className="text-slate-500 dark:text-slate-400">Discover premium utility designs and modern styling accessories.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glassmorphism rounded-3xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border border-gray-100/45 dark:border-gray-800/40 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories pills */}
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={
                "px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer " +
                (selected === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800/80")
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting drop-down */}
        <div className="relative w-full lg:w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Skeleton Loaders */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/50 rounded-3xl p-5 space-y-4 animate-pulse">
              <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-md w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-100 dark:bg-slate-800/50 rounded-md w-1/3" />
                <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => addToCart(product, 1)}
              onQuickView={handleOpenModal}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.includes(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glassmorphism rounded-3xl border border-gray-100/40 dark:border-gray-800/40">
          <div className="text-7xl mb-4 animate-bounce">🔍</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No masterpieces found</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Try refining your search terms or choosing a different category filter.</p>
        </div>
      )}

      {/* PRODUCT DETAILS QUICK-VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[4px] animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full border border-gray-200/50 dark:border-slate-800/50 animate-scale-in relative grid grid-cols-1 md:grid-cols-2">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 rounded-full transition cursor-pointer z-10"
            >
              <X size={16} />
            </button>

            {/* Left Column: Image */}
            <div className="bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center p-8 relative h-72 md:h-full border-r border-slate-100/50 dark:border-slate-800/50">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-h-full object-contain"
              />
            </div>

            {/* Right Column: Details */}
            <div className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
                  {selectedProduct.category}
                </span>
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedProduct.name}
                </h2>
                
                {/* Rating display */}
                <div className="flex items-center gap-1.5 text-amber-500">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-bold">(5.0 Customer Rating)</span>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  Rs. {selectedProduct.price.toFixed(2)}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                  
                  {/* Plus/Minus counter */}
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-2 py-1 gap-4">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:scale-110 active:scale-95 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-5 text-center">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:scale-110 active:scale-95 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleModalAddToCart}
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 font-bold"
                >
                  <ShoppingCart size={18} />
                  Add To Cart &middot; Rs. {(selectedProduct.price * modalQuantity).toFixed(2)}
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
