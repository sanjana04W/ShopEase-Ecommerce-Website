import { Product } from '@/types';
import Button from './Button';
import { Eye, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onQuickView, onToggleWishlist, isWishlisted = false }: ProductCardProps) {
  return (
    <div className="premium-card rounded-3xl overflow-hidden group relative flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative h-64 w-full bg-slate-50 dark:bg-slate-900/40 overflow-hidden flex items-center justify-center border-b border-gray-100/50 dark:border-gray-800/50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📦</span>
        )}
        
        {/* Quick View Overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 backdrop-blur-[2px]">
            <button
              onClick={() => onQuickView(product)}
              className="p-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-full shadow-lg hover:scale-110 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all cursor-pointer"
              title="Quick View"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="p-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-full shadow-lg hover:scale-110 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer ${
                  isWishlisted 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white'
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={20} className={isWishlisted ? "fill-white" : ""} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
            {product.category}
          </span>
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg mt-3 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/50 dark:border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 dark:text-slate-500">Price</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              Rs. {product.price.toFixed(2)}
            </span>
          </div>
          <Button variant="primary" onClick={() => onAddToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

