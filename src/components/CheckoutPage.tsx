import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, Truck, Check, HelpCircle, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CheckoutPage() {
  const { 
    cart, 
    clearCart, 
    user, 
    placeOrder, 
    setActivePage, 
    setAccountOpen,
    isAccountOpen
  } = useApp();

  // Redirect to home if cart is empty on mount (or after completion)
  useEffect(() => {
    if (cart.length === 0) {
      // unless we are in transition, go home
      const hasPlaced = sessionStorage.getItem('last_placed_order_id');
      if (!hasPlaced) {
        setActivePage('home');
      }
    }
  }, [cart, setActivePage]);

  // Customer Details
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState('');

  // Shipping Address
  const [shipHouse, setShipHouse] = useState('');
  const [shipStreet, setShipStreet] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipState, setShipState] = useState('');
  const [shipPincode, setShipPincode] = useState('');
  const [shipCountry, setShipCountry] = useState('India');

  // Billing Address
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billHouse, setBillHouse] = useState('');
  const [billStreet, setBillStreet] = useState('');
  const [billCity, setBillCity] = useState('');
  const [billState, setBillState] = useState('');
  const [billPincode, setBillPincode] = useState('');
  const [billCountry, setBillCountry] = useState('India');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.displayName || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  // Calculations
  const itemsSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = 0;
  const finalTotal = itemsSubtotal;

  const formatPrice = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  // Helper loader for Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('Please login or register to complete your order.');
      setAccountOpen(true);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    if (!fullName || !email || !mobile) {
      setErrorMessage('Please fill out all required customer details.');
      return;
    }

    if (!shipHouse || !shipStreet || !shipCity || !shipState || !shipPincode) {
      setErrorMessage('Please fill out all required shipping address fields.');
      return;
    }

    if (!sameAsShipping && (!billHouse || !billStreet || !billCity || !billState || !billPincode)) {
      setErrorMessage('Please fill out all required billing address fields.');
      return;
    }

    setIsProcessing(true);

    const customerDetails = {
      fullName,
      email,
      mobile
    };

    const shippingAddress = {
      houseFlat: shipHouse,
      streetArea: shipStreet,
      city: shipCity,
      state: shipState,
      pincode: shipPincode,
      country: shipCountry
    };

    const billingAddress = {
      sameAsShipping,
      houseFlat: sameAsShipping ? shipHouse : billHouse,
      streetArea: sameAsShipping ? shipStreet : billStreet,
      city: sameAsShipping ? shipCity : billCity,
      state: sameAsShipping ? shipState : billState,
      pincode: sameAsShipping ? shipPincode : billPincode,
      country: sameAsShipping ? shipCountry : billCountry
    };

    const serializedItems = cart.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.price,
      selectedColor: {
        name: item.selectedColor.name,
        value: item.selectedColor.value,
        imageUrl: item.selectedColor.imageUrl
      }
    }));

    // --- CASH ON DELIVERY FLOW ---
    if (paymentMethod === 'cod') {
      try {
        const orderId = await placeOrder(
          itemsSubtotal,
          discountAmount,
          finalTotal,
          {
            paymentMethod: 'Cash on Delivery',
            transactionId: `COD-${Math.floor(100000 + Math.random() * 900000)}`,
            detailsSummary: 'Cash on Delivery',
            status: 'Pending Payment'
          },
          {
            customerDetails,
            shippingAddress,
            billingAddress
          }
        );

        // Store details in session storage for the success page
        const successData = {
          orderId,
          paymentMethod: 'Cash on Delivery',
          amount: finalTotal,
          customerDetails,
          shippingAddress,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem('last_placed_order', JSON.stringify(successData));
        sessionStorage.setItem('last_placed_order_id', orderId);

        clearCart();
        setIsProcessing(false);
        setActivePage('order-success' as any);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to place COD order.');
        setIsProcessing(false);
      }
      return;
    }

    // --- RAZORPAY FLOW ---
    try {
      // 1. Create Order on server
      const createResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const resData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(resData.error || 'Failed to initialize payment gateway.');
      }

      const { id: rzpOrderId, amount, mock, keyId } = resData;

      if (mock) {
        // --- SANDBOX RAZORPAY FLOW ---
        const mockPaymentId = `pay_mock_${Math.floor(100000 + Math.random() * 900000)}BLZ`;
        
        // Call backend verify with extended checkout details
        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: rzpOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'sandbox_simulation_signature',
            userId: user.uid,
            email: email || user.email || '',
            items: serializedItems,
            itemsSubtotal,
            discountAmount,
            finalTotal,
            isMock: true,
            customerDetails,
            shippingAddress,
            billingAddress
          })
        });

        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Mock simulation payment verification refused.');
        }

        // Direct client-side sync fallback if not saved by server database
        if (verifyData.savedInDB === false && verifyData.orderPayload) {
          try {
            const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
            const { db } = await import('../lib/firebase');
            const orderDocPayload = {
              ...verifyData.orderPayload,
              createdAt: serverTimestamp()
            };
            delete orderDocPayload.savedInDB;
            await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
          } catch (e) {
            console.warn('Client fallback write failed:', e);
          }
        }

        // Store details in session storage for the success page
        const successData = {
          orderId: verifyData.orderId,
          paymentMethod: 'Razorpay (Online)',
          amount: finalTotal,
          customerDetails,
          shippingAddress,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem('last_placed_order', JSON.stringify(successData));
        sessionStorage.setItem('last_placed_order_id', verifyData.orderId);

        clearCart();
        setIsProcessing(false);
        setActivePage('order-success' as any);
      } else {
        // --- LIVE RAZORPAY GATEWAY ---
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Could not load Razorpay SDK. Please check your internet connection.');
        }

        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'Balanza Bikes',
          description: "Premium Kid's Balance Bike Purchase",
          order_id: rzpOrderId,
          prefill: {
            name: fullName,
            email: email,
            contact: mobile,
          },
          theme: {
            color: '#BFEC53',
          },
          handler: async function (paymentRes: any) {
            setIsProcessing(true);
            try {
              const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                  userId: user.uid,
                  email: email || user.email || '',
                  items: serializedItems,
                  itemsSubtotal,
                  discountAmount,
                  finalTotal,
                  isMock: false,
                  customerDetails,
                  shippingAddress,
                  billingAddress
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Razorpay payment verification rejected.');
              }

              // Client-side sync fallback
              if (verifyData.savedInDB === false && verifyData.orderPayload) {
                try {
                  const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
                  const { db } = await import('../lib/firebase');
                  const orderDocPayload = {
                    ...verifyData.orderPayload,
                    createdAt: serverTimestamp()
                  };
                  delete orderDocPayload.savedInDB;
                  await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
                } catch (ce) {
                  console.warn('Direct client sync failed:', ce);
                }
              }

              // Store details in session storage for the success page
              const successData = {
                orderId: verifyData.orderId,
                paymentMethod: 'Razorpay (Online)',
                amount: finalTotal,
                customerDetails,
                shippingAddress,
                createdAt: new Date().toISOString()
              };
              sessionStorage.setItem('last_placed_order', JSON.stringify(successData));
              sessionStorage.setItem('last_placed_order_id', verifyData.orderId);

              clearCart();
              setIsProcessing(false);
              setActivePage('order-success' as any);
            } catch (err: any) {
              setErrorMessage(err.message || 'Payment signature verification failed.');
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] font-sans pb-24 text-left select-none animate-fade-in text-slate-900">
      {/* Deep Slate Premium Header */}
      <div className="bg-slate-950 text-white pt-16 pb-24 relative overflow-hidden px-4 md:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-5xl relative z-10">
          <button 
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-300 hover:text-white transition-all mb-6 bg-white/5 hover:bg-white/10 active:scale-95 px-3.5 py-1.5 rounded-full border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#A7E22E]" />
            Back to Shop
          </button>

          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4.5 w-4.5 text-[#A7E22E]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block font-mono">
              Secure Checkout Engine
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Complete Your Purchase
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold max-w-xl mt-3 leading-relaxed">
            Configure delivery settings and securely place your toddler&apos;s cycle with Balanza.
          </p>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="mx-auto max-w-5xl px-4 md:px-8 -mt-12 relative z-20">
        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Checkout Fields (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Details block */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 text-left select-text">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-[#A7E22E]" />
                <h2 className="font-display text-sm font-black uppercase tracking-wider text-slate-900">
                  Customer Details
                </h2>
              </div>

              {!user && (
                <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-[11px] font-medium leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    Account required. Please click{' '}
                    <button 
                      type="button" 
                      onClick={() => setAccountOpen(true)}
                      className="font-bold underline uppercase hover:text-amber-950"
                    >
                      Sign In / Register
                    </button>{' '}
                    to complete checkout smoothly.
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9888963663"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address block */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 text-left select-text">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-[#A7E22E]" />
                <h2 className="font-display text-sm font-black uppercase tracking-wider text-slate-900">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      House / Flat / Building No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipHouse}
                      onChange={(e) => setShipHouse(e.target.value)}
                      placeholder="Flat 102, Blossom Apartments"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipPincode}
                      onChange={(e) => setShipPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit PIN"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Street Address / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shipStreet}
                    onChange={(e) => setShipStreet(e.target.value)}
                    placeholder="Linking Road, Santacruz West"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipCity}
                      onChange={(e) => setShipCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipState}
                      onChange={(e) => setShipState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={shipCountry}
                      onChange={(e) => setShipCountry(e.target.value)}
                      placeholder="India"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address checkbox & block */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 text-left select-text">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-[#A7E22E]" />
                <h2 className="font-display text-sm font-black uppercase tracking-wider text-slate-900">
                  Billing Address
                </h2>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none mb-4 pb-2">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="h-4 w-4 rounded text-[#A7E22E] focus:ring-[#A7E22E] border-slate-300 accent-[#A7E22E]"
                />
                <span className="text-xs font-bold text-slate-700">
                  Billing address is the same as shipping address
                </span>
              </label>

              {!sameAsShipping && (
                <div className="space-y-4 pt-3 border-t border-slate-100 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        House / Flat / Building No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billHouse}
                        onChange={(e) => setBillHouse(e.target.value)}
                        placeholder="Flat 102, Blossom Apartments"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billPincode}
                        onChange={(e) => setBillPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="6-digit PIN"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Street Address / Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={!sameAsShipping}
                      value={billStreet}
                      onChange={(e) => setBillStreet(e.target.value)}
                      placeholder="Linking Road, Santacruz West"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billCity}
                        onChange={(e) => setBillCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billState}
                        onChange={(e) => setBillState(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        required={!sameAsShipping}
                        value={billCountry}
                        onChange={(e) => setBillCountry(e.target.value)}
                        placeholder="India"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Option Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 text-left">
              <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-[#A7E22E]" />
                <h2 className="font-display text-sm font-black uppercase tracking-wider text-slate-900">
                  Select Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#A7E22E] bg-slate-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-350 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-display text-xs font-black uppercase tracking-wider text-slate-950">
                      Razorpay Gateway
                    </span>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-[#A7E22E] bg-[#A7E22E]' : 'border-slate-300'}`}>
                      {paymentMethod === 'razorpay' && <Check className="h-3 w-3 text-slate-950 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    Pay securely using UPI, Credit/Debit Cards, Net Banking, or popular wallets instantly.
                  </p>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#A7E22E] bg-slate-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-350 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="font-display text-xs font-black uppercase tracking-wider text-slate-950">
                      Cash on Delivery (COD)
                    </span>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#A7E22E] bg-[#A7E22E]' : 'border-slate-300'}`}>
                      {paymentMethod === 'cod' && <Check className="h-3 w-3 text-slate-950 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    Directly place your order and settle payment in cash upon physical shipment delivery.
                  </p>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Placement (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 lg:sticky lg:top-28 text-left">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                <div className="h-2 w-2 rounded-full bg-[#A7E22E]" />
                <h2 className="font-display text-sm font-black uppercase tracking-wider text-slate-900">
                  Order Summary
                </h2>
              </div>

              {/* Items listing */}
              <div className="max-h-[220px] overflow-y-auto pr-1 divide-y divide-slate-100 mb-4 select-text">
                {cart.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center gap-3 first:pt-0 last:pb-0">
                    <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-150 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                      <img 
                        src={item.selectedColor.imageUrl || item.product.images?.[0]} 
                        alt={item.product.name} 
                        className="h-full w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate leading-snug">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">
                          Color:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="h-2.5 w-2.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.selectedColor.value }}
                          />
                          <span className="text-[9.5px] font-extrabold text-slate-650 uppercase">
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          Qty: <span className="text-slate-800 font-extrabold">{item.quantity}</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 border-t border-slate-100 pt-4 mb-6 select-text">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Cart Items Subtotal</span>
                  <span className="font-mono text-slate-800 font-bold">{formatPrice(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-slate-150 pt-3 mt-1.5">
                  <span className="font-display text-sm font-black uppercase tracking-wider text-slate-900">Grand Total</span>
                  <span className="font-mono text-xl font-black text-[#5F6D50]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Error prompt */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] font-bold text-center mb-4 leading-normal select-text">
                  {errorMessage}
                </div>
              )}

              {/* Safe Checkout Badges */}
              <div className="flex items-center gap-2 mb-4 text-[9.5px] text-slate-400 font-semibold select-none leading-none">
                <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Secure SSL Checkouts protected by Balanza safety protocols.</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full rounded-2xl bg-zinc-950 text-white hover:bg-[#A7E22E] hover:text-slate-950 py-4.5 text-center text-xs font-black uppercase tracking-widest transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    PLACING SECURITY HARNESS...
                  </>
                ) : paymentMethod === 'cod' ? (
                  'PLACE ORDER (CASH ON DELIVERY)'
                ) : (
                  'PROCEED TO ONLINE PAYMENT'
                )}
              </button>

            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
