'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket, Check, X, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  // Promo codes state
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingForm, setShippingForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [paymentForm, setPaymentForm] = useState({ card: '', expiry: '', cvc: '' });
  
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    const code = promoCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedDiscount(10);
      setPromoSuccess('Promo SAVE10 applied! 10% discount subtracted.');
    } else if (code === 'WELCOME20') {
      setAppliedDiscount(20);
      setPromoSuccess('Promo WELCOME20 applied! 20% discount subtracted.');
    } else {
      setPromoError('Invalid promo code. Try SAVE10.');
    }
  };

  const discountAmount = (cartTotal * appliedDiscount) / 100;
  const shippingCost = cartTotal > 50 || cartTotal === 0 ? 0 : 9.99;
  const taxAmount = (cartTotal * 8) / 100; // 8% sales tax
  const finalTotal = cartTotal - discountAmount + shippingCost + taxAmount;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setSubmitting(true);
      try {
        const orderData = {
          customerInfo: {
            name: shippingForm.name,
            email: shippingForm.email,
            phone: shippingForm.phone,
            address: shippingForm.address,
            city: shippingForm.city,
            zip: shippingForm.zip
          },
          items: cartItems.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          subtotal: cartTotal,
          discount: discountAmount,
          shippingCost: shippingCost,
          tax: taxAmount,
          total: finalTotal
        };

        const { data } = await axios.post('/api/orders', orderData);
        setPlacedOrder(data.order);
        setCheckoutStep(3);
        toast.success("Order authorized successfully!");
        
        // Clear cart after checkout completes successfully
        clearCart();
      } catch (error: any) {
        const message = error.response?.data?.message || "Failed to authorize payment. Please try again.";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setCheckoutStep(1);
    setShippingForm({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
    setPaymentForm({ card: '', expiry: '', cvc: '' });
    setPlacedOrder(null);
  };

  if (cartItems.length === 0 && checkoutStep !== 3) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-28 text-center space-y-6 animate-fade-in-up'>
        <div className='text-8xl animate-bounce duration-1000' style={{ animationDuration: '3s' }}>🛒</div>
        <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>Your shopping cart is empty</h2>
        <p className='text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed'>Add some of our outstanding, curated masterpieces to your order to get started.</p>
        <Link href='/products'>
          <Button variant="primary" className="px-8 py-3.5 shadow-lg shadow-indigo-600/10 font-bold rounded-2xl">
            Browse Our Masterpieces
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in'>
      <h1 className='text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight'>Your Shopping Cart</h1>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        
        {/* Cart items list */}
        <div className='lg:col-span-2 space-y-4'>
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className='flex flex-col sm:flex-row gap-6 bg-white dark:bg-slate-900/60 border border-gray-100/40 dark:border-slate-800/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow items-center'
            >
              <div className='w-24 h-24 bg-slate-50 dark:bg-slate-900/40 rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-slate-100/50 dark:border-slate-800/50 flex-shrink-0'>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className='max-h-full object-contain'
                />
              </div>

              <div className='flex-1 text-center sm:text-left space-y-1.5'>
                <span className='text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md'>
                  {item.product.category}
                </span>
                <h3 className='font-bold text-slate-900 dark:text-white text-lg'>{item.product.name}</h3>
                <p className='text-slate-400 dark:text-slate-500 text-xs line-clamp-1'>{item.product.description}</p>
              </div>

              <div className='flex items-center gap-6 flex-shrink-0 flex-col sm:flex-row'>
                
                {/* Plus/minus quantity inputs */}
                <div className='flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-2 py-1 gap-3.5'>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className='p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:scale-110 transition cursor-pointer'
                  >
                    <Minus size={12} />
                  </button>
                  <span className='text-sm font-bold text-slate-900 dark:text-white w-5 text-center'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className='p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:scale-110 transition cursor-pointer'
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className='text-center sm:text-right min-w-[70px]'>
                  <p className='text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider'>Subtotal</p>
                  <p className='font-extrabold text-slate-900 dark:text-white text-base'>
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className='p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer'
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Order Summary box */}
        <div className='glassmorphism rounded-3xl p-6 border border-gray-100/40 dark:border-gray-800/40 shadow-sm space-y-6'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white'>Order Summary</h2>
          
          <div className='space-y-3.5 text-sm pb-6 border-b border-slate-100 dark:border-slate-800/50'>
            <div className='flex justify-between text-slate-500 dark:text-slate-400'>
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. {cartTotal.toFixed(2)}</span>
            </div>
            
            {appliedDiscount > 0 && (
              <div className='flex justify-between text-emerald-600 dark:text-emerald-400 font-medium'>
                <span>Promo Discount ({appliedDiscount}%)</span>
                <span>-Rs. {discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className='flex justify-between text-slate-500 dark:text-slate-400'>
              <span>Shipping cost</span>
              {shippingCost === 0 ? (
                <span className='text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded'>Free</span>
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. {shippingCost.toFixed(2)}</span>
              )}
            </div>
            
            <div className='flex justify-between text-slate-500 dark:text-slate-400'>
              <span>Sales Tax (8%)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. {taxAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Ticket size={12} /> Apply Promo Discount
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="SAVE10, WELCOME20..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-[10px] font-medium animate-scale-in">⚠️ {promoError}</p>}
            {promoSuccess && <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-medium animate-scale-in">✅ {promoSuccess}</p>}
          </form>

          {/* Checkout pricing and button */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className='flex justify-between font-black text-slate-900 dark:text-white text-lg'>
              <span>Estimated Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">Rs. {finalTotal.toFixed(2)}</span>
            </div>
            
            <Button
              onClick={() => setCheckoutOpen(true)}
              className='w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 font-bold'
            >
              Proceed to Secure Checkout
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center mt-4">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Guaranteed 256-bit safe payments</span>
          </div>
        </div>

      </div>

      {/* CHECKOUT FLOW MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[5px] animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-100/40 dark:border-slate-800/50 animate-scale-in p-8 relative space-y-6">
            
            {/* Close modal */}
            {checkoutStep !== 3 && (
              <button
                onClick={handleCloseCheckout}
                disabled={submitting}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer disabled:opacity-50"
              >
                <X size={16} />
              </button>
            )}

            {/* Stepper progress indicator */}
            {checkoutStep !== 3 && (
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-450">
                <span className={`pb-1.5 border-b-2 px-2 transition-all ${checkoutStep === 1 ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-slate-200 dark:border-slate-700'}`}>1. Shipping</span>
                <span className={`pb-1.5 border-b-2 px-2 transition-all ${checkoutStep === 2 ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-slate-200 dark:border-slate-700'}`}>2. Checkout</span>
              </div>
            )}

            {/* Step 1: Shipping Form */}
            {checkoutStep === 1 && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shipping Credentials</h3>
                  <p className="text-xs text-slate-400">Where should we deliver your premium items?</p>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={shippingForm.name}
                    onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Physical Address"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Zip Code"
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full py-3.5 rounded-2xl font-bold mt-4 shadow-lg shadow-indigo-600/10">
                  Next: Payment Details
                </Button>
              </form>
            )}

            {/* Step 2: Payment Form */}
            {checkoutStep === 2 && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Checkout</h3>
                  <p className="text-xs text-slate-400">Total charge: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Rs. {finalTotal.toFixed(2)}</span></p>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={submitting}
                      placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                      value={paymentForm.card}
                      onChange={(e) => setPaymentForm({ ...paymentForm, card: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      disabled={submitting}
                      placeholder="MM/YY"
                      value={paymentForm.expiry}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      required
                      disabled={submitting}
                      placeholder="CVC"
                      value={paymentForm.cvc}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setCheckoutStep(1)} disabled={submitting} className="py-3.5 rounded-2xl disabled:opacity-50">
                    Back
                  </Button>
                  <Button type="submit" disabled={submitting} className="py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-600/10 flex justify-center items-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <span>Authorize Payment</span>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {checkoutStep === 3 && placedOrder && (
              <div className="text-center space-y-6 py-6 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500 relative">
                  <Check size={40} className="stroke-[2.5]" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-25" />
                </div>
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-md">
                    <Sparkles size={10} /> Order Authorized
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Order Placed Successfully!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto">
                    Thanks for shopping at ShopEase, {placedOrder.customerInfo.name || 'valued customer'}. We've sent a detailed confirmation email to {placedOrder.customerInfo.email || 'your address'}.
                  </p>
                </div>

                <div className="bg-indigo-50/50 dark:bg-slate-800/40 rounded-2xl p-4 text-left border border-slate-100/50 dark:border-slate-800/50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order Number:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">#{placedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping To:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{placedOrder.customerInfo.address}, {placedOrder.customerInfo.city}</span>
                  </div>
                </div>

                {/* Progress bar simulation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Packing shipment</span>
                    <span className="animate-pulse">Active</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-400 h-full animate-progress-bar" />
                  </div>
                </div>

                <Button onClick={handleCloseCheckout} className="w-full py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-600/10">
                  Return To Store
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
