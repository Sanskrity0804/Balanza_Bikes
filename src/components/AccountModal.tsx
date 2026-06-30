import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  User, 
  FileText, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut, 
  Save, 
  Plus, 
  Edit, 
  Trash, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  Phone,
  ShoppingBag,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BalanzaLogo from './BalanzaLogo';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';



export default function AccountModal() {
  const { 
    isAccountOpen, 
    setAccountOpen, 
    user, 
    logOut, 
    orders, 
    isFetchingOrders,
    setAdminOpen,
    cart,
    setCartOpen,
    accountTab,
    setAccountTab,
    wishlist,
    toggleWishlist,
    bikes,
    addToCart,
    setActivePage,
    setUser
  } = useApp();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notifyConsent, setNotifyConsent] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('all');

  // NEW USER ACCOUNT STATES
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Address form states
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setErrorText('File size must be less than 1.5MB for profile photos.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorText('');
    setProfileSuccess('');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result);
        setProfileSuccess('Photo uploaded! Press "Save Changes" to save permanently.');
      }
      setIsUploadingPhoto(false);
    };
    reader.onerror = () => {
      setErrorText('Failed to read image file.');
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // Fetch / sync user profile on login or modal open
  useEffect(() => {
    if (!user) return;

    if (user.isSimulated) {
      setProfileName(user.displayName || '');
      setProfilePhone(user.phoneNumber || '');
      setProfilePhoto(user.photoURL || '');
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfileName(data.displayName || user.displayName || '');
          setProfilePhone(data.phoneNumber || user.phoneNumber || '');
          setProfilePhoto(data.photoURL || data.profilePhoto || user.photoURL || '');
          setAddresses(data.addresses || []);
        } else {
          setProfileName(user.displayName || '');
          setProfilePhone('');
          setProfilePhoto(user.photoURL || '');
          setAddresses([]);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAccountOpen) {
      fetchUserProfile();
    }
  }, [user, isAccountOpen]);

  // Profile handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProfileSuccess('');
    setErrorText('');

    if (user.isSimulated) {
      const updatedUser = { 
        ...user, 
        displayName: profileName, 
        phoneNumber: profilePhone,
        photoURL: profilePhoto 
      };
      localStorage.setItem('balanza_simulated_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsSubmitting(false);
      setProfileSuccess('Profile changes saved successfully (simulated)!');
      return;
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', user.uid), {
        displayName: profileName,
        phoneNumber: profilePhone,
        photoURL: profilePhoto,
        profilePhoto: profilePhoto,
        email: user.email,
        updatedAt: new Date()
      }, { merge: true });

      try {
        const { updateProfile } = await import('firebase/auth');
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: profileName,
            photoURL: profilePhoto
          });
        }
      } catch (authErr) {
        console.warn("Could not sync directly to Firebase Auth profile:", authErr);
      }

      setUser({
        ...user,
        displayName: profileName,
        phoneNumber: profilePhone,
        photoURL: profilePhoto
      });

      setProfileSuccess('Profile changes saved successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address handlers
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressPincode || !addressStreet || !addressCity || !addressState) {
      setAddressError('Please fill out all address fields.');
      return;
    }
    setIsSavingAddress(true);
    setAddressError('');
    setAddressSuccess('');

    let updatedAddresses = [...addresses];
    
    if (editingAddressId && editingAddressId !== 'new') {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === editingAddressId 
          ? { 
              ...addr, 
              label: addressLabel, 
              pincode: addressPincode, 
              streetAddress: addressStreet, 
              city: addressCity, 
              state: addressState 
            } 
          : addr
      );
    } else {
      const newAddress = {
        id: `addr-${Math.floor(100000 + Math.random() * 900000)}`,
        label: addressLabel,
        pincode: addressPincode,
        streetAddress: addressStreet,
        city: addressCity,
        state: addressState,
        isDefault: addresses.length === 0
      };
      updatedAddresses.push(newAddress);
    }

    if (user.isSimulated) {
      setAddresses(updatedAddresses);
      setIsSavingAddress(false);
      setAddressSuccess(editingAddressId && editingAddressId !== 'new' ? 'Address updated successfully (simulated)!' : 'Address added successfully (simulated)!');
      setEditingAddressId(null);
      resetAddressForm();
      return;
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      }, { merge: true });

      setAddresses(updatedAddresses);
      setAddressSuccess(editingAddressId && editingAddressId !== 'new' ? 'Address updated successfully!' : 'Address added successfully!');
      setEditingAddressId(null);
      resetAddressForm();
    } catch (err: any) {
      console.error(err);
      setAddressError(err.message || 'Failed to save address.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    
    if (addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    if (user.isSimulated) {
      setAddresses(updatedAddresses);
      return;
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      }, { merge: true });
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    if (user.isSimulated) {
      setAddresses(updatedAddresses);
      return;
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      }, { merge: true });
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const resetAddressForm = () => {
    setAddressLabel('Home');
    setAddressPincode('');
    setAddressStreet('');
    setAddressCity('');
    setAddressState('');
    setEditingAddressId(null);
  };

  // Password handlers
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (user.isSimulated) {
      setIsSubmitting(false);
      setPasswordSuccess('Password updated successfully (simulated)!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
      if (auth.currentUser && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error("No active authenticated user found.");
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      let friendlyError = err.message || 'Failed to update password. Please verify current password.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'The current password you entered is incorrect.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'The new password is too weak. Please choose a stronger password.';
      }
      setPasswordError(friendlyError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeOrdersCount = orders ? orders.filter(o => {
    const s = String(o.status || 'placed').toLowerCase();
    return s !== 'delivered' && s !== 'completed';
  }).length : 0;

  const completedOrdersCount = orders ? orders.filter(o => {
    const s = String(o.status || 'placed').toLowerCase();
    return s === 'delivered' || s === 'completed';
  }).length : 0;

  const filteredOrders = orders ? orders.filter(o => {
    if (orderFilter === 'all') return true;
    const s = String(o.status || 'placed').toLowerCase();
    const isActive = s !== 'delivered' && s !== 'completed';
    if (orderFilter === 'active') return isActive;
    if (orderFilter === 'completed') return !isActive;
    return true;
  }) : [];

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || password.length < 6) return;
    setIsSubmitting(true);
    setErrorText('');
    setUnauthorizedDomain(null);
    try {
      let authUserCredential;
      if (isRegistering) {
        authUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore on registration
        try {
          await setDoc(doc(db, 'users', authUserCredential.user.uid), {
            userId: authUserCredential.user.uid,
            email: email,
            notifyConsent: notifyConsent,
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (firestoreError) {
          console.warn("Could not write profile to Firestore:", firestoreError);
          handleFirestoreError(firestoreError, OperationType.WRITE, `users/${authUserCredential.user.uid}`);
        }
      } else {
        authUserCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        setAccountOpen(false);
        if (cart && cart.length > 0) {
          setCartOpen(true);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Email Authentication issue:', err);
      setIsSubmitting(false);
      
      let friendlyMessage = 'Authentication failed. Please verify credentials and try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The entered email address is formatted incorrectly.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The password must be at least 6 characters in length.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No registered club member account found with this email. Toggle to Sign Up!';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMessage = 'Email/Password sign-in is not enabled on your brand new Firebase console yet. Please enable "Email/Password" in your Firebase console under Authentication -> Sign-in method.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setErrorText(friendlyMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorText('');
    setIsPopupBlocked(false);
    setUnauthorizedDomain(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            userId: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn("Could not save user profile to Firestore (might be normal if security rules restrict it):", e);
          handleFirestoreError(e, OperationType.WRITE, `users/${result.user.uid}`);
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setAccountOpen(false);
          if (cart && cart.length > 0) {
            setCartOpen(true);
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error("Google sign in failure:", err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('auth/unauthorized-domain'))) {
        setUnauthorizedDomain(window.location.hostname);
        setErrorText("Google Sign-In failed because this domain is unauthorized in Firebase.");
      } else if (err.code === 'auth/popup-blocked') {
        setIsPopupBlocked(true);
        setErrorText("Google popup was blocked by your browser. Please allow popups or try again.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorText("Google sign-in popup was closed before completing.");
      } else {
        setErrorText(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAccountOpen) return null;

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logOut();
      setIsSubmitting(false);
      setAccountOpen(false);
      setActivePage('home');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none transition-all duration-300 overflow-y-auto"
    >
      {/* Background shadow click */}
      <div 
        onClick={() => setAccountOpen(false)} 
        className="absolute inset-0 bg-transparent" 
      />

      {user ? (
        /* ========================================================
           LOGGED-IN ACCOUNT DASHBOARD VIEW (TWO SEPARATE CARDS LAYOUT)
           ======================================================== */
        <div 
          id="login-modal-box"
          className="relative w-full max-w-[1050px] flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-500 scale-100 z-10 h-[92vh] md:h-[620px] max-h-[92vh] md:max-h-[85vh] items-stretch overflow-hidden"
        >
          {/* LEFT SIDEBAR CARD */}
          <div className="w-full md:w-[280px] bg-white rounded-3xl border border-slate-100 p-4 md:p-6 flex flex-col justify-between shrink-0 shadow-2xl h-auto md:h-full relative overflow-y-auto md:overflow-visible">
            <div className="flex flex-col md:block">
              <div className="hidden md:flex mb-6 -mx-6 -mt-6 p-5 rounded-t-3xl bg-[#A7E22E] border-b border-slate-950/20 justify-center shadow-md">
               <BalanzaLogo className="h-10 w-auto text-slate-950" showIcon={true} />
              </div>

              {/* User avatar and email info */}
              <div className="flex items-center gap-3 mb-3 md:mb-8 p-2.5 md:p-3 bg-[#A7E22E]/5 rounded-xl border border-[#A7E22E]/20 select-text shrink-0">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-slate-950 text-[#A7E22E] border-2 border-[#A7E22E] font-sans text-sm md:text-base font-black flex items-center justify-center shadow-md shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-sans text-xs font-black text-slate-800 truncate leading-tight uppercase tracking-wider">
                    {profileName || user.displayName || 'Rider'}
                  </p>
                  <p className="font-sans text-[10px] text-slate-400 truncate mt-0.5 leading-none font-semibold">
                    {user.email || user.phoneNumber || 'Club Member'}
                  </p>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1.5 md:space-y-1 scrollbar-none snap-x shrink-0">
                {[
                  { label: 'My Profile', tab: 'profile' as const, icon: User },
                  { label: 'My Orders', tab: 'orders' as const, icon: FileText, badge: orders.length > 0 ? orders.length : undefined },
                  { label: 'Wishlist', tab: 'wishlist' as const, icon: Heart, badge: wishlist.length > 0 ? wishlist.length : undefined },
                  { label: 'Saved Addresses', tab: 'addresses' as const, icon: MapPin },
                  { label: 'Account Settings', tab: 'settings' as const, icon: Settings },
                ].map((navItem) => {
                  const Icon = navItem.icon;
                  const isActive = accountTab === navItem.tab;
                  return (
                    <button
                      key={navItem.tab}
                      onClick={() => {
                        setAccountTab(navItem.tab);
                        setErrorText('');
                        setProfileSuccess('');
                        setAddressSuccess('');
                        setAddressError('');
                        setPasswordSuccess('');
                        setPasswordError('');
                      }}
                      className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-2 md:py-3 rounded-xl text-[11px] md:text-xs font-bold tracking-wide transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#A7E22E] text-slate-950 shadow-3xs hover:opacity-95' 
                          : 'bg-slate-50 md:bg-transparent text-slate-650 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-2.5">
                        <Icon className={`h-4 w-4 md:h-4.5 md:w-4.5 stroke-[2] ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{navItem.label}</span>
                      </div>
                      {navItem.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-black tracking-none ${
                          isActive ? 'bg-slate-950 text-[#A7E22E]' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {navItem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Mobile Log Out inside nav */}
                <button
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="md:hidden shrink-0 snap-start flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{isSubmitting ? '...' : 'Sign Out'}</span>
                </button>
              </nav>
            </div>

            {/* Log out at bottom */}
            <div className="hidden md:block pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                disabled={isSubmitting}
                className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 stroke-[2] text-rose-500" />
                <span>{isSubmitting ? '...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL CARD */}
          <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-y-auto h-full flex flex-col justify-between relative">
              <div>
                <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight uppercase">
                    {accountTab === 'profile' && '👤 Profile Details'}
                    {accountTab === 'orders' && '📦 My Orders'}
                    {accountTab === 'wishlist' && '❤️ Wishlist'}
                    {accountTab === 'addresses' && '📍 Address Book'}
                    {accountTab === 'settings' && '🔒 Account Settings'}
                  </h3>
                  {!user.email && (
                    <span className="font-mono text-[9px] font-bold text-slate-400 tracking-wider">
                      SIMULATED
                    </span>
                  )}
                </div>

                {/* ERROR AND SUCCESS NOTIFICATIONS */}
                {errorText && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[11px] font-bold mb-4 select-text animate-fade-in text-left">
                    ⚠️ {errorText}
                  </div>
                )}

                {/* PROFILE TAB */}
                {accountTab === 'profile' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    {profileSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-extrabold select-none">
                        ✓ {profileSuccess}
                      </div>
                    )}
                    
                    {/* PROFILE HEADER PHOTO PREVIEW */}
                    <div className="flex items-center gap-4 p-4 bg-[#A7E22E]/10 border border-[#A7E22E]/20 rounded-2xl">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt={profileName || 'Rider'} 
                          referrerPolicy="no-referrer"
                          className="h-16 w-16 rounded-full object-cover border-2 border-[#A7E22E] bg-slate-100"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-slate-950 text-[#A7E22E] border-2 border-[#A7E22E] font-sans text-xl font-black flex items-center justify-center shadow-md select-none">
                          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-sans text-sm font-black text-slate-800 uppercase tracking-wider">{profileName || 'Rider'}</h4>
                        <p className="font-mono text-[10px] text-slate-400 font-semibold">{user.email || 'Club Member'}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 font-sans mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-xs text-slate-800 placeholder-slate-400 font-medium shadow-3xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 font-sans mb-1.5">Phone Number (optional)</label>
                          <input
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="Phone number"
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-xs text-slate-800 placeholder-slate-400 font-medium shadow-3xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 font-sans mb-1.5">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={user.email || ''}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-400 cursor-not-allowed shadow-3xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 font-sans mb-1.5">Profile Photo</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left">
                          {profilePhoto ? (
                            <img 
                              src={profilePhoto} 
                              alt="Profile preview" 
                              referrerPolicy="no-referrer"
                              className="h-16 w-16 rounded-full object-cover border-2 border-[#A7E22E] bg-white shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-slate-950 text-[#A7E22E] border-2 border-[#A7E22E] font-sans text-xl font-black flex items-center justify-center shadow-md select-none shrink-0">
                              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="flex-1 text-center sm:text-left">
                            <p className="text-[11px] font-bold text-slate-700 mb-1">
                              {profilePhoto ? 'Change or remove your profile photo' : 'Upload a photo for your profile'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium mb-3">
                              Supports JPG, PNG or WebP. Max 1.5MB.
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingPhoto}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 text-[#A7E22E] hover:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                {isUploadingPhoto ? 'Uploading...' : 'Choose File'}
                              </button>
                              {profilePhoto && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProfilePhoto('');
                                    setProfileSuccess('Photo removed. Press "Save Changes" to save permanently.');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 text-[#A7E22E] hover:bg-slate-900 py-3 px-6 text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Save className="h-4 w-4 shrink-0" />
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>

                    {/* Saved Addresses Summary */}
                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saved Addresses</h4>
                        <button
                          onClick={() => setAccountTab('addresses')}
                          className="text-[10px] font-black text-[#5F6D50] hover:text-slate-900 uppercase underline cursor-pointer"
                        >
                          Manage Addresses &rarr;
                        </button>
                      </div>
                      {addresses.length === 0 ? (
                        <p className="text-xs text-slate-500 font-medium">No saved addresses yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {addresses.map((addr) => (
                            <div key={addr.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">
                                  {addr.label}
                                </span>
                                {addr.isDefault && (
                                  <span className="bg-[#A7E22E]/20 text-[#3d5122] font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-slate-700 leading-snug">
                                {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ORDERS TAB */}
                {accountTab === 'orders' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    {isFetchingOrders ? (
                      <div className="flex flex-col items-center justify-center py-16 animate-pulse">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#A7E22E] border-t-transparent mb-2" />
                        <p className="font-sans text-[11px] text-slate-400">Fetching order ledger...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-slate-50/70 rounded-xl p-8 text-center border border-dashed border-slate-200">
                        <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                        <p className="font-sans text-xs text-slate-700 font-bold">You haven't placed any orders yet.</p>
                        <p className="font-sans text-[11px] text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
                          Did you add products to your cart? Adding products to your Cart does not create an order automatically. Open your <strong>Shopping Bag</strong> to complete the checkout and payment process to place your order!
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => {
                              setAccountOpen(false);
                              setCartOpen(true);
                            }}
                            className="bg-slate-950 hover:bg-slate-900 text-[#A7E22E] text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                          >
                            Open Cart Bag &rarr;
                          </button>
                          <button
                            onClick={() => {
                              setAccountOpen(false);
                              setActivePage('home');
                              setTimeout(() => {
                                const bikesSec = document.getElementById('our-bikes');
                                if (bikesSec) bikesSec.scrollIntoView({ behavior: 'smooth' });
                              }, 300);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Browse Bikes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[355px] overflow-y-auto pr-1">
                        {orders.map((order) => (
                          <div key={order.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs shadow-3xs hover:border-slate-250 transition-all select-text">
                            <div className="flex justify-between items-start mb-2.5">
                              <div>
                                <span className="font-mono text-[10px] text-slate-400 block font-semibold">ORDER ID: {order.orderId || order.id}</span>
                                <span className="font-sans text-[9px] text-slate-500 block">
                                  {order.createdAt?.seconds 
                                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                      })
                                    : 'Processing...'
                                  }
                                </span>
                              </div>
                              <span className="bg-[#A7E22E]/20 text-slate-800 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {order.status || 'placed'}
                              </span>
                            </div>

                            <div className="space-y-1.5 border-t border-slate-200/60 pt-2.5 mb-2.5">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-slate-600 font-semibold text-[11px]">
                                  <span className="truncate max-w-[280px]">{item.productName} ({item.selectedColor?.name}) x{item.quantity}</span>
                                  <span className="font-mono text-slate-800 flex-shrink-0">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-200">
                              <span className="font-extrabold text-slate-700 text-[11px]">Total Paid Amount</span>
                              <span className="font-mono font-black text-slate-900 text-sm">₹{order.finalTotal}</span>
                            </div>

                            {order.paymentMethod && (
                              <div className="mt-2.5 p-2 bg-white border border-slate-150 rounded-lg text-[9px] text-slate-500 font-mono space-y-0.5 text-left">
                                <div className="flex justify-between">
                                  <span>Payment Method:</span>
                                  <span className="font-sans font-extrabold capitalize text-slate-800">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Status:</span>
                                  <span className="font-sans font-extrabold text-emerald-600">SUCCESS / PAID</span>
                                </div>
                                {order.transactionId && (
                                  <div className="flex justify-between">
                                    <span>Transaction ID:</span>
                                    <span className="font-semibold text-slate-800 truncate max-w-[250px]">{order.transactionId}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* WISHLIST TAB */}
                {accountTab === 'wishlist' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    {wishlist.length === 0 ? (
                      <div className="bg-slate-50/70 rounded-xl p-8 text-center border border-dashed border-slate-200">
                        <Heart className="h-8 w-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                        <p className="font-sans text-xs text-slate-700 font-bold">Your wishlist is empty.</p>
                        <p className="font-sans text-[11px] text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
                          Want to save a product for later? Click the ❤️ <strong>Heart icon</strong> on any bike card while browsing our collection to add it to your wishlist!
                        </p>
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            setActivePage('home');
                            setTimeout(() => {
                              const bikesSec = document.getElementById('our-bikes');
                              if (bikesSec) bikesSec.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          className="bg-slate-950 hover:bg-slate-900 text-[#A7E22E] text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer mt-4"
                        >
                          Browse Bikes &rarr;
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[355px] overflow-y-auto pr-1">
                        {bikes.filter(bike => wishlist.includes(bike.id)).map((bike) => (
                          <div key={bike.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl shadow-3xs hover:border-slate-250 transition-all flex flex-col justify-between">
                            <div className="flex gap-3">
                              <div className="h-16 w-20 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                <img 
                                  src={bike.colors?.[0]?.imageUrl || bike.imageUrl || "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7"} 
                                  alt={bike.name} 
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-display text-xs font-black text-slate-900 truncate uppercase">{bike.name}</h4>
                                <p className="font-mono text-xs font-bold text-slate-700 mt-1">₹{bike.price}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3.5 border-t border-slate-200/50 pt-3">
                              <button
                                onClick={() => {
                                  addToCart(bike, bike.colors[0]);
                                  setCartOpen(true);
                                }}
                                className="flex-1 bg-slate-950 text-white hover:bg-slate-850 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                              >
                                Add To Bag
                              </button>
                              <button
                                onClick={() => toggleWishlist(bike.id)}
                                className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                                title="Remove from Wishlist"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ADDRESSES TAB */}
                {accountTab === 'addresses' && (
                  <div className="space-y-5 animate-fade-in text-left">
                    {addressSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-extrabold select-none animate-fade-in">
                        ✓ {addressSuccess}
                      </div>
                    )}
                    {addressError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[11px] font-extrabold select-none animate-fade-in">
                        ⚠️ {addressError}
                      </div>
                    )}

                    {/* ADDRESS FORM (IF ADDING/EDITING) OR ADDRESS LIST */}
                    {editingAddressId !== null || addresses.length === 0 || editingAddressId === 'new' ? (
                      <div className="p-3 sm:p-4 bg-slate-50 border border-slate-150 rounded-xl select-text">
                        <h4 className="font-display text-xs font-black uppercase text-slate-800 tracking-wide mb-2 sm:mb-3">
                          {editingAddressId && editingAddressId !== 'new' ? '📝 Edit Address' : '📍 Add New Address'}
                        </h4>
                        <form onSubmit={handleSaveAddress} className="space-y-2.5 sm:space-y-3.5">
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Label</label>
                              <select
                                value={addressLabel}
                                onChange={(e) => setAddressLabel(e.target.value as any)}
                                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                              >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Pincode</label>
                              <input
                                type="text"
                                required
                                pattern="[0-9]{6}"
                                maxLength={6}
                                value={addressPincode}
                                onChange={(e) => setAddressPincode(e.target.value.replace(/\D/g, ''))}
                                placeholder="6-digit pincode"
                                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Street Address</label>
                            <textarea
                              required
                              rows={2}
                              value={addressStreet}
                              onChange={(e) => setAddressStreet(e.target.value)}
                              placeholder="Flat/House no., Building name, Street/Area"
                              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 resize-none leading-snug"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">City</label>
                              <input
                                type="text"
                                required
                                value={addressCity}
                                onChange={(e) => setAddressCity(e.target.value)}
                                placeholder="e.g. Mumbai"
                                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">State</label>
                              <input
                                type="text"
                                required
                                value={addressState}
                                onChange={(e) => setAddressState(e.target.value)}
                                placeholder="e.g. Maharashtra"
                                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1 sm:pt-1.5">
                            <button
                              type="submit"
                              disabled={isSavingAddress}
                              className="flex items-center gap-1 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-950 text-[#A7E22E] hover:bg-slate-900 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                            >
                              <Save className="h-3.5 w-3.5 shrink-0" />
                              {isSavingAddress ? 'Saving...' : 'Save Address'}
                            </button>
                            {addresses.length > 0 && (
                              <button
                                type="button"
                                onClick={resetAddressForm}
                                className="px-3.5 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg text-[11px] sm:text-xs font-bold uppercase transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-3 md:max-h-[350px] md:overflow-y-auto pr-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">SAVED ADDRESSES</span>
                          <button
                            type="button"
                            onClick={() => {
                              resetAddressForm();
                              setEditingAddressId('new');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-800 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[3.5]" />
                            Add New
                          </button>
                        </div>
                        {addresses.map((addr) => (
                          <div key={addr.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl relative hover:border-slate-250 transition-all select-text">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="bg-[#A7E22E]/20 text-[#3d5122] font-extrabold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider flex items-center gap-1">
                                  <Check className="h-3 w-3 stroke-[3]" /> Default
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-700 text-xs tracking-wide leading-relaxed">
                              {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            
                            <div className="flex gap-3 mt-3 border-t border-slate-200/50 pt-2.5">
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[10px] font-black text-[#5F6D50] hover:text-slate-900 uppercase cursor-pointer"
                                >
                                  Make Default
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingAddressId(addr.id);
                                  setAddressLabel(addr.label);
                                  setAddressPincode(addr.pincode);
                                  setAddressStreet(addr.streetAddress);
                                  setAddressCity(addr.city);
                                  setAddressState(addr.state);
                                }}
                                className="text-[10px] font-black text-slate-500 hover:text-slate-800 uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="h-3 w-3" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase flex items-center gap-1 cursor-pointer"
                              >
                                <Trash className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ACCOUNT SETTINGS / PASSWORD TAB */}
                {accountTab === 'settings' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    {passwordSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[11px] font-extrabold select-none">
                        ✓ {passwordSuccess}
                      </div>
                    )}
                    {passwordError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[11px] font-extrabold select-none">
                        ⚠️ {passwordError}
                      </div>
                    )}
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans mb-1.5">Current Password</label>
                        <input
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-3xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans mb-1.5">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-3xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-3xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 text-[#A7E22E] hover:bg-slate-900 py-3 px-6 text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Lock className="h-4 w-4 shrink-0" />
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="text-center select-text border-t border-slate-100 pt-4 mt-6">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed tracking-wider uppercase">
                  Balanza Riders Club • Secure Persistent Profile Engine
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             LOGGED-OUT SIGN-IN / REGISTER VIEW
             ======================================================== */
          <div 
            id="login-modal-box"
            className="relative w-full max-w-[700px] min-h-[420px] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-500 scale-100 z-10"
          >
            {/* Left Side: Solid Branded Flat Lime-Green Segment to match image */}
            <div className="w-full md:w-[42%] bg-[#A7E22E] p-8 flex flex-col items-center justify-center text-center relative select-none min-h-[140px] md:min-h-0">
              <div className="flex flex-col items-center justify-center">
                {/* Balanza horizontal Logo (with fixed crisp height for proper scaling) */}
                <BalanzaLogo className="h-14 md:h-16 w-auto text-slate-950 font-black drop-shadow-xs" showIcon={true} />
              </div>
            </div>

            {/* Right Side: Gokwik-style Login Container */}
            <div className="w-full md:w-[58%] bg-white p-6 md:p-9 flex flex-col justify-between relative text-left min-h-[380px] md:min-h-0">
              
              {/* Close Modal Handle */}
              <button
                onClick={() => setAccountOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer z-20"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              {isSuccess ? (
                /* Successful Login State Layout */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="h-14 w-14 bg-[#A7E22E]/15 rounded-full flex items-center justify-center text-[#5F6D50] mb-4 animate-bounce">
                    <Check className="h-7 w-7 stroke-[3]" />
                  </div>
                  <h3 className="font-display text-base font-black text-slate-900 mb-1 uppercase tracking-wider">
                    Welcome to Balanza!
                  </h3>
                  <p className="font-sans text-xs text-slate-500 max-w-xs leading-relaxed">
                    Log in and authentication successful. Redirecting you to your balance bike club membership.
                  </p>
                </div>
              ) : (
                /* Main Enter Auth Section (Email Form & Google Sign In) */
                <div className="flex-1 flex flex-col justify-center py-1">
                  <div>
                    {/* Header Section: Elegantly designed matching the uploaded visual mockup */}
                    <div className="text-center mb-6">
                      <h3 className="font-sans text-2xl md:text-[27px] font-extrabold text-[#0D1321] tracking-wider uppercase leading-none">
                        {isRegistering ? "Welcome to\u00A0Balanza" : "WELCOME BACK"}
                      </h3>
                      <p className="font-sans text-xs text-slate-500 mt-2 font-medium">
                        {isRegistering ? "Join the Balanza Riders" : "Sign in to your account"}
                      </p>
                    </div>

                    {isPopupBlocked ? (
                      <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-slate-800 text-xs font-medium space-y-3 shadow-3xs">
                        <p className="font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          ⚠️ Popup Blocked / Sandbox Frame Limit
                        </p>
                        <p className="leading-relaxed">
                          Because this app is running in the AI Studio preview iframe, your browser blocked the authentication popup.
                        </p>
                        <div className="flex flex-col gap-2 pt-1">
                          <a 
                            href={window.location.href} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0E131F] text-white rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition-all text-center"
                          >
                            🚀 Open in New Browser Tab
                          </a>
                          <button
                            type="button"
                            onClick={() => setIsPopupBlocked(false)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:border-slate-400 uppercase tracking-wider transition-all"
                          >
                            Dismiss / Try Again
                          </button>
                        </div>
                      </div>
                    ) : errorText ? (
                      <p className="text-xs text-rose-500 font-bold mb-4 text-center animate-pulse leading-snug">
                        {errorText}
                      </p>
                    ) : null}

                    {/* Form: Direct clean inputs with standard placeholders & spacing matching the screenshot */}
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-sm transition-colors text-slate-800 placeholder-slate-400 font-medium shadow-3xs"
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none text-sm transition-colors text-slate-800 placeholder-slate-400 font-medium shadow-3xs"
                        />
                      </div>

                      {/* Toggle offers option option in registration mode */}
                      {isRegistering && (
                        <div className="flex items-center gap-2 py-0.5 text-[11px] font-semibold text-slate-500 select-none">
                          <input
                            type="checkbox"
                            id="consent-offers-email"
                            checked={notifyConsent}
                            onChange={(e) => setNotifyConsent(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-slate-800 h-3.5 w-3.5 accent-slate-900 cursor-pointer"
                          />
                          <label htmlFor="consent-offers-email" className="leading-none cursor-pointer">
                            Receive updates &amp; offers
                          </label>
                        </div>
                      )}

                      {/* LOGIN Button: Bold, big, dark navy/charcoal styling exactly matching the screenshot */}
                      <button
                        type="submit"
                        disabled={!email || password.length < 6 || isSubmitting}
                        className={`w-full text-center rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                          email && password.length >= 6 && !isSubmitting
                            ? 'bg-[#0E131F] hover:bg-slate-800 text-white shadow-sm hover:shadow active:scale-[0.98]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? 'Authenticating...' : isRegistering ? 'Sign Up' : 'LOGIN'}
                      </button>
                    </form>

                    {/* Divider exactly as in the mock image */}
                    <div className="relative my-4 flex items-center justify-center select-none">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        or
                      </span>
                    </div>

                    {/* Continue with Google button as in the mock image */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer shadow-3xs"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="font-sans font-semibold text-[13px] text-slate-700">Continue with Google</span>
                    </button>

                    {unauthorizedDomain && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl font-sans text-[11px] text-slate-700 space-y-2 max-h-[190px] overflow-y-auto shadow-2xs">
                        <p className="font-extrabold text-[10px] text-amber-800 uppercase tracking-wider flex items-center gap-1.5 select-none font-sans">
                          <span>🛠️</span> Authorize Domain in Firebase
                        </p>
                        <p className="leading-relaxed text-slate-600">
                          Firebase Authentication restricts Google Popups to authorized domains. To enable this, add this domain to the authorized list in the Firebase console:
                        </p>
                        <div className="flex items-center justify-between gap-1 bg-white border border-slate-200 rounded-lg p-2 font-mono text-[10px] text-slate-800 select-all font-semibold">
                          <span className="truncate">{unauthorizedDomain}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              navigator.clipboard.writeText(unauthorizedDomain);
                            }}
                            className="bg-slate-100 px-2 py-0.5 rounded text-[9px] hover:bg-slate-200 select-none text-slate-600 font-sans font-bold cursor-pointer transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle Account Action: Don't have an account? Sign Up option */}
                  <div className="mt-5 text-center text-xs text-slate-500 font-medium select-none font-sans">
                    {isRegistering ? (
                      <>
                        <span>Already have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegistering(false);
                            setErrorText('');
                          }}
                          className="text-slate-600 hover:text-slate-900 font-extrabold underline cursor-pointer"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        <span>Don't have an account? </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegistering(true);
                            setErrorText('');
                          }}
                          className="text-slate-600 hover:text-slate-900 font-extrabold underline cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

    </div>
  );
}
