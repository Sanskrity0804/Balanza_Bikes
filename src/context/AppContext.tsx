// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   onAuthStateChanged, 
//   signInAnonymously, 
//   signOut,
//   User as FirebaseUser
// } from 'firebase/auth';
// import { 
//   doc, 
//   setDoc, 
//   collection, 
//   query, 
//   where, 
//   onSnapshot, 
//   serverTimestamp 
// } from 'firebase/firestore';
// import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
// import { BikeProduct, CartItem, BikeColor, BlogPost, UISettings } from '../types';
// import { BIKES_DATA, BLOGS_DATA } from '../data';

// interface AppContextType {
//   cart: CartItem[];
//   addToCart: (product: BikeProduct, color: BikeColor) => void;
//   removeFromCart: (itemId: string) => void;
//   updateCartQuantity: (itemId: string, qty: number) => void;
//   clearCart: () => void;
  
//   wishlist: string[]; // list of bike ids
//   toggleWishlist: (bikeId: string) => void;
  
//   isCartOpen: boolean;
//   setCartOpen: (open: boolean) => void;
  
//   isMenuOpen: boolean;
//   setMenuOpen: (open: boolean) => void;
  
//   isSearchOpen: boolean;
//   setSearchOpen: (open: boolean) => void;
  
//   selectedQuickView: BikeProduct | null;
//   setSelectedQuickView: (product: BikeProduct | null) => void;
  
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;

//   isAccountOpen: boolean;
//   setAccountOpen: (open: boolean) => void;
  
//   accountTab: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';
//   setAccountTab: (tab: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings') => void;
  
//   isAdminOpen: boolean;
//   setAdminOpen: (open: boolean) => void;

//   isAdminAuthorized: boolean;
//   setIsAdminAuthorized: (authorized: boolean) => void;

//   // Firebase auth & orders integrations
//   user: any;
//   setUser: (user: any) => void;
//   isAuthLoading: boolean;
//   logOut: () => Promise<void>;
//   orders: any[];
//   isFetchingOrders: boolean;
//   placeOrder: (
//     subtotal: number, 
//     discount: number, 
//     total: number, 
//     paymentDetails?: { 
//       paymentMethod: string; 
//       transactionId: string; 
//       detailsSummary: string; 
//       status?: string;
//     },
//     checkoutDetails?: {
//       customerDetails: any;
//       shippingAddress: any;
//       billingAddress: any;
//     }
//   ) => Promise<string>;
//   submitNewsletter: (email: string) => Promise<void>;
//   signInSimulated: (phoneNumber: string, notifyConsent: boolean) => void;
//   signInNodeUser: (userPayload: any) => void;
//   bikes: BikeProduct[];
//   addBike: (bike: BikeProduct) => Promise<void>;
//   updateBike: (bike: BikeProduct) => Promise<void>;
//   deleteBike: (bikeId: string) => Promise<void>;
//   blogs: BlogPost[];
//   addBlog: (blog: BlogPost) => Promise<void>;
//   updateBlog: (blog: BlogPost) => Promise<void>;
//   deleteBlog: (blogId: string) => Promise<void>;
//   activePage: 'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success';
//   setActivePage: (page: 'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success') => void;
//   selectedBlogPost: BlogPost | null;
//   setSelectedBlogPost: (post: BlogPost | null) => void;
//   uiSettings: UISettings;
//   updateUISettings: (settings: UISettings) => Promise<void>;
//   isInfoModalOpen: boolean;
//   setInfoModalOpen: (open: boolean) => void;
//   infoModalTab: 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms';
//   setInfoModalTab: (tab: 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms') => void;
// }

// const DEFAULT_UI_SETTINGS: UISettings = {
//   announcementText: "Built for Balance. Made for Confidence.",
//   announcementMoving: true,
//   heroTitle: "Built for Little Explorers",
//   heroSubtitle: "Premium balance bikes designed to help children develop balance, coordination, and confidence naturally.",
//   heroHighlightText: "Little Explorers",
//   heroImages: [
//     '/images/bike_explorer_olive_1779786711803.png',
//     '/images/bike_vintage_lilac_1779792037270.png',
//     '/images/bike_neo_black_1779786755416.png'
//   ],
//   whyBalanzaTitle: "Why Balance Bikes?",
//   whyBalanzaVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   features: [
//     { title: 'Lightweight Frame', desc: 'Easy to handle', iconName: 'Feather' },
//     { title: 'Child-Safe Design', desc: 'Rounded edges & non-toxic paint', iconName: 'ShieldAlert' },
//     { title: 'Easy Assembly', desc: 'Tool-free setup in minutes', iconName: 'Wrench' },
//     { title: 'Premium Materials', desc: 'Built to last, made to care', iconName: 'Award' },
//     { title: 'Built for Growth', desc: 'Supports every step of their journey', iconName: 'LineChart' },
//   ],
//   instagramTitle: "Loved by Parents. Adored by Kids."
// };

// const AppContext = createContext<AppContextType | undefined>(undefined);

// const mapDefaultBlogImages = (posts: BlogPost[]) => {
//   return posts.map(b => {
//     if (b.id === 'balanza-mini-birthday-gift') {
//       return { ...b, imageUrl: '/images/Blog1.jpeg' };
//     }
//     if (b.id === 'why-every-kid-needs-balance-bike') {
//       return { ...b, imageUrl: '/images/Blog2.jpeg' };
//     }
//     return b;
//   });
// };

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // Firebase integration states
//   const [user, setUser] = useState<any>(null);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [isFetchingOrders, setIsFetchingOrders] = useState(false);

//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [wishlist, setWishlist] = useState<string[]>([]);
//   const [isCartOpen, setCartOpen] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [isSearchOpen, setSearchOpen] = useState(false);
//   const [selectedQuickView, setSelectedQuickView] = useState<BikeProduct | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAccountOpen, setAccountOpen] = useState(false);
//   const [accountTab, setAccountTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');
//   const [isAdminOpen, setAdminOpen] = useState(false);
//   const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
//     return localStorage.getItem('balanza_admin_authorized') === 'true';
//   });
//   const [activePage, setActivePage] = useState<'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success'>(() => {
//     if (typeof window === 'undefined') return 'home';
//     const path = window.location.pathname;
//     if (path === '/blogs' || path === '/blogs/') return 'blogs';
//     if (path === '/contact' || path === '/contact/') return 'contact';
//     if (path === '/story' || path === '/story/') return 'story';
//     if (path === '/assembly' || path === '/assembly/') return 'assembly';
//     if (path === '/faqs' || path === '/faqs/') return 'faqs';
//     if (path === '/privacy' || path === '/privacy/') return 'privacy';
//     if (path === '/terms' || path === '/terms/') return 'terms';
//     if (path === '/shipping' || path === '/shipping/') return 'shipping';
//     if (path === '/returns' || path === '/returns/') return 'returns';
//     if (path === '/checkout' || path === '/checkout/') return 'checkout';
//     if (path === '/order-success' || path === '/order-success/') return 'order-success';
//     return 'home';
//   });
//   const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
//   const [isInfoModalOpen, setInfoModalOpen] = useState(false);
//   const [infoModalTab, setInfoModalTab] = useState<'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms'>('faqs');

//   const [uiSettings, setUiSettings] = useState<UISettings>(() => {
//     const local = localStorage.getItem('balanza_ui_config');
//     if (local) {
//       try { 
//         const parsed = JSON.parse(local); 
//         if (parsed.announcementText === "built for balance. made for confidence. click to learn why." || !parsed.announcementText) {
//           parsed.announcementText = "Built for Balance. Made for Confidence.";
//           parsed.announcementMoving = true;
//           localStorage.setItem('balanza_ui_config', JSON.stringify(parsed));
//         }
//         return parsed;
//       } catch (e) { console.error(e); }
//     }
//     return DEFAULT_UI_SETTINGS;
//   });

//   useEffect(() => {
//     try {
//       const docRef = doc(db, 'settings', 'ui_config');
//       const unsubscribe = onSnapshot(docRef, (docSnap) => {
//         if (docSnap.exists()) {
//           try {
//             const fetched = docSnap.data() as UISettings;
//             const merged = { ...DEFAULT_UI_SETTINGS, ...fetched };
//             setUiSettings(merged);
//             localStorage.setItem('balanza_ui_config', JSON.stringify(merged));
//           } catch (e) {
//             console.error("[AppContext] Error setting ui_config:", e);
//           }
//         }
//       }, (error) => {
//         console.warn("[AppContext] Real-time settings sync failed, falling back to cache:", error);
//       });
//       return () => unsubscribe();
//     } catch (e) {
//       console.warn("Settings subscription error:", e);
//     }
//   }, []);

//   const updateUISettings = async (newSettings: UISettings) => {
//     setUiSettings(newSettings);
//     localStorage.setItem('balanza_ui_config', JSON.stringify(newSettings));
//     try {
//       const response = await fetch('/api/settings', {
//         method: 'POST',
//         headers: getAdminAuthHeaders(),
//         body: JSON.stringify(newSettings)
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully updated UI CMS settings via Node API");
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend updateUISettings failed, trying Firestore route:", err);
//     }
//     try {
//       const { setDoc, doc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'settings', 'ui_config'), newSettings);
//       console.log("[AppContext] Successfully updated UI settings in Firestore");
//     } catch (err) {
//       console.warn("[AppContext] Firestore updateUISettings failed:", err);
//     }
//   };

//   // Dynamic Bikes List State with robust Firestore real-time synchronization and instant offline defaults
//   const [bikes, setBikes] = useState<BikeProduct[]>(() => {
//     const cached = localStorage.getItem('balanza_bikes');
//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           return parsed;
//         }
//       } catch (e) { /* silent */ }
//     }
//     return BIKES_DATA;
//   });

//   // Unified non-blocking Node API initialization for instant load speeds
//   useEffect(() => {
//     const initializeDataFromAPI = async () => {
//       try {
//         const response = await fetch('/api/settings');
//         if (response.ok) {
//           const settingsData = await response.json();
//           if (settingsData && typeof settingsData === 'object') {
//             const merged = { ...DEFAULT_UI_SETTINGS, ...settingsData };
//             setUiSettings(merged);
//             localStorage.setItem('balanza_ui_config', JSON.stringify(merged));
//           }
//         }
//       } catch (e) {
//         console.warn("[AppContext] Failed to load layout settings from API, using cached:", e);
//       }

//       try {
//         const response = await fetch('/api/products');
//         if (response.ok) {
//           const productsData = await response.json();
//           if (Array.isArray(productsData) && productsData.length > 0) {
//             setBikes(productsData);
//             localStorage.setItem('balanza_bikes', JSON.stringify(productsData));
//           }
//         }
//       } catch (e) {
//         console.warn("[AppContext] Failed to load products from API, using cached:", e);
//       }

//       try {
//         const response = await fetch('/api/blogs');
//         if (response.ok) {
//           const blogsData = await response.json();
//           if (Array.isArray(blogsData) && blogsData.length > 0) {
//             const updated = mapDefaultBlogImages(blogsData);
//             setBlogs(updated);
//             localStorage.setItem('balanza_blogs', JSON.stringify(updated));
//           }
//         }
//       } catch (e) {
//         console.warn("[AppContext] Failed to load blogs from API, using cached:", e);
//       }
//     };

//     initializeDataFromAPI();
//   }, []);

//   useEffect(() => {
//     try {
//       const q = collection(db, 'bikes');
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const bikesList: BikeProduct[] = [];
//         snapshot.forEach((docSnap) => {
//           bikesList.push({ id: docSnap.id, ...docSnap.data() } as BikeProduct);
//         });
        
//         if (bikesList.length > 0) {
//           setBikes(bikesList);
//           localStorage.setItem('balanza_bikes', JSON.stringify(bikesList));
//         }
//       }, (error) => {
//         console.warn("[AppContext] Real-time bikes sync failed, falling back to local cache:", error);
//       });
//       return () => unsubscribe();
//     } catch (e) {
//       console.warn("Bikes subscription error:", e);
//     }
//   }, []);

//   const getAdminAuthHeaders = () => {
//     const token = localStorage.getItem('balanza_admin_jwt');
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : ''
//     };
//   };

//   const addBike = async (bike: BikeProduct) => {
//     const updated = [...bikes, bike];
//     setBikes(updated);
//     localStorage.setItem('balanza_bikes', JSON.stringify(updated));

//     try {
//       const response = await fetch('/api/products', {
//         method: 'POST',
//         headers: getAdminAuthHeaders(),
//         body: JSON.stringify(bike)
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully added bike via secure Backend Node API:", bike.id);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend addBike failed, trying Firestore route:", err);
//     }

//     try {
//       const { setDoc, doc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'bikes', bike.id), bike);
//       console.log("[AppContext] Successfully added bike to Firestore:", bike.id);
//     } catch (err) {
//       console.warn("[AppContext] Firestore addBike failed, saved locally:", err);
//     }
//   };

//   const updateBike = async (updatedBike: BikeProduct) => {
//     const updated = bikes.map(b => b.id === updatedBike.id ? updatedBike : b);
//     setBikes(updated);
//     localStorage.setItem('balanza_bikes', JSON.stringify(updated));

//     try {
//       const response = await fetch(`/api/products/${updatedBike.id}`, {
//         method: 'PUT',
//         headers: getAdminAuthHeaders(),
//         body: JSON.stringify(updatedBike)
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully updated bike via secure Backend Node API:", updatedBike.id);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend updateBike failed, trying Firestore route:", err);
//     }

//     try {
//       const { setDoc, doc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'bikes', updatedBike.id), updatedBike);
//       console.log("[AppContext] Successfully updated bike in Firestore:", updatedBike.id);
//     } catch (err) {
//       console.warn("[AppContext] Firestore updateBike failed, saved locally:", err);
//     }
//   };

//   const deleteBike = async (bikeId: string) => {
//     const updated = bikes.filter(b => b.id !== bikeId);
//     setBikes(updated);
//     localStorage.setItem('balanza_bikes', JSON.stringify(updated));

//     try {
//       const response = await fetch(`/api/products/${bikeId}`, {
//         method: 'DELETE',
//         headers: getAdminAuthHeaders()
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully deleted bike via secure Backend Node API:", bikeId);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend deleteBike failed, trying Firestore route:", err);
//     }

//     try {
//       const { deleteDoc, doc } = await import('firebase/firestore');
//       await deleteDoc(doc(db, 'bikes', bikeId));
//       console.log("[AppContext] Successfully deleted bike from Firestore:", bikeId);
//     } catch (err) {
//       console.warn("[AppContext] Firestore deleteBike failed, saved locally:", err);
//     }
//   };

//   // Dynamic Blogs List State with robust Firestore real-time synchronization and instant offline defaults
//   const [blogs, setBlogs] = useState<BlogPost[]>(() => {
//     const cached = localStorage.getItem('balanza_blogs');
//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           return mapDefaultBlogImages(parsed);
//         }
//       } catch (e) { /* silent */ }
//     }
//     return mapDefaultBlogImages(BLOGS_DATA);
//   });

//   useEffect(() => {
//     try {
//       const q = collection(db, 'blogs');
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const blogsList: BlogPost[] = [];
//         snapshot.forEach((docSnap) => {
//           blogsList.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
//         });
        
//         if (blogsList.length > 0) {
//           const updated = mapDefaultBlogImages(blogsList);
//           setBlogs(updated);
//           localStorage.setItem('balanza_blogs', JSON.stringify(updated));
//         }
//       }, (error) => {
//         console.warn("[AppContext] Real-time blogs sync failed, falling back to local cache:", error);
//       });
//       return () => unsubscribe();
//     } catch (e) {
//       console.warn("Blogs subscription error:", e);
//     }
//   }, []);

//   const addBlog = async (blog: BlogPost) => {
//     const updated = [...blogs, blog];
//     setBlogs(updated);
//     localStorage.setItem('balanza_blogs', JSON.stringify(updated));

//     try {
//       const response = await fetch('/api/blogs', {
//         method: 'POST',
//         headers: getAdminAuthHeaders(),
//         body: JSON.stringify(blog)
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully added blog via secure Backend Node API:", blog.id);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend addBlog failed, trying Firestore route:", err);
//     }

//     try {
//       const { setDoc, doc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'blogs', blog.id), blog);
//       console.log("[AppContext] Successfully added blog to Firestore:", blog.id);
//     } catch (err) {
//       console.warn("[AppContext] Firestore addBlog failed, saved locally:", err);
//     }
//   };

//   const updateBlog = async (updatedBlog: BlogPost) => {
//     const updated = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
//     setBlogs(updated);
//     localStorage.setItem('balanza_blogs', JSON.stringify(updated));

//     try {
//       const response = await fetch(`/api/blogs/${updatedBlog.id}`, {
//         method: 'PUT',
//         headers: getAdminAuthHeaders(),
//         body: JSON.stringify(updatedBlog)
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully updated blog via secure Backend Node API:", updatedBlog.id);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend updateBlog failed, trying Firestore route:", err);
//     }

//     try {
//       const { setDoc, doc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'blogs', updatedBlog.id), updatedBlog);
//       console.log("[AppContext] Successfully updated blog in Firestore:", updatedBlog.id);
//     } catch (err) {
//       console.warn("[AppContext] Firestore updateBlog failed, saved locally:", err);
//     }
//   };

//   const deleteBlog = async (blogId: string) => {
//     const updated = blogs.filter(b => b.id !== blogId);
//     setBlogs(updated);
//     localStorage.setItem('balanza_blogs', JSON.stringify(updated));

//     try {
//       const response = await fetch(`/api/blogs/${blogId}`, {
//         method: 'DELETE',
//         headers: getAdminAuthHeaders()
//       });
//       if (response.ok) {
//         console.log("[AppContext] Successfully deleted blog via secure Backend Node API:", blogId);
//         return;
//       }
//     } catch (err) {
//       console.warn("[AppContext] Backend deleteBlog failed, trying Firestore route:", err);
//     }

//     try {
//       const { deleteDoc, doc } = await import('firebase/firestore');
//       await deleteDoc(doc(db, 'blogs', blogId));
//       console.log("[AppContext] Successfully deleted blog from Firestore:", blogId);
//     } catch (err) {
//       console.warn("[AppContext] Firestore deleteBlog failed, saved locally:", err);
//     }
//   };

//   // Synchronize cart with logged-in user session or local guest cache
//   useEffect(() => {
//     const syncUserCart = async () => {
//       if (!user) {
//         const savedGuestCart = localStorage.getItem('balanza_guest_cart');
//         if (savedGuestCart) {
//           try { setCart(JSON.parse(savedGuestCart)); } catch { setCart([]); }
//         } else {
//           setCart([]);
//         }
//         return;
//       }

//       try {
//         let dbCartItems: CartItem[] = [];
//         const response = await fetch(`/api/cart?userId=${user.uid}`);
//         if (response.ok) {
//           dbCartItems = await response.json();
//         }

//         const currentGuestCart = localStorage.getItem('balanza_guest_cart');
//         if (currentGuestCart) {
//           try {
//             const guestItems = JSON.parse(currentGuestCart);
//             if (guestItems.length > 0) {
//               const combinedMap = new Map<string, CartItem>();
//               dbCartItems.forEach(item => combinedMap.set(item.id, item));
              
//               guestItems.forEach((item: CartItem) => {
//                 if (combinedMap.has(item.id)) {
//                   const existing = combinedMap.get(item.id)!;
//                   combinedMap.set(item.id, {
//                     ...existing,
//                     quantity: existing.quantity + item.quantity
//                   });
//                 } else {
//                   combinedMap.set(item.id, item);
//                 }
//               });

//               dbCartItems = Array.from(combinedMap.values());
//               localStorage.removeItem('balanza_guest_cart');
//             }
//           } catch (e) {
//             console.error("Cart merge error: ", e);
//           }
//         }

//         setCart(dbCartItems);
//       } catch (err) {
//         console.warn("[Cart Isolation] Failed to load synchronized cart, falling back to local user key: ", err);
//         const userSavedCart = localStorage.getItem(`balanza_cart_${user.uid}`);
//         if (userSavedCart) {
//           try { setCart(JSON.parse(userSavedCart)); } catch { setCart([]); }
//         } else {
//           setCart([]);
//         }
//       }
//     };

//     syncUserCart();
//   }, [user]);

//   // Synchronize cart mutations back to the backend and local disk
//   useEffect(() => {
//     if (!user) {
//       localStorage.setItem('balanza_guest_cart', JSON.stringify(cart));
//       return;
//     }

//     localStorage.setItem(`balanza_cart_${user.uid}`, JSON.stringify(cart));

//     const pushCart = async () => {
//       try {
//         await fetch('/api/cart', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId: user.uid, items: cart })
//         });
//       } catch (err) {
//         console.warn("[Cart Isolation] Database upload bypassed/failed, saved locally:", err);
//       }
//     };

//     const timer = setTimeout(pushCart, 400);
//     return () => clearTimeout(timer);
//   }, [cart, user]);

//   // Synchronized Wishlist with Firebase and Local Storage
//   useEffect(() => {
//     const syncWishlist = async () => {
//       if (!user) {
//         const savedWish = localStorage.getItem('balanza_wishlist');
//         if (savedWish) {
//           try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
//         } else {
//           setWishlist([]);
//         }
//         return;
//       }

//       if (user.isSimulated) {
//         const savedWish = localStorage.getItem(`balanza_wishlist_${user.uid}`);
//         if (savedWish) {
//           try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
//         } else {
//           setWishlist([]);
//         }
//         return;
//       }

//       try {
//         const { doc, getDoc, setDoc } = await import('firebase/firestore');
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDocSnap = await getDoc(userDocRef);
//         let cloudWishlist: string[] = [];
        
//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           if (userData && Array.isArray(userData.wishlist)) {
//             cloudWishlist = userData.wishlist;
//           }
//         }

//         // Merge guest wishlist
//         const currentGuestWish = localStorage.getItem('balanza_wishlist');
//         let guestWishItems: string[] = [];
//         if (currentGuestWish) {
//           try {
//             guestWishItems = JSON.parse(currentGuestWish);
//           } catch {}
//         }

//         const mergedWishlist = Array.from(new Set([...cloudWishlist, ...guestWishItems]));
        
//         setWishlist(mergedWishlist);

//         // Save merged wishlist back to Firestore
//         await setDoc(userDocRef, { wishlist: mergedWishlist }, { merge: true });
        
//         // Clear guest wishlist
//         localStorage.removeItem('balanza_wishlist');
//       } catch (err) {
//         console.warn("[Wishlist Isolation] Cloud loading failed, falling back onto local user storage:", err);
//         const savedWish = localStorage.getItem(`balanza_wishlist_${user.uid}`);
//         if (savedWish) {
//           try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
//         }
//       }
//     };

//     syncWishlist();
//   }, [user]);

//   // Session Initialization Observer
//   useEffect(() => {
//     setIsAuthLoading(true);

//     // Initial check to seed the user state from localStorage cache if present before firebase responds
//     const savedBackendUser = localStorage.getItem('balanza_user');
//     const savedSimulatedUser = localStorage.getItem('balanza_simulated_user');
//     if (savedBackendUser) {
//       try {
//         setUser(JSON.parse(savedBackendUser));
//       } catch (err) {
//         console.error("Failed to parse cached Node user:", err);
//       }
//     } else if (savedSimulatedUser) {
//       try {
//         setUser(JSON.parse(savedSimulatedUser));
//       } catch (err) {
//         console.error("Failed to parse cached simulated user:", err);
//       }
//     }

//     // Always subscribe to Firebase Auth changes to detect real-time sign in / registration
//     const unsubscribe = onAuthStateChanged(auth, (currUser) => {
//       if (currUser) {
//         setUser(currUser);
//       } else {
//         // Only clear the user if there are no legacy active simulated or server sessions
//         const activeSimulated = localStorage.getItem('balanza_simulated_user');
//         const activeBackend = localStorage.getItem('balanza_user');
//         if (!activeSimulated && !activeBackend) {
//           setUser(null);
//         }
//       }
//       setIsAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch / Sync User Orders Ledger via Node.js Express Backend (Secure and Free)
//   useEffect(() => {
//     if (!user) {
//       setOrders([]);
//       setIsFetchingOrders(false);
//       return;
//     }

//     if (user.isSimulated) {
//       const savedLocalOrders = localStorage.getItem(`balanza_local_orders_${user.uid}`);
//       if (savedLocalOrders) {
//         try {
//           setOrders(JSON.parse(savedLocalOrders));
//         } catch (e) {
//           setOrders([]);
//         }
//       } else {
//         setOrders([]);
//       }
//       setIsFetchingOrders(false);
//       return;
//     }

//     let active = true;
//     const fetchOrders = async () => {
//       try {
//         let data: any[] = [];
//         const response = await fetch(`/api/orders?userId=${user.uid}`);
//         if (response.ok) {
//           data = await response.json();
//         }

//         if (active) {
//           data.sort((a, b) => {
//             const t1 = a.createdAt?.seconds || 0;
//             const t2 = b.createdAt?.seconds || 0;
//             return t2 - t1;
//           });
//           setOrders(data);
//         }
//       } catch (err) {
//         if (active) setOrders([]);
//       } finally {
//         if (active) {
//           setIsFetchingOrders(false);
//         }
//       }
//     };

//     setIsFetchingOrders(true);
//     fetchOrders();

//     // Poll orders every 10 seconds for real-time status updates without web sockets
//     const interval = setInterval(fetchOrders, 10000);

//     return () => {
//       active = false;
//       clearInterval(interval);
//     };
//   }, [user]);

//   const signInSimulated = (phoneNumber: string, notifyConsent: boolean) => {
//     const simulatedUser = {
//       uid: `local-sim-${Math.floor(100000 + Math.random() * 900000)}`,
//       phoneNumber: phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`,
//       isSimulated: true,
//       notifyConsent
//     };
//     localStorage.setItem('balanza_simulated_user', JSON.stringify(simulatedUser));
//     setUser(simulatedUser);
//   };

//   const signInNodeUser = (userPayload: any) => {
//     localStorage.setItem('balanza_user', JSON.stringify(userPayload));
//     setUser(userPayload);
//   };

//   const logOut = async () => {
//     try {
//       localStorage.removeItem('balanza_simulated_user');
//       localStorage.removeItem('balanza_user');
//       setUser(null);
//       await signOut(auth);
//     } catch (error) {
//       console.error('Firebase Auth Sign-Out exception:', error);
//       setUser(null);
//     }
//   };

//   // Secure checkout order placement backed securely by Node Express server database integrations
//   const placeOrder = async (
//     subtotal: number, 
//     discount: number, 
//     total: number,
//     paymentDetails?: { 
//       paymentMethod: string; 
//       transactionId: string; 
//       detailsSummary: string; 
//       status?: string;
//     },
//     checkoutDetails?: {
//       customerDetails: any;
//       shippingAddress: any;
//       billingAddress: any;
//     }
//   ): Promise<string> => {
//     if (!user) {
//       throw new Error('You must be registered to make purchase order receipts.');
//     }

//     const serializedItems = cart.map((item) => ({
//       id: item.id,
//       productName: item.product.name,
//       productId: item.product.id,
//       quantity: item.quantity,
//       price: item.price,
//       selectedColor: {
//         name: item.selectedColor.name,
//         value: item.selectedColor.value,
//         imageUrl: item.selectedColor.imageUrl
//       }
//     }));

//     const orderId = `BLZ-${Math.floor(100000 + Math.random() * 900000)}`;

//     const newOrderObj = {
//       orderId: orderId,
//       id: orderId,
//       userId: user.uid,
//       items: serializedItems,
//       itemsSubtotal: Math.round(subtotal),
//       discountAmount: Math.round(discount),
//       finalTotal: Math.round(total),
//       status: paymentDetails?.status || (paymentDetails ? 'paid' : 'placed'),
//       paymentMethod: paymentDetails?.paymentMethod || null,
//       transactionId: paymentDetails?.transactionId || null,
//       detailsSummary: paymentDetails?.detailsSummary || null,
//       customerDetails: checkoutDetails?.customerDetails || null,
//       shippingAddress: checkoutDetails?.shippingAddress || null,
//       billingAddress: checkoutDetails?.billingAddress || null,
//       createdAt: { seconds: Math.floor(Date.now() / 1000) }
//     };

//     if (user.isSimulated) {
//       const savedLocalOrders = localStorage.getItem(`balanza_local_orders_${user.uid}`);
//       let localList = [];
//       if (savedLocalOrders) {
//         try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
//       }
//       localList.unshift(newOrderObj);
//       localStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
//       setOrders(prev => [newOrderObj, ...prev]);
//       return orderId;
//     }

//     try {
//       // Direct Client-Side Firestore Order Storage
//       const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      
//       const firestoreOrderObj = {
//         ...newOrderObj,
//         createdAt: serverTimestamp() // real server timestamp needed for secure rules validation
//       };
      
//       await setDoc(doc(db, 'orders', orderId), firestoreOrderObj);
//       console.log("[Client] Saved order directly in client-side Firestore successfully");
      
//       setOrders(prev => [newOrderObj, ...prev]);
//       return orderId;
//     } catch (clientWriteErr) {
//       console.warn("[Client] Direct client Firestore write did not complete, falling back onto server pipelines:", clientWriteErr);
      
//       try {
//         // POST order payload directly to Node.js backend to bypass client write restrictions
//         const response = await fetch('/api/orders', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId: user.uid,
//             email: user?.email || '',
//             items: serializedItems,
//             itemsSubtotal: Math.round(subtotal),
//             discountAmount: Math.round(discount),
//             finalTotal: Math.round(total),
//             status: paymentDetails?.status || (paymentDetails ? 'paid' : 'placed'),
//             paymentMethod: paymentDetails?.paymentMethod || null,
//             transactionId: paymentDetails?.transactionId || null,
//             detailsSummary: paymentDetails?.detailsSummary || null,
//             customerDetails: checkoutDetails?.customerDetails || null,
//             shippingAddress: checkoutDetails?.shippingAddress || null,
//             billingAddress: checkoutDetails?.billingAddress || null
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to write order securely to Express backend registry");
//         }

//         const resJson = await response.json();
//         const confirmedOrderId = resJson.orderId || orderId;

//         const confirmedOrder = {
//           ...newOrderObj,
//           orderId: confirmedOrderId,
//           id: confirmedOrderId
//         };

//         setOrders(prev => [confirmedOrder, ...prev]);
//         return confirmedOrderId;
//       } catch (error) {
//         console.warn("Unable to save order to Node Backend. Saving to local storage profile:", error);
//         const savedLocalOrders = localStorage.getItem(`balanza_local_orders_${user.uid}`);
//         let localList = [];
//         if (savedLocalOrders) {
//           try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
//         }
//         localList.unshift(newOrderObj);
//         localStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
//         setOrders(prev => [newOrderObj, ...prev]);
//         return orderId;
//       }
//     }
//   };

//   // Newsletter submission with real Firebase SDK
//   const submitNewsletter = async (email: string) => {
//     const normalizedEmail = email.trim().toLowerCase();
//     if (!normalizedEmail) throw new Error("Email address is required.");

//     try {
//       const res = await fetch("/api/newsletter", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email: normalizedEmail })
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to submit subscription.");
//       }
//     } catch (err: any) {
//       console.error("Error subscribing to newsletter:", err);
//       throw new Error(err.message || "Failed to submit subscription.");
//     }
//   };

//   const addToCart = (product: BikeProduct, color: BikeColor) => {
//     const itemId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
//     setCart((prevCart) => {
//       const exists = prevCart.find((item) => item.id === itemId);
//       if (exists) {
//         return prevCart.map((item) =>
//           item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       } else {
//         return [
//           ...prevCart,
//           {
//             id: itemId,
//             product,
//             selectedColor: color,
//             quantity: 1,
//             price: product.basePrice,
//           },
//         ];
//       }
//     });
//     setCartOpen(true); // Open cart automatically when adding item
//   };

//   const removeFromCart = (itemId: string) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
//   };

//   const updateCartQuantity = (itemId: string, qty: number) => {
//     if (qty <= 0) {
//       removeFromCart(itemId);
//       return;
//     }
//     setCart((prevCart) =>
//       prevCart.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const toggleWishlist = async (bikeId: string) => {
//     let nextWishlist: string[] = [];
//     setWishlist((prev) => {
//       nextWishlist = prev.includes(bikeId) ? prev.filter((id) => id !== bikeId) : [...prev, bikeId];
//       return nextWishlist;
//     });

//     if (!user) {
//       localStorage.setItem('balanza_wishlist', JSON.stringify(nextWishlist));
//       return;
//     }

//     if (user.isSimulated) {
//       localStorage.setItem(`balanza_wishlist_${user.uid}`, JSON.stringify(nextWishlist));
//       return;
//     }

//     localStorage.setItem(`balanza_wishlist_${user.uid}`, JSON.stringify(nextWishlist));

//     try {
//       const { doc, setDoc } = await import('firebase/firestore');
//       await setDoc(doc(db, 'users', user.uid), { wishlist: nextWishlist }, { merge: true });
//     } catch (err) {
//       console.warn("[Wishlist Isolation] Cloud write failed, saved locally:", err);
//     }
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateCartQuantity,
//         clearCart,
//         wishlist,
//         toggleWishlist,
//         isCartOpen,
//         setCartOpen,
//         isMenuOpen,
//         setMenuOpen,
//         isSearchOpen,
//         setSearchOpen,
//         selectedQuickView,
//         setSelectedQuickView,
//         searchQuery,
//         setSearchQuery,
//         isAccountOpen,
//         setAccountOpen,
//         accountTab,
//         setAccountTab,
//         isAdminOpen,
//         setAdminOpen,
//         isAdminAuthorized,
//         setIsAdminAuthorized,
//         user,
//         setUser,
//         isAuthLoading,
//         logOut,
//         orders,
//         isFetchingOrders,
//         placeOrder,
//         submitNewsletter,
//         signInSimulated,
//         signInNodeUser,
//         bikes,
//         addBike,
//         updateBike,
//         deleteBike,
//         blogs,
//         addBlog,
//         updateBlog,
//         deleteBlog,
//         activePage,
//         setActivePage,
//         selectedBlogPost,
//         setSelectedBlogPost,
//         uiSettings,
//         updateUISettings,
//         isInfoModalOpen,
//         setInfoModalOpen,
//         infoModalTab,
//         setInfoModalTab
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BikeProduct, CartItem, BikeColor, BlogPost, UISettings } from '../types';
import { BIKES_DATA, BLOGS_DATA } from '../data';
import { safeLocalStorage } from '../utils/storage';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: BikeProduct, color: BikeColor) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  
  wishlist: string[]; // list of bike ids
  toggleWishlist: (bikeId: string) => void;
  
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  
  selectedQuickView: BikeProduct | null;
  setSelectedQuickView: (product: BikeProduct | null) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isAccountOpen: boolean;
  setAccountOpen: (open: boolean) => void;
  
  accountTab: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';
  setAccountTab: (tab: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings') => void;
  
  isAdminOpen: boolean;
  setAdminOpen: (open: boolean) => void;

  isAdminAuthorized: boolean;
  setIsAdminAuthorized: (authorized: boolean) => void;

  // Firebase auth & orders integrations
  user: any;
  setUser: (user: any) => void;
  isAuthLoading: boolean;
  logOut: () => Promise<void>;
  orders: any[];
  isFetchingOrders: boolean;
  placeOrder: (
    subtotal: number, 
    discount: number, 
    total: number, 
    paymentDetails?: { 
      paymentMethod: string; 
      transactionId: string; 
      detailsSummary: string; 
      status?: string;
    },
    checkoutDetails?: {
      customerDetails: any;
      shippingAddress: any;
      billingAddress: any;
    }
  ) => Promise<string>;
  submitNewsletter: (email: string) => Promise<void>;
  signInSimulated: (phoneNumber: string, notifyConsent: boolean) => void;
  signInNodeUser: (userPayload: any) => void;
  bikes: BikeProduct[];
  addBike: (bike: BikeProduct) => Promise<void>;
  updateBike: (bike: BikeProduct) => Promise<void>;
  deleteBike: (bikeId: string) => Promise<void>;
  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => Promise<void>;
  updateBlog: (blog: BlogPost) => Promise<void>;
  deleteBlog: (blogId: string) => Promise<void>;
  activePage: 'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success';
  setActivePage: (page: 'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success') => void;
  selectedBlogPost: BlogPost | null;
  setSelectedBlogPost: (post: BlogPost | null) => void;
  uiSettings: UISettings;
  updateUISettings: (settings: UISettings) => Promise<void>;
  isInfoModalOpen: boolean;
  setInfoModalOpen: (open: boolean) => void;
  infoModalTab: 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms';
  setInfoModalTab: (tab: 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms') => void;
}

const DEFAULT_UI_SETTINGS: UISettings = {
  announcementText: "Built for Balance. Made for Confidence.",
  announcementMoving: true,
  heroTitle: "Built for Little Explorers",
  heroSubtitle: "Premium balance bikes designed to help children develop balance, coordination, and confidence naturally.",
  heroHighlightText: "Little Explorers",
  heroImages: [
    '/images/bike_explorer_olive_1779786711803.png',
    '/images/bike_vintage_lilac_1779792037270.png',
    '/images/bike_neo_black_1779786755416.png'
  ],
  whyBalanzaTitle: "Why Balance Bikes?",
  whyBalanzaVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  features: [
    { title: 'Lightweight Frame', desc: 'Easy to handle', iconName: 'Feather' },
    { title: 'Child-Safe Design', desc: 'Rounded edges & non-toxic paint', iconName: 'ShieldAlert' },
    { title: 'Easy Assembly', desc: 'Tool-free setup in minutes', iconName: 'Wrench' },
    { title: 'Premium Materials', desc: 'Built to last, made to care', iconName: 'Award' },
    { title: 'Built for Growth', desc: 'Supports every step of their journey', iconName: 'LineChart' },
  ],
  instagramTitle: "Loved by Parents. Adored by Kids."
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapDefaultBlogImages = (posts: BlogPost[]) => {
  return posts.map(b => {
    if (b.id === 'balanza-mini-birthday-gift') {
      return { ...b, imageUrl: '/images/Blog1.jpeg' };
    }
    if (b.id === 'why-every-kid-needs-balance-bike') {
      return { ...b, imageUrl: '/images/Blog2.jpeg' };
    }
    return b;
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firebase integration states
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState<BikeProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    return safeLocalStorage.getItem('balanza_admin_authorized') === 'true';
  });
  const [activePage, setActivePage] = useState<'home' | 'blogs' | 'blog-detail' | 'contact' | 'story' | 'assembly' | 'faqs' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'checkout' | 'order-success'>(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/blogs' || path === '/blogs/') return 'blogs';
    if (path === '/contact' || path === '/contact/') return 'contact';
    if (path === '/story' || path === '/story/') return 'story';
    if (path === '/assembly' || path === '/assembly/') return 'assembly';
    if (path === '/faqs' || path === '/faqs/') return 'faqs';
    if (path === '/privacy' || path === '/privacy/') return 'privacy';
    if (path === '/terms' || path === '/terms/') return 'terms';
    if (path === '/shipping' || path === '/shipping/') return 'shipping';
    if (path === '/returns' || path === '/returns/') return 'returns';
    if (path === '/checkout' || path === '/checkout/') return 'checkout';
    if (path === '/order-success' || path === '/order-success/') return 'order-success';
    return 'home';
  });
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState<'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms'>('faqs');

  const [uiSettings, setUiSettings] = useState<UISettings>(() => {
    const local = safeLocalStorage.getItem('balanza_ui_config');
    if (local) {
      try { 
        const parsed = JSON.parse(local); 
        if (parsed.announcementText === "built for balance. made for confidence. click to learn why." || !parsed.announcementText) {
          parsed.announcementText = "Built for Balance. Made for Confidence.";
          parsed.announcementMoving = true;
          safeLocalStorage.setItem('balanza_ui_config', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return DEFAULT_UI_SETTINGS;
  });

  useEffect(() => {
    try {
      const docRef = doc(db, 'settings', 'ui_config');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          try {
            const fetched = docSnap.data() as UISettings;
            const merged = { ...DEFAULT_UI_SETTINGS, ...fetched };
            setUiSettings(merged);
            safeLocalStorage.setItem('balanza_ui_config', JSON.stringify(merged));
          } catch (e) {
            console.error("[AppContext] Error setting ui_config:", e);
          }
        }
      }, (error) => {
        console.warn("[AppContext] Real-time settings sync failed, falling back to cache:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Settings subscription error:", e);
    }
  }, []);

  const updateUISettings = async (newSettings: UISettings) => {
    setUiSettings(newSettings);
    safeLocalStorage.setItem('balanza_ui_config', JSON.stringify(newSettings));
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        console.log("[AppContext] Successfully updated UI CMS settings via Node API");
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend updateUISettings failed, trying Firestore route:", err);
    }
    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'settings', 'ui_config'), newSettings);
      console.log("[AppContext] Successfully updated UI settings in Firestore");
    } catch (err) {
      console.warn("[AppContext] Firestore updateUISettings failed:", err);
    }
  };

  // Dynamic Bikes List State with robust Firestore real-time synchronization and instant offline defaults
  const [bikes, setBikes] = useState<BikeProduct[]>(() => {
    const cached = safeLocalStorage.getItem('balanza_bikes');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) { /* silent */ }
    }
    return BIKES_DATA;
  });

  // Unified non-blocking Node API initialization for instant load speeds
  useEffect(() => {
    const initializeDataFromAPI = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settingsData = await response.json();
          if (settingsData && typeof settingsData === 'object') {
            const merged = { ...DEFAULT_UI_SETTINGS, ...settingsData };
            setUiSettings(merged);
            safeLocalStorage.setItem('balanza_ui_config', JSON.stringify(merged));
          }
        }
      } catch (e) {
        console.warn("[AppContext] Failed to load layout settings from API, using cached:", e);
      }

      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const productsData = await response.json();
          if (Array.isArray(productsData) && productsData.length > 0) {
            setBikes(productsData);
            safeLocalStorage.setItem('balanza_bikes', JSON.stringify(productsData));
          }
        }
      } catch (e) {
        console.warn("[AppContext] Failed to load products from API, using cached:", e);
      }

      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const blogsData = await response.json();
          if (Array.isArray(blogsData) && blogsData.length > 0) {
            const updated = mapDefaultBlogImages(blogsData);
            setBlogs(updated);
            safeLocalStorage.setItem('balanza_blogs', JSON.stringify(updated));
          }
        }
      } catch (e) {
        console.warn("[AppContext] Failed to load blogs from API, using cached:", e);
      }
    };

    initializeDataFromAPI();
  }, []);

  useEffect(() => {
    try {
      const q = collection(db, 'bikes');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bikesList: BikeProduct[] = [];
        snapshot.forEach((docSnap) => {
          bikesList.push({ id: docSnap.id, ...docSnap.data() } as BikeProduct);
        });
        
        if (bikesList.length > 0) {
          setBikes(bikesList);
          safeLocalStorage.setItem('balanza_bikes', JSON.stringify(bikesList));
        }
      }, (error) => {
        console.warn("[AppContext] Real-time bikes sync failed, falling back to local cache:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Bikes subscription error:", e);
    }
  }, []);

  const getAdminAuthHeaders = () => {
    const token = safeLocalStorage.getItem('balanza_admin_jwt');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  const addBike = async (bike: BikeProduct) => {
    const updated = [...bikes, bike];
    setBikes(updated);
    safeLocalStorage.setItem('balanza_bikes', JSON.stringify(updated));

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(bike)
      });
      if (response.ok) {
        console.log("[AppContext] Successfully added bike via secure Backend Node API:", bike.id);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend addBike failed, trying Firestore route:", err);
    }

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'bikes', bike.id), bike);
      console.log("[AppContext] Successfully added bike to Firestore:", bike.id);
    } catch (err) {
      console.warn("[AppContext] Firestore addBike failed, saved locally:", err);
    }
  };

  const updateBike = async (updatedBike: BikeProduct) => {
    const updated = bikes.map(b => b.id === updatedBike.id ? updatedBike : b);
    setBikes(updated);
    safeLocalStorage.setItem('balanza_bikes', JSON.stringify(updated));

    try {
      const response = await fetch(`/api/products/${updatedBike.id}`, {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(updatedBike)
      });
      if (response.ok) {
        console.log("[AppContext] Successfully updated bike via secure Backend Node API:", updatedBike.id);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend updateBike failed, trying Firestore route:", err);
    }

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'bikes', updatedBike.id), updatedBike);
      console.log("[AppContext] Successfully updated bike in Firestore:", updatedBike.id);
    } catch (err) {
      console.warn("[AppContext] Firestore updateBike failed, saved locally:", err);
    }
  };

  const deleteBike = async (bikeId: string) => {
    const updated = bikes.filter(b => b.id !== bikeId);
    setBikes(updated);
    safeLocalStorage.setItem('balanza_bikes', JSON.stringify(updated));

    try {
      const response = await fetch(`/api/products/${bikeId}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders()
      });
      if (response.ok) {
        console.log("[AppContext] Successfully deleted bike via secure Backend Node API:", bikeId);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend deleteBike failed, trying Firestore route:", err);
    }

    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'bikes', bikeId));
      console.log("[AppContext] Successfully deleted bike from Firestore:", bikeId);
    } catch (err) {
      console.warn("[AppContext] Firestore deleteBike failed, saved locally:", err);
    }
  };

  // Dynamic Blogs List State with robust Firestore real-time synchronization and instant offline defaults
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const cached = safeLocalStorage.getItem('balanza_blogs');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mapDefaultBlogImages(parsed);
        }
      } catch (e) { /* silent */ }
    }
    return mapDefaultBlogImages(BLOGS_DATA);
  });

  useEffect(() => {
    try {
      const q = collection(db, 'blogs');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const blogsList: BlogPost[] = [];
        snapshot.forEach((docSnap) => {
          blogsList.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        });
        
        if (blogsList.length > 0) {
          const updated = mapDefaultBlogImages(blogsList);
          setBlogs(updated);
          safeLocalStorage.setItem('balanza_blogs', JSON.stringify(updated));
        }
      }, (error) => {
        console.warn("[AppContext] Real-time blogs sync failed, falling back to local cache:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Blogs subscription error:", e);
    }
  }, []);

  const addBlog = async (blog: BlogPost) => {
    const updated = [...blogs, blog];
    setBlogs(updated);
    safeLocalStorage.setItem('balanza_blogs', JSON.stringify(updated));

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(blog)
      });
      if (response.ok) {
        console.log("[AppContext] Successfully added blog via secure Backend Node API:", blog.id);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend addBlog failed, trying Firestore route:", err);
    }

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'blogs', blog.id), blog);
      console.log("[AppContext] Successfully added blog to Firestore:", blog.id);
    } catch (err) {
      console.warn("[AppContext] Firestore addBlog failed, saved locally:", err);
    }
  };

  const updateBlog = async (updatedBlog: BlogPost) => {
    const updated = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
    setBlogs(updated);
    safeLocalStorage.setItem('balanza_blogs', JSON.stringify(updated));

    try {
      const response = await fetch(`/api/blogs/${updatedBlog.id}`, {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify(updatedBlog)
      });
      if (response.ok) {
        console.log("[AppContext] Successfully updated blog via secure Backend Node API:", updatedBlog.id);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend updateBlog failed, trying Firestore route:", err);
    }

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      await setDoc(doc(db, 'blogs', updatedBlog.id), updatedBlog);
      console.log("[AppContext] Successfully updated blog in Firestore:", updatedBlog.id);
    } catch (err) {
      console.warn("[AppContext] Firestore updateBlog failed, saved locally:", err);
    }
  };

  const deleteBlog = async (blogId: string) => {
    const updated = blogs.filter(b => b.id !== blogId);
    setBlogs(updated);
    safeLocalStorage.setItem('balanza_blogs', JSON.stringify(updated));

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders()
      });
      if (response.ok) {
        console.log("[AppContext] Successfully deleted blog via secure Backend Node API:", blogId);
        return;
      }
    } catch (err) {
      console.warn("[AppContext] Backend deleteBlog failed, trying Firestore route:", err);
    }

    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'blogs', blogId));
      console.log("[AppContext] Successfully deleted blog from Firestore:", blogId);
    } catch (err) {
      console.warn("[AppContext] Firestore deleteBlog failed, saved locally:", err);
    }
  };

  // Synchronize cart with logged-in user session or local guest cache
  useEffect(() => {
    const syncUserCart = async () => {
      if (!user) {
        const savedGuestCart = safeLocalStorage.getItem('balanza_guest_cart');
        if (savedGuestCart) {
          try { setCart(JSON.parse(savedGuestCart)); } catch { setCart([]); }
        } else {
          setCart([]);
        }
        return;
      }

      try {
        let dbCartItems: CartItem[] = [];
        const response = await fetch(`/api/cart?userId=${user.uid}`);
        if (response.ok) {
          dbCartItems = await response.json();
        }

        const currentGuestCart = safeLocalStorage.getItem('balanza_guest_cart');
        if (currentGuestCart) {
          try {
            const guestItems = JSON.parse(currentGuestCart);
            if (guestItems.length > 0) {
              const combinedMap = new Map<string, CartItem>();
              dbCartItems.forEach(item => combinedMap.set(item.id, item));
              
              guestItems.forEach((item: CartItem) => {
                if (combinedMap.has(item.id)) {
                  const existing = combinedMap.get(item.id)!;
                  combinedMap.set(item.id, {
                    ...existing,
                    quantity: existing.quantity + item.quantity
                  });
                } else {
                  combinedMap.set(item.id, item);
                }
              });

              dbCartItems = Array.from(combinedMap.values());
              safeLocalStorage.removeItem('balanza_guest_cart');
            }
          } catch (e) {
            console.error("Cart merge error: ", e);
          }
        }

        setCart(dbCartItems);
      } catch (err) {
        console.warn("[Cart Isolation] Failed to load synchronized cart, falling back to local user key: ", err);
        const userSavedCart = safeLocalStorage.getItem(`balanza_cart_${user.uid}`);
        if (userSavedCart) {
          try { setCart(JSON.parse(userSavedCart)); } catch { setCart([]); }
        } else {
          setCart([]);
        }
      }
    };

    syncUserCart();
  }, [user]);

  // Synchronize cart mutations back to the backend and local disk
  useEffect(() => {
    if (!user) {
      safeLocalStorage.setItem('balanza_guest_cart', JSON.stringify(cart));
      return;
    }

    safeLocalStorage.setItem(`balanza_cart_${user.uid}`, JSON.stringify(cart));

    const pushCart = async () => {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid, items: cart })
        });
      } catch (err) {
        console.warn("[Cart Isolation] Database upload bypassed/failed, saved locally:", err);
      }
    };

    const timer = setTimeout(pushCart, 400);
    return () => clearTimeout(timer);
  }, [cart, user]);

  // Synchronized Wishlist with Firebase and Local Storage
  useEffect(() => {
    const syncWishlist = async () => {
      if (!user) {
        const savedWish = safeLocalStorage.getItem('balanza_wishlist');
        if (savedWish) {
          try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
        } else {
          setWishlist([]);
        }
        return;
      }

      if (user.isSimulated) {
        const savedWish = safeLocalStorage.getItem(`balanza_wishlist_${user.uid}`);
        if (savedWish) {
          try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
        } else {
          setWishlist([]);
        }
        return;
      }

      try {
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let cloudWishlist: string[] = [];
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData && Array.isArray(userData.wishlist)) {
            cloudWishlist = userData.wishlist;
          }
        }

        // Merge guest wishlist
        const currentGuestWish = safeLocalStorage.getItem('balanza_wishlist');
        let guestWishItems: string[] = [];
        if (currentGuestWish) {
          try {
            guestWishItems = JSON.parse(currentGuestWish);
          } catch {}
        }

        const mergedWishlist = Array.from(new Set([...cloudWishlist, ...guestWishItems]));
        
        setWishlist(mergedWishlist);

        // Save merged wishlist back to Firestore
        await setDoc(userDocRef, { wishlist: mergedWishlist }, { merge: true });
        
        // Clear guest wishlist
        safeLocalStorage.removeItem('balanza_wishlist');
      } catch (err) {
        console.warn("[Wishlist Isolation] Cloud loading failed, falling back onto local user storage:", err);
        const savedWish = safeLocalStorage.getItem(`balanza_wishlist_${user.uid}`);
        if (savedWish) {
          try { setWishlist(JSON.parse(savedWish)); } catch { setWishlist([]); }
        }
      }
    };

    syncWishlist();
  }, [user]);

  // Session Initialization Observer
  useEffect(() => {
    setIsAuthLoading(true);

    // Initial check to seed the user state from localStorage cache if present before firebase responds
    const savedBackendUser = safeLocalStorage.getItem('balanza_user');
    const savedSimulatedUser = safeLocalStorage.getItem('balanza_simulated_user');
    if (savedBackendUser) {
      try {
        setUser(JSON.parse(savedBackendUser));
      } catch (err) {
        console.error("Failed to parse cached Node user:", err);
      }
    } else if (savedSimulatedUser) {
      try {
        setUser(JSON.parse(savedSimulatedUser));
      } catch (err) {
        console.error("Failed to parse cached simulated user:", err);
      }
    }

    // Always subscribe to Firebase Auth changes to detect real-time sign in / registration
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      if (currUser) {
        setUser(currUser);
      } else {
        // Only clear the user if there are no legacy active simulated or server sessions
        const activeSimulated = safeLocalStorage.getItem('balanza_simulated_user');
        const activeBackend = safeLocalStorage.getItem('balanza_user');
        if (!activeSimulated && !activeBackend) {
          setUser(null);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch / Sync User Orders Ledger via Node.js Express Backend (Secure and Free)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsFetchingOrders(false);
      return;
    }

    if (user.isSimulated) {
      const savedLocalOrders = safeLocalStorage.getItem(`balanza_local_orders_${user.uid}`);
      if (savedLocalOrders) {
        try {
          setOrders(JSON.parse(savedLocalOrders));
        } catch (e) {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
      setIsFetchingOrders(false);
      return;
    }

    let active = true;
    const fetchOrders = async () => {
      try {
        let data: any[] = [];
        const response = await fetch(`/api/orders?userId=${user.uid}`);
        if (response.ok) {
          data = await response.json();
        }

        if (active) {
          data.sort((a, b) => {
            const t1 = a.createdAt?.seconds || 0;
            const t2 = b.createdAt?.seconds || 0;
            return t2 - t1;
          });
          setOrders(data);
        }
      } catch (err) {
        if (active) setOrders([]);
      } finally {
        if (active) {
          setIsFetchingOrders(false);
        }
      }
    };

    setIsFetchingOrders(true);
    fetchOrders();

    // Poll orders every 10 seconds for real-time status updates without web sockets
    const interval = setInterval(fetchOrders, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const signInSimulated = (phoneNumber: string, notifyConsent: boolean) => {
    const simulatedUser = {
      uid: `local-sim-${Math.floor(100000 + Math.random() * 900000)}`,
      phoneNumber: phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`,
      isSimulated: true,
      notifyConsent
    };
    safeLocalStorage.setItem('balanza_simulated_user', JSON.stringify(simulatedUser));
    setUser(simulatedUser);
  };

  const signInNodeUser = (userPayload: any) => {
    safeLocalStorage.setItem('balanza_user', JSON.stringify(userPayload));
    setUser(userPayload);
  };

  const logOut = async () => {
    try {
      safeLocalStorage.removeItem('balanza_simulated_user');
      safeLocalStorage.removeItem('balanza_user');
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error('Firebase Auth Sign-Out exception:', error);
      setUser(null);
    }
  };

  // Secure checkout order placement backed securely by Node Express server database integrations
  const placeOrder = async (
    subtotal: number, 
    discount: number, 
    total: number,
    paymentDetails?: { 
      paymentMethod: string; 
      transactionId: string; 
      detailsSummary: string; 
      status?: string;
    },
    checkoutDetails?: {
      customerDetails: any;
      shippingAddress: any;
      billingAddress: any;
    }
  ): Promise<string> => {
    if (!user) {
      throw new Error('You must be registered to make purchase order receipts.');
    }

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

    const orderId = `BLZ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderObj = {
      orderId: orderId,
      id: orderId,
      userId: user.uid,
      items: serializedItems,
      itemsSubtotal: Math.round(subtotal),
      discountAmount: Math.round(discount),
      finalTotal: Math.round(total),
      status: paymentDetails?.status || (paymentDetails ? 'paid' : 'placed'),
      paymentMethod: paymentDetails?.paymentMethod || null,
      transactionId: paymentDetails?.transactionId || null,
      detailsSummary: paymentDetails?.detailsSummary || null,
      customerDetails: checkoutDetails?.customerDetails || null,
      shippingAddress: checkoutDetails?.shippingAddress || null,
      billingAddress: checkoutDetails?.billingAddress || null,
      createdAt: { seconds: Math.floor(Date.now() / 1000) }
    };

    if (user.isSimulated) {
      const savedLocalOrders = safeLocalStorage.getItem(`balanza_local_orders_${user.uid}`);
      let localList = [];
      if (savedLocalOrders) {
        try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
      }
      localList.unshift(newOrderObj);
      safeLocalStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
      setOrders(prev => [newOrderObj, ...prev]);
      return orderId;
    }

    try {
      // Direct Client-Side Firestore Order Storage
      const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      
      const firestoreOrderObj = {
        ...newOrderObj,
        createdAt: serverTimestamp() // real server timestamp needed for secure rules validation
      };
      
      await setDoc(doc(db, 'orders', orderId), firestoreOrderObj);
      console.log("[Client] Saved order directly in client-side Firestore successfully");
      
      setOrders(prev => [newOrderObj, ...prev]);
      return orderId;
    } catch (clientWriteErr) {
      console.warn("[Client] Direct client Firestore write did not complete, falling back onto server pipelines:", clientWriteErr);
      
      try {
        // POST order payload directly to Node.js backend to bypass client write restrictions
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user?.email || '',
            items: serializedItems,
            itemsSubtotal: Math.round(subtotal),
            discountAmount: Math.round(discount),
            finalTotal: Math.round(total),
            status: paymentDetails?.status || (paymentDetails ? 'paid' : 'placed'),
            paymentMethod: paymentDetails?.paymentMethod || null,
            transactionId: paymentDetails?.transactionId || null,
            detailsSummary: paymentDetails?.detailsSummary || null,
            customerDetails: checkoutDetails?.customerDetails || null,
            shippingAddress: checkoutDetails?.shippingAddress || null,
            billingAddress: checkoutDetails?.billingAddress || null
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to write order securely to Express backend registry");
        }

        const resJson = await response.json();
        const confirmedOrderId = resJson.orderId || orderId;

        const confirmedOrder = {
          ...newOrderObj,
          orderId: confirmedOrderId,
          id: confirmedOrderId
        };

        setOrders(prev => [confirmedOrder, ...prev]);
        return confirmedOrderId;
      } catch (error) {
        console.warn("Unable to save order to Node Backend. Saving to local storage profile:", error);
        const savedLocalOrders = safeLocalStorage.getItem(`balanza_local_orders_${user.uid}`);
        let localList = [];
        if (savedLocalOrders) {
          try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
        }
        localList.unshift(newOrderObj);
        safeLocalStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
        setOrders(prev => [newOrderObj, ...prev]);
        return orderId;
      }
    }
  };

  // Newsletter submission with real Firebase SDK
  const submitNewsletter = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Email address is required.");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit subscription.");
      }
    } catch (err: any) {
      console.error("Error subscribing to newsletter:", err);
      throw new Error(err.message || "Failed to submit subscription.");
    }
  };

  const addToCart = (product: BikeProduct, color: BikeColor) => {
    const itemId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === itemId);
      if (exists) {
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            selectedColor: color,
            quantity: 1,
            price: product.basePrice,
          },
        ];
      }
    });
    setCartOpen(true); // Open cart automatically when adding item
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = async (bikeId: string) => {
    let nextWishlist: string[] = [];
    setWishlist((prev) => {
      nextWishlist = prev.includes(bikeId) ? prev.filter((id) => id !== bikeId) : [...prev, bikeId];
      return nextWishlist;
    });

    if (!user) {
      safeLocalStorage.setItem('balanza_wishlist', JSON.stringify(nextWishlist));
      return;
    }

    if (user.isSimulated) {
      safeLocalStorage.setItem(`balanza_wishlist_${user.uid}`, JSON.stringify(nextWishlist));
      return;
    }

    safeLocalStorage.setItem(`balanza_wishlist_${user.uid}`, JSON.stringify(nextWishlist));

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', user.uid), { wishlist: nextWishlist }, { merge: true });
    } catch (err) {
      console.warn("[Wishlist Isolation] Cloud write failed, saved locally:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setCartOpen,
        isMenuOpen,
        setMenuOpen,
        isSearchOpen,
        setSearchOpen,
        selectedQuickView,
        setSelectedQuickView,
        searchQuery,
        setSearchQuery,
        isAccountOpen,
        setAccountOpen,
        accountTab,
        setAccountTab,
        isAdminOpen,
        setAdminOpen,
        isAdminAuthorized,
        setIsAdminAuthorized,
        user,
        setUser,
        isAuthLoading,
        logOut,
        orders,
        isFetchingOrders,
        placeOrder,
        submitNewsletter,
        signInSimulated,
        signInNodeUser,
        bikes,
        addBike,
        updateBike,
        deleteBike,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        activePage,
        setActivePage,
        selectedBlogPost,
        setSelectedBlogPost,
        uiSettings,
        updateUISettings,
        isInfoModalOpen,
        setInfoModalOpen,
        infoModalTab,
        setInfoModalTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

