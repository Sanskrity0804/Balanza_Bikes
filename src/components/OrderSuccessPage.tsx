import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Calendar, FileText, MapPin, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OrderSuccessPage() {
  const { setActivePage } = useApp();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Try to load the newly placed order details from sessionStorage
    const savedOrder = sessionStorage.getItem('last_placed_order');
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error('Failed to parse order receipt from session storage', e);
      }
    }
  }, []);

  const formatPrice = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const getFormattedDate = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shippingStr = order?.shippingAddress 
    ? `${order.shippingAddress.houseFlat}, ${order.shippingAddress.streetArea}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`
    : 'Shipping address pending verification...';

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans flex flex-col justify-center items-center py-16 px-4 select-none animate-scale-up">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-slate-150 relative overflow-hidden select-text">
        
        {/* Top visual accents */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[#BFEC53]"></div>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
          <CheckCircle className="h-10 w-10 stroke-[2]" />
        </div>

        <span className="text-[11px] font-black tracking-widest text-[#9CB331] uppercase block mb-1">
          Thank You Explorer
        </span>
        <h3 className="font-display text-2xl font-black text-slate-900 mb-4 uppercase tracking-wider leading-none">
          Order Placed Successfully!
        </h3>

        {/* Transaction Receipt Details */}
        <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 font-mono text-xs text-slate-700">
          <p className="font-sans font-black text-slate-400 uppercase tracking-widest text-[9.5px] mb-3 text-center pb-2 border-b border-slate-200 flex items-center justify-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[#9CB331]" />
            Official Storefront Receipt
          </p>

          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1">Order ID:</span>
            <span className="font-bold text-slate-800 break-all select-all font-mono">{order?.orderId || 'BLZ-584739'}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1">Payment Method:</span>
            <span className="font-black text-slate-800 uppercase text-[10px]">{order?.paymentMethod || 'Razorpay (Online)'}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1">
              <User className="h-3 w-3 inline text-slate-400" /> Customer Name:
            </span>
            <span className="font-bold text-slate-800 truncate font-sans">{order?.customerDetails?.fullName || 'Valued Customer'}</span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1 shrink-0">
              <MapPin className="h-3 w-3 inline text-slate-400" /> Shipping Address:
            </span>
            <span className="font-medium text-slate-700 text-right font-sans text-[11px] leading-tight max-w-[200px]">{shippingStr}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1">
              <Calendar className="h-3 w-3 inline text-slate-400" /> Order Date:
            </span>
            <span className="font-bold text-slate-800 font-sans">{getFormattedDate(order?.createdAt)}</span>
          </div>

          <div className="flex justify-between items-baseline pt-2.5 border-t border-dashed border-slate-300 text-slate-900 font-black">
            <span className="font-sans text-xs uppercase tracking-wider">
              {order?.paymentMethod?.toLowerCase().includes('cod') ? 'Payable Amount (COD):' : 'Amount Paid:'}
            </span>
            <span className="text-emerald-700 text-sm leading-none font-black">{formatPrice(order?.amount || 2899)}</span>
          </div>
        </div>

        {/* Updated Success Message requested by user */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl mb-8">
          <p className="font-sans text-xs text-slate-600 leading-relaxed font-bold whitespace-pre-line">
            Thank you for your purchase.
            Balanza is wrapping up your little ride.
          </p>
        </div>

        {/* Secure seal badge */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-6">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Verified Secure Order Settlement</span>
        </div>

        <button
          onClick={() => {
            // Clean up session storage
            sessionStorage.removeItem('last_placed_order');
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full rounded-2xl bg-zinc-950 py-4 text-center text-xs font-black uppercase tracking-widest text-white hover:bg-[#BFEC53] hover:text-slate-950 hover:shadow-md transition-all cursor-pointer active:scale-98"
        >
          Continue Exploring
        </button>
      </div>
    </div>
  );
}
