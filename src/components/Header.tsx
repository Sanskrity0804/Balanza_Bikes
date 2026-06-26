import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BalanzaLogo from './BalanzaLogo';
import BalanzaBagIcon from './BalanzaBagIcon';

export default function Header() {
  const { 
    cart, 
    setCartOpen, 
    setMenuOpen, 
    setSearchOpen, 
    setAccountOpen, 
    setActivePage, 
    uiSettings,
    user,
    logOut,
    setAccountTab
  } = useApp();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#A7E22E]/95 backdrop-blur-md select-none border-b border-slate-950/10">
      {/* Announcement Bar */}
      <div className="w-full bg-[#111] text-white py-2 px-4 overflow-hidden relative">
        {uiSettings.announcementMoving ? (
          <div className="relative w-full flex overflow-hidden">
            <div className="animate-marquee-slow flex whitespace-nowrap gap-16">
              <span className="text-xs font-semibold tracking-widest text-[#BFEC53] uppercase">
                {uiSettings.announcementText}
              </span>
              <span className="text-xs font-semibold tracking-widest text-white uppercase">
                {uiSettings.announcementText}
              </span>
              <span className="text-xs font-semibold tracking-widest text-[#BFEC53] uppercase">
                {uiSettings.announcementText}
              </span>
              <span className="text-xs font-semibold tracking-widest text-white uppercase">
                {uiSettings.announcementText}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs font-semibold tracking-widest text-white text-center uppercase">
            {uiSettings.announcementText}
          </p>
        )}
      </div>

      {/* Main Bar */}
      <div className="mx-auto max-w-7xl pl-4 pr-2 md:pl-8 md:pr-3">
        <div className="flex h-24 md:h-[110px] items-center justify-between border-b border-slate-950/5">
          
          {/* Left: MENU Button with Custom Hamburger */}
          <button 
            id="nav-menu-btn"
            onClick={() => setMenuOpen(true)}
            className="group flex items-center gap-3 text-sm font-semibold tracking-widest text-slate-950 transition-colors hover:text-black cursor-pointer uppercase"
          >
            <div className="flex flex-col gap-1.5 justify-center items-center w-5 h-5">
              <span className="h-0.5 w-5 bg-slate-950 group-hover:bg-black transition-all rounded-full"></span>
              <span className="h-0.5 w-5 bg-slate-950 group-hover:bg-black transition-all rounded-full"></span>
              <span className="h-0.5 w-5 bg-slate-950 group-hover:bg-black transition-all rounded-full"></span>
            </div>
            <span className="hidden sm:inline-block font-display text-xs">MENU</span>
          </button>

          {/* Center: BALANZA Logo */}
          <button 
            onClick={() => setActivePage('home')}
            className="flex flex-col items-center select-none active:scale-95 transition-transform duration-300 outline-none cursor-pointer" 
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <BalanzaLogo className="h-14 md:h-[70px] w-auto hover:scale-105 transition-transform duration-300" />
          </button>

          {/* Right Icons: Account, Cart */}
          <div className="flex items-center gap-4 md:gap-7">

            {/* ACCOUNT */}
            {!user ? (
              <button 
                id="account-btn"
                onClick={() => {
                  setAccountTab('profile');
                  setAccountOpen(true);
                }}
                className="group flex flex-col items-center gap-1 text-slate-900 transition-colors hover:text-black cursor-pointer"
                title="Account"
              >
                <User className="h-5.5 w-5.5 stroke-[2]" />
                <span className="hidden md:inline-block font-display text-[9px] font-bold tracking-widest text-slate-900/90 uppercase">Account</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative focus:outline-none flex items-center justify-center cursor-pointer select-none active:scale-95 transition-all"
                  title="User Menu"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-950 text-[#A7E22E] border-2 border-[#A7E22E] font-sans text-sm font-black flex items-center justify-center shadow-md transition-all hover:bg-slate-900">
                    {user.email ? user.email.charAt(0).toUpperCase() : (user.phoneNumber ? 'M' : 'U')}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-fade-in text-left">
                    <div className="p-3.5 border-b border-slate-100 bg-slate-50 select-text">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans">Logged in as</p>
                      <p className="text-xs font-black text-slate-800 truncate font-mono mt-0.5">{user.email || user.phoneNumber || 'Club Member'}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'My Profile', tab: 'profile' as const },
                        { label: 'My Orders', tab: 'orders' as const },
                        { label: 'Wishlist', tab: 'wishlist' as const },
                        { label: 'Saved Addresses', tab: 'addresses' as const },
                        { label: 'Account Settings', tab: 'settings' as const },
                      ].map((item) => (
                        <button
                          key={item.tab}
                          onClick={() => {
                            setAccountTab(item.tab);
                            setAccountOpen(true);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-[#A7E22E]/10 hover:text-slate-950 transition-colors font-semibold cursor-pointer flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 group-hover:bg-slate-900" />
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={async () => {
                          setDropdownOpen(false);
                          await logOut();
                          setActivePage('home');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-extrabold cursor-pointer uppercase tracking-wider flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-450" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <button 
              id="cart-btn"
              onClick={() => setCartOpen(true)}
              className="group relative flex flex-col items-center gap-1 text-slate-900 transition-colors hover:text-black cursor-pointer"
              title="Cart"
            >
              <div className="relative">
                <ShoppingBag className="h-5.5 w-5.5 stroke-[2]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 text-[9px] font-bold text-[#A7E22E] shadow-md">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline-block font-display text-[9px] font-bold tracking-widest text-slate-900/90 uppercase">Cart</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
