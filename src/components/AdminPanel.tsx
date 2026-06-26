import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Edit2, Trash2, Calendar, ShoppingBag, 
  DollarSign, BarChart2, ShieldAlert, Check, RefreshCw, 
  ChevronRight, Save, Layout, FileText, Activity, CheckCircle,
  Upload, Volume2, Edit3, Grid, Video, Sparkles, Image, Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BikeProduct, BikeColor, BlogPost } from '../types';

export default function AdminPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    bikes, addBike, updateBike, deleteBike, orders, blogs, addBlog, updateBlog, deleteBlog, uiSettings, updateUISettings,
    isAdminAuthorized, setIsAdminAuthorized
  } = useApp();
  
  // Authorization State
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'metrics' | 'blogs' | 'settings' | 'subscribers' | 'videos' | 'inquiries'>('inventory');

  // Subscribers state
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // Admin orders and Inquiries state
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'contact' | 'dealer'>('all');

  // Videos state
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [replacingVideoId, setReplacingVideoId] = useState<string | null>(null);

  // Admin Credential settings state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);

  // Local active settings form state
  const [localSettings, setLocalSettings] = useState(uiSettings);
  
  const displayOrders = isAdminAuthorized && adminOrders.length > 0 ? adminOrders : (orders || []);
  
  useEffect(() => {
    if (uiSettings) {
      setLocalSettings(uiSettings);
    }
  }, [uiSettings]);

  // Edit / Add States
  const [isEditing, setIsEditing] = useState(false);
  const [editingBike, setEditingBike] = useState<Partial<BikeProduct> | null>(null);

  // Blog content editing state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  // Success Feedback Toast/Message
  const [feedback, setFeedback] = useState('');

  // Form local states for colors
  const [colorInput, setColorInput] = useState({ name: '', value: '#A7E22E', imageUrl: '' });

  // Preset default elegant balance bike illustrations / placeholders for image choices
  const DEFAULT_BIKE_IMAGES = [
    '/images/bike_explorer_olive_1779786711803.png',
    '/images/bike_vintage_lilac_1779792037270.png',
    '/images/bike_neo_black_1779786755416.png',
    '/images/bike_trail_yellow_1779791994390.png',
    '/images/bike_aero_blue_1779792020124.png',
    '/images/bike_mini_pink_1779786733057.png'
  ];

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Default system fallback or environment override
    const targetPasscode = 'admin123';
    
    if (passcode === targetPasscode) {
      try {
        const loginRes = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: "admin@balanza.com", password: passcode })
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          localStorage.setItem("balanza_admin_jwt", loginData.token);
          localStorage.setItem("balanza_admin_user", JSON.stringify(loginData.user));
        }
      } catch (err) {
        console.error("Failed to automatically acquire admin JWT token during passcode authorization", err);
      }
      setIsAdminAuthorized(true);
      localStorage.setItem('balanza_admin_authorized', 'true');
      setLoginError('');
      showFeedback('Access granted. Welcome to Admin Portal!');
    } else {
      setLoginError('Invalid Administrator Passcode. Please verify and try again.');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthorized(false);
    localStorage.removeItem('balanza_admin_authorized');
    localStorage.removeItem('balanza_admin_jwt');
    localStorage.removeItem('balanza_admin_user');
    setPasscode('');
    if (window.location.pathname === '/admin') {
      window.history.replaceState({}, '', '/admin/login');
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      if (!adminToken) {
        setIsAdminAuthorized(false);
        localStorage.removeItem('balanza_admin_authorized');
        setIsLoadingSubscribers(false);
        return;
      }
      const res = await fetch("/api/admin/subscribers", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setIsAdminAuthorized(false);
          localStorage.removeItem('balanza_admin_authorized');
          localStorage.removeItem('balanza_admin_jwt');
          return;
        }
        throw new Error(`Load error: ${res.statusText || 'Status ' + res.status}`);
      }
      const list = await res.json();
      setSubscribers(list);
    } catch (err) {
      console.error("Failed to load subscribers from backend API", err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!window.confirm(`Are you sure you want to delete ${email} from the newsletter subscriber list?`)) {
      return;
    }
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      const res = await fetch(`/api/admin/subscribers/${encodeURIComponent(email.trim().toLowerCase())}`, {
        method: "DELETE",
        headers: {
          "Authorization": adminToken ? `Bearer ${adminToken}` : ""
        }
      });
      if (!res.ok) {
        throw new Error(`Delete error: ${res.statusText}`);
      }
      showFeedback("Subscriber deleted successfully!");
      fetchSubscribers();
    } catch (err: any) {
      console.error("Failed to delete subscriber via backend API", err);
      alert(err.message || "Failed to delete subscriber via backend API");
    }
  };

  const fetchVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      if (!adminToken) return;
      const res = await fetch("/api/admin/videos", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        const list = await res.json();
        setVideos(list || []);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video physical asset file and database log?")) {
      return;
    }
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        showFeedback("Video deleted successfully!");
        fetchVideos();
      } else {
        const errResponse = await res.json();
        alert(errResponse.error || "Failed to delete video asset.");
      }
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert("Network error deleting video.");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, replaceId: string | null = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['mp4', 'mov', 'webm'].includes(extension)) {
      alert("Unsupported video format. Only MP4, MOV, and WEBM formats are supported.");
      return;
    }

    // Validate size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video size exceeds the 50MB limit (50MB maximum).");
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsUploadingVideo(true);
      setVideoUploadProgress(0);
      if (replaceId) {
        setReplacingVideoId(replaceId);
      }
    };
    reader.onload = () => {
      const base64String = reader.result as string;
      const adminToken = localStorage.getItem("balanza_admin_jwt");

      const xhr = new XMLHttpRequest();
      const url = replaceId ? `/api/admin/videos/${replaceId}` : "/api/admin/videos";
      const method = replaceId ? "PUT" : "POST";

      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${adminToken}`);

      // Track XMLHttp upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setVideoUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setIsUploadingVideo(false);
        setVideoUploadProgress(null);
        setReplacingVideoId(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          showFeedback(replaceId ? "Video successfully replaced!" : "Video successfully uploaded!");
          fetchVideos();
        } else {
          try {
            const errResponse = JSON.parse(xhr.responseText);
            alert(errResponse.error || "Failed upload video validation.");
          } catch {
            alert("Upload rejected by server security policies.");
          }
        }
      };

      xhr.onerror = () => {
        setIsUploadingVideo(false);
        setVideoUploadProgress(null);
        setReplacingVideoId(null);
        alert("Upload failed due to connection issues.");
      };

      xhr.send(JSON.stringify({
        name: file.name,
        data: base64String
      }));
    };

    reader.onerror = () => {
      alert("FileReader failed to compile local file.");
    };

    reader.readAsDataURL(file);
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail && !newAdminPassword) {
      alert("Please enter a new Username/Email or new Password to update.");
      return;
    }
    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsUpdatingCredentials(true);
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: newAdminEmail || undefined,
          password: newAdminPassword || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        showFeedback("Admin credentials updated successfully!");
        setNewAdminEmail('');
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        
        // Update local storage representation if they changed email
        if (newAdminEmail) {
          localStorage.setItem("balanza_admin_user", JSON.stringify(data.user));
        }
      } else {
        alert(data.error || "Failed to update admin credentials.");
      }
    } catch (err) {
      console.error("Error updating credentials:", err);
      alert("Network error updating credentials.");
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  const fetchAdminOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      if (!adminToken) return;
      const res = await fetch("/api/admin/orders", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        const list = await res.json();
        list.sort((a: any, b: any) => {
          const t1 = a.createdAt?.seconds || (a.createdAt && new Date(a.createdAt).getTime()) || 0;
          const t2 = b.createdAt?.seconds || (b.createdAt && new Date(b.createdAt).getTime()) || 0;
          return t2 - t1;
        });
        setAdminOrders(list || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const adminToken = localStorage.getItem("balanza_admin_jwt");
      if (!adminToken) return;
      const res = await fetch("/api/admin/inquiries", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        const list = await res.json();
        list.sort((a: any, b: any) => {
          const t1 = a.createdAt?.seconds || (a.createdAt && new Date(a.createdAt).getTime()) || 0;
          const t2 = b.createdAt?.seconds || (b.createdAt && new Date(b.createdAt).getTime()) || 0;
          return t2 - t1;
        });
        setInquiries(list || []);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem("balanza_admin_jwt");
    if (isAdminAuthorized && adminToken) {
      if (activeTab === 'subscribers') {
        fetchSubscribers();
      } else if (activeTab === 'videos') {
        fetchVideos();
      } else if (activeTab === 'orders' || activeTab === 'metrics') {
        fetchAdminOrders();
      } else if (activeTab === 'inquiries') {
        fetchInquiries();
      }
    } else if (isAdminAuthorized && !adminToken) {
      setIsAdminAuthorized(false);
      localStorage.removeItem('balanza_admin_authorized');
    }
  }, [isAdminAuthorized, activeTab]);

  // CRUD Operations
  const handleAddNewBike = () => {
    setEditingBike({
      id: `balanza-bike-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      tagphrase: '',
      description: '',
      basePrice: 2899,
      ageYears: '12+ Months',
      defaultColorIndex: 0,
      colors: [],
      images: []
    });
    setIsEditing(true);
    setColorInput({ name: '', value: '#a2e6b1', imageUrl: DEFAULT_BIKE_IMAGES[0] });
  };

  const handleEditBikeClick = (bike: BikeProduct) => {
    setEditingBike({ ...bike });
    setIsEditing(true);
    setColorInput({ name: '', value: '#a2e6b1', imageUrl: DEFAULT_BIKE_IMAGES[0] });
  };

  const handleDeleteBikeClick = async (bikeId: string) => {
    if (window.confirm('Are you absolutely sure you want to retire and delete this bike from the catalog?')) {
      await deleteBike(bikeId);
      showFeedback('Bike discontinued and deleted successfully!');
    }
  };

  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike || !editingBike.id || !editingBike.name) {
      alert('Please fill out the bike name.');
      return;
    }

    // Default color & image verification
    const currentColors = editingBike.colors || [];
    if (currentColors.length === 0) {
      // Add a default fallback color
      currentColors.push({
        name: 'Default',
        value: '#A7E22E',
        imageUrl: editingBike.images?.[0] || DEFAULT_BIKE_IMAGES[0]
      });
    }

    const currentImages = editingBike.images || [];
    if (currentImages.length === 0) {
      currentImages.push(currentColors[0].imageUrl || DEFAULT_BIKE_IMAGES[0]);
    }

    const bikeToSave: BikeProduct = {
      id: editingBike.id,
      name: editingBike.name,
      tagphrase: editingBike.tagphrase || 'Unsurpassed durability for tiny riders.',
      description: editingBike.description || 'Crafted with premium materials for maximum comfort and security.',
      basePrice: Number(editingBike.basePrice) || 2899,
      ageYears: editingBike.ageYears || '12+ Months',
      colors: currentColors,
      defaultColorIndex: editingBike.defaultColorIndex ?? 0,
      images: currentImages
    };

    const isExisting = bikes.some(b => b.id === bikeToSave.id);
    if (isExisting) {
      await updateBike(bikeToSave);
      showFeedback('Bike updated successfully!');
    } else {
      await addBike(bikeToSave);
      showFeedback('New bike successfully introduced and saved!');
    }

    setIsEditing(false);
    setEditingBike(null);
  };

  const handleAddColorOption = () => {
    if (!colorInput.name.trim()) {
      alert('Please enter a color label (e.g. Mint Green).');
      return;
    }
    
    if (!editingBike) return;

    const updatedColors = [...(editingBike.colors || []), { ...colorInput }];
    const updatedImages = [...(editingBike.images || [])];
    
    // Add color's image into images pool if not yet there
    if (colorInput.imageUrl && !updatedImages.includes(colorInput.imageUrl)) {
      updatedImages.push(colorInput.imageUrl);
    }

    setEditingBike({
      ...editingBike,
      colors: updatedColors,
      images: updatedImages
    });

    // Reset color input fields
    setColorInput({ name: '', value: '#a2e6b1', imageUrl: DEFAULT_BIKE_IMAGES[0] });
  };

  const handleRemoveColorOption = (index: number) => {
    if (!editingBike || !editingBike.colors) return;
    const colors = [...editingBike.colors];
    colors.splice(index, 1);
    setEditingBike({ ...editingBike, colors });
  };

  const handleRemoveImage = (imgUrl: string) => {
    if (!editingBike || !editingBike.images) return;
    const images = editingBike.images.filter(img => img !== imgUrl);
    setEditingBike({ ...editingBike, images });
  };

  const handleAddDirectImage = (imgUrl: string) => {
    if (!editingBike) return;
    const images = [...(editingBike.images || [])];
    if (!images.includes(imgUrl)) {
      images.push(imgUrl);
    }
    setEditingBike({ ...editingBike, images });
  };

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'bike' | 'blog' | 'color' | 'hero-0' | 'hero-1' | 'hero-2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('This image is larger than 2MB. Please select a smaller, optimized image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (!base64Data) return;

      try {
        const adminToken = localStorage.getItem("balanza_admin_jwt");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": adminToken ? `Bearer ${adminToken}` : ""
          },
          body: JSON.stringify({ name: file.name, data: base64Data })
        });

        if (!uploadRes.ok) {
          throw new Error("Server folder upload rejected");
        }

        const uploadData = await uploadRes.json();
        const serverAssetUrl = uploadData.url;

        if (target === 'bike') {
          handleAddDirectImage(serverAssetUrl);
          showFeedback('Image successfully saved to secure server uploads storage!');
        } else if (target === 'blog') {
          if (editingBlog) {
            setEditingBlog({ ...editingBlog, imageUrl: serverAssetUrl });
            showFeedback('Blog backdrop image uploaded to secure server folders!');
          }
        } else if (target === 'color') {
          setColorInput({ ...colorInput, imageUrl: serverAssetUrl });
          showFeedback('Custom color illustration saved to server disk!');
        } else if (target.startsWith('hero-')) {
          const idx = parseInt(target.split('-')[1], 10);
          const newImgs = [...(localSettings?.heroImages || [])];
          newImgs[idx] = serverAssetUrl;
          setLocalSettings({ ...localSettings, heroImages: newImgs });
          showFeedback(`Hero Slide ${idx + 1} image uploaded to secure server folders!`);
        }
      } catch (err) {
        console.warn("Server uploads bypassed. Rendering raw base64 locally: ", err);
        if (target === 'bike') {
          handleAddDirectImage(base64Data);
          showFeedback('Image successfully loaded from your device!');
        } else if (target === 'blog') {
          if (editingBlog) {
            setEditingBlog({ ...editingBlog, imageUrl: base64Data });
            showFeedback('Blog backdrop image matched from device!');
          }
        } else if (target === 'color') {
          setColorInput({ ...colorInput, imageUrl: base64Data });
          showFeedback('Custom color illustration loaded from device!');
        } else if (target.startsWith('hero-')) {
          const idx = parseInt(target.split('-')[1], 10);
          const newImgs = [...(localSettings?.heroImages || [])];
          newImgs[idx] = base64Data;
          setLocalSettings({ ...localSettings, heroImages: newImgs });
          showFeedback(`Hero Slide ${idx + 1} image loaded from device!`);
        }
      }
    };
    reader.onerror = () => {
      alert('Error reading files from device.');
    };
    reader.readAsDataURL(file);
  };

  // Metrics summary calculator
  const totalRevenue = displayOrders ? displayOrders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((acc, o) => acc + (Number(o.finalTotal) || 0), 0) : 0;

  const totalSalesCount = displayOrders ? displayOrders
    .filter(o => o.status === 'paid' || o.status === 'delivered').length : 0;

  const averageBasketValue = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;

  // Render orders status options changer
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const targetOrder = displayOrders.find(o => o.id === orderId);
      if (!targetOrder) return;

      const updatedRaw = {
        ...targetOrder,
        status: newStatus
      };

      // Sync Firestore with Node Admin DB
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
      showFeedback(`Order status advanced to "${newStatus}"!`);
      
      // Trigger simple in-memory context check (or let polling grab it in 10s)
      window.location.reload();
    } catch (e) {
      console.warn("Direct firestore order state update didn't resolve. Proceeding locally:", e);
      // Let's set the status in simulated storage as fallback
      const savedBackendUser = localStorage.getItem('balanza_user');
      const savedSimulatedUser = localStorage.getItem('balanza_simulated_user');
      const targetUserObj = savedBackendUser ? JSON.parse(savedBackendUser) : (savedSimulatedUser ? JSON.parse(savedSimulatedUser) : null);
      
      if (targetUserObj) {
        const key = `balanza_local_orders_${targetUserObj.uid}`;
        const savedLocalOrders = localStorage.getItem(key);
        if (savedLocalOrders) {
          try {
            const list = JSON.parse(savedLocalOrders);
            const revised = list.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o);
            localStorage.setItem(key, JSON.stringify(revised));
            showFeedback(`State committed locally. Status is now "${newStatus}"!`);
            setTimeout(() => window.location.reload(), 1000);
          } catch (err) {}
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md select-none font-sans">
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-transparent" 
      />

      {/* Main Admin Card */}
      <div className="relative w-full max-w-[1150px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col h-auto max-h-[95vh] sm:h-[760px] sm:max-h-[88vh] z-10 border border-slate-200/80 flex-1 animate-fade-in">
        
        {/* Header segment */}
        <div className="bg-[#090D16] text-white px-6 py-4.5 flex items-center justify-between select-none border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center text-lime-400">
              <Layout className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-white text-xs uppercase tracking-widest leading-none">
                  Balanza Admin Portal
                </h2>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-[8px] font-mono font-black text-lime-400 tracking-wider">
                  <span className="h-1 w-1 rounded-full bg-lime-400 animate-pulse" />
                  <span>SECURE ACCESS</span>
                </div>
              </div>
              <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase tracking-wide">
                Direct CMS Sync Engine
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white h-9 w-9 rounded-xl flex items-center justify-center bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* FEEDBACK POPUP MESSAGE */}
        {feedback && (
          <div className="bg-emerald-500 text-white text-xs py-2 px-4 shadow-sm font-bold text-center flex items-center justify-center gap-1.5 animate-slide-down">
            <Check className="h-4 w-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* SECURE GATE - PASSWORD LOCK */}
        {!isAdminAuthorized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="max-w-sm w-full py-8 px-6 bg-white rounded-2xl border border-slate-100 shadow-md text-center">
              <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 border border-amber-100">
                <ShieldAlert className="h-6 w-6 stroke-[1.75]" />
              </div>
              <h3 className="font-display text-base font-extrabold text-slate-900 uppercase tracking-wide">
                Security clearance required
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                Please provide the Balanza Owner Console Passcode to modify the bike inventory catalogue.
              </p>

              {loginError && (
                <p className="text-xs text-rose-500 font-bold mt-3 animate-pulse">{loginError}</p>
              )}

              <form onSubmit={handlePasscodeSubmit} className="mt-5 space-y-3">
                <input
                  type="password"
                  required
                  placeholder="Enter Passcode (Default: admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 text-center bg-slate-50/50 border border-slate-200 rounded-xl focus:border-[#0E1321] focus:ring-1 focus:ring-[#0E1321] text-sm focus:outline-none transition-all placeholder:text-slate-400 font-bold tracking-widest text-[#0E1321]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0E1321] hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-[0.98] shadow-sm-button"
                >
                  Verify Access
                </button>
              </form>

              <p className="text-[9px] text-slate-400 font-sans mt-4">
                Tip: You can change the passcode anytime in the server configurations.
              </p>
            </div>
          </div>
        ) : (
          /* CORE ADMIN WORKSPACE CONTENT */
          <div className="flex-1 flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden min-h-0">
            
            {/* Sidebar navigation tabs */}
            <div className="w-full sm:w-[195px] bg-[#0D111A] border-b sm:border-b-0 sm:border-r border-slate-800/80 p-3 flex flex-col sm:justify-between shrink-0 text-slate-300">
              <div className="flex flex-row flex-wrap sm:flex-col gap-1.5 sm:gap-1.5">
                <p className="font-sans text-[9px] font-black text-slate-500 uppercase tracking-widest px-2.5 mb-2.5 hidden sm:block w-full">
                  OPERATIONS
                </p>
                <button
                  onClick={() => { setActiveTab('inventory'); setIsEditing(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'inventory' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <ShoppingBag className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'inventory' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Bikes</span>
                  <span className="ml-auto text-[9px] bg-[#A7E22E]/10 border border-[#A7E22E]/25 text-[#A7E22E] px-1.5 py-0.5 rounded-md font-extrabold">{bikes.length}</span>
                </button>
                
                <button
                  onClick={() => { setActiveTab('orders'); setIsEditing(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'orders' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <FileText className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'orders' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Orders</span>
                  <span className="ml-auto text-[9px] bg-[#A7E22E]/10 border border-[#A7E22E]/25 text-[#A7E22E] px-1.5 py-0.5 rounded-md font-extrabold">{displayOrders ? displayOrders.length : 0}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('metrics'); setIsEditing(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'metrics' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <BarChart2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'metrics' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Sales Metrics</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('blogs'); setIsEditing(false); setIsEditingBlog(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'blogs' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <FileText className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'blogs' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Blogs CMS</span>
                  <span className="ml-auto text-[9px] bg-[#A7E22E]/10 border border-[#A7E22E]/25 text-[#A7E22E] px-1.5 py-0.5 rounded-md font-extrabold">{blogs ? blogs.length : 0}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('settings'); setIsEditing(false); setIsEditingBlog(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <Layout className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'settings' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">UI Configuration</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('inquiries'); setIsEditing(false); setIsEditingBlog(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'inquiries' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <Mail className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'inquiries' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Inquiries</span>
                  <span className="ml-auto text-[9px] bg-[#A7E22E]/10 border border-[#A7E22E]/25 text-[#A7E22E] px-1.5 py-0.5 rounded-md font-extrabold">{inquiries.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('videos'); setIsEditing(false); setIsEditingBlog(false); }}
                  className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'videos' 
                      ? 'bg-slate-900/80 text-[#A7E22E] border-l-2 border-l-[#A7E22E] font-black shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/35 border border-transparent'
                  }`}
                >
                  <Video className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${activeTab === 'videos' ? 'text-[#A7E22E]' : 'text-slate-500'}`} />
                  <span className="truncate">Showcase Videos</span>
                  <span className="ml-auto text-[9px] bg-[#A7E22E]/10 border border-[#A7E22E]/25 text-[#A7E22E] px-1.5 py-0.5 rounded-md font-extrabold">{videos.length}</span>
                </button>
              </div>
            </div>

            {/* Inner Dashboard View Canvas */}
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              
              {/* ------------ TAB 1: BIKES CATALOG CRUD VIEW ------------ */}
              {activeTab === 'inventory' && !isEditing && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight">
                        Active Bike Inventory
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Create, modify, or deprecate dynamic balance bike specifications instantly.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleAddNewBike}
                      className="bg-[#A7E22E] hover:bg-[#97cc24] text-slate-950 font-black text-[11px] px-3.5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-3xs hover:shadow active:scale-97"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      Add New Bike
                    </button>
                  </div>

                  {bikes.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="font-sans text-xs text-slate-540 font-bold">The inventory is currently bare.</p>
                      <p className="font-sans text-[10px] text-slate-400 mt-1">Click "Add New Bike" above to configure your first model.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bikes.map((bike) => (
                        <div 
                          key={bike.id} 
                          className="p-4 rounded-2xl border border-slate-150 shadow-3xs flex flex-row gap-4 items-center hover:border-slate-300 transition-all group bg-slate-50/40"
                        >
                          <div className="h-16 w-16 bg-slate-100/80 rounded-xl p-1.5 shrink-0 flex items-center justify-center">
                            <img 
                              src={bike.colors?.[0]?.imageUrl || DEFAULT_BIKE_IMAGES[0]} 
                              alt={bike.name} 
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="font-display text-xs font-extrabold text-slate-900 truncate leading-snug">
                              {bike.name}
                            </h4>
                            <p className="font-mono text-[9px] text-[#5F6D50] font-black mt-0.5">
                              ₹{bike.basePrice}
                            </p>
                            <span className="inline-block mt-1 text-[9px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                              {bike.ageYears}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditBikeClick(bike)}
                              title="Modify Details"
                              className="h-8 w-8 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer shadow-3xs active:scale-90"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBikeClick(bike.id)}
                              title="Discontinue Product"
                              className="h-8 w-8 bg-white border border-slate-200 text-rose-550 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer shadow-3xs active:scale-90"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ------------ NEW BIKE FORM / EDIT MODAL WORKSPACE ------------ */}
              {activeTab === 'inventory' && isEditing && editingBike && (
                <form onSubmit={handleSaveBike} className="space-y-4 animate-fade-in select-text text-left">
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div>
                      <span className="font-mono text-[8px] bg-[#0E1321] text-[#A7E22E] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-max mb-1">
                        {bikes.some(b => b.id === editingBike.id) ? 'Database Update Mode' : 'New Intake Model'}
                      </span>
                      <h3 className="font-display text-base font-extrabold text-slate-900">
                        {bikes.some(b => b.id === editingBike.id) ? `Edit: ${editingBike.name}` : 'Configure New Bike Product'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditingBike(null); }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase px-3 py-1.5 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Back to Inventory
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic properties fields */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Bike Name / Designator</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Balanza Neo (Color - Midnight Black)"
                          value={editingBike.name || ''}
                          onChange={(e) => setEditingBike({ ...editingBike, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-750"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Base Price (INR)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="2899"
                            value={editingBike.basePrice || ''}
                            onChange={(e) => setEditingBike({ ...editingBike, basePrice: parseInt(e.target.value, 10) })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-750"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Target Age Cohort</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 12+ Months or 2-4 Years"
                            value={editingBike.ageYears || ''}
                            onChange={(e) => setEditingBike({ ...editingBike, ageYears: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-750"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Product Tag Line Phrase</label>
                        <input
                          type="text"
                          placeholder="e.g. Timeless retro-vintage aesthetics for tiny riders."
                          value={editingBike.tagphrase || ''}
                          onChange={(e) => setEditingBike({ ...editingBike, tagphrase: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-755"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Comprehensive Description</label>
                        <textarea
                          placeholder="Provide dynamic, persuasive copy regarding the safety, comfort, comfortable leather touching details, custom lightweight materials for first step development..."
                          rows={4}
                          value={editingBike.description || ''}
                          onChange={(e) => setEditingBike({ ...editingBike, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-750 resize-none font-normal"
                        />
                      </div>
                    </div>

                    {/* Advanced Color Wheels & Images section */}
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
                      <div>
                        <h4 className="font-display text-[11px] font-extrabold text-slate-850 uppercase tracking-widest select-none">
                          Colors options &amp; image assets
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                          Configure your color options and associate illustration assets with your model.
                        </p>
                      </div>

                      {/* Current color bubbles list */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Current Color Variants Added ({editingBike.colors?.length || 0})</span>
                        <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto p-1.5 bg-white border border-slate-200 rounded-lg">
                          {(!editingBike.colors || editingBike.colors.length === 0) ? (
                            <span className="text-[10px] text-slate-400 italic">No color variants added yet. Please configure at least one below.</span>
                          ) : (
                            editingBike.colors.map((color, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[10px] border border-slate-150">
                                <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color.value }} />
                                <span className="font-semibold truncate max-w-[65px]">{color.name}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveColorOption(cIdx)} 
                                  className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5 rounded-full hover:bg-slate-200"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Add Color Selector row */}
                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                        <span className="block text-[8.5px] font-black uppercase tracking-wider text-[#5F6D50]">Add Color Option</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Color Label (e.g. Olive)"
                            value={colorInput.name}
                            onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={colorInput.value}
                              onChange={(e) => setColorInput({ ...colorInput, value: e.target.value })}
                              className="h-7 w-7 rounded border border-slate-300 overflow-hidden cursor-pointer flex-shrink-0 p-0"
                            />
                            <span className="text-[10px] font-semibold text-slate-450 uppercase">{colorInput.value}</span>
                          </div>
                        </div>

                        {/* Presets choice for Color image */}
                        <div>
                          <span className="block text-[8.5px] text-slate-400 uppercase tracking-wide mb-1 select-none">Associated Illustration Asset Url</span>
                          <div className="grid grid-cols-6 gap-1 mb-2">
                            {DEFAULT_BIKE_IMAGES.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setColorInput({ ...colorInput, imageUrl: img })}
                                className={`h-8 rounded border p-0.5 flex items-center justify-center cursor-pointer transition-all ${
                                  colorInput.imageUrl === img 
                                    ? 'bg-[#A7E22E]/10 border-[#A7E22E] scale-105' 
                                    : 'bg-white border-slate-200 hover:border-slate-350'
                                }`}
                              >
                                <img src={img} alt="" className="max-h-full object-contain" />
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <input
                              type="text"
                              placeholder="Or specify custom unsplash URL"
                              value={colorInput.imageUrl}
                              onChange={(e) => setColorInput({ ...colorInput, imageUrl: e.target.value })}
                              className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px]"
                            />
                            <label className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 py-1 rounded cursor-pointer shrink-0 font-bold uppercase transition-colors flex items-center gap-1">
                              <Upload className="h-3 w-3 text-slate-500" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleDeviceImageUpload(e, 'color')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddColorOption}
                          className="w-full py-1.5 bg-[#0e1321] text-white hover:bg-slate-800 text-[10px] uppercase font-bold tracking-wider rounded-lg cursor-pointer"
                        >
                          Add this variant option
                        </button>
                      </div>

                      {/* Product Image Gallery Block */}
                      <div className="space-y-1.5 pt-2.5 border-t border-slate-200">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Bike Image Carousel Images ({editingBike.images?.length || 0})</span>
                        <p className="text-[9px] text-slate-450 font-sans mt-0.5">
                          These images display in the product details carousel. You can add default images or paste any custom web URL below.
                        </p>
                        
                        {/* List of current carousel images */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                          {(!editingBike.images || editingBike.images.length === 0) ? (
                            <span className="text-[10px] text-slate-400 col-span-full italic py-1 text-center">No images added. One will be auto-assigned from colors.</span>
                          ) : (
                            editingBike.images.map((img, iIdx) => (
                              <div key={iIdx} className="relative h-14 rounded-lg bg-slate-50 border border-slate-150 p-1 flex items-center justify-center group overflow-hidden">
                                <img src={img} alt="" className="max-h-full object-contain" />
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveImage(img)}
                                  className="absolute top-1 right-1 h-5 w-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Direct Image Url */}
                        <div className="flex gap-2 mt-2 items-center">
                          <input 
                            type="text"
                            placeholder="Paste custom image url (Unsplash, etc.)"
                            id="direct_image_url_input"
                            className="flex-1 min-w-0 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white text-slate-800 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const inputEl = document.getElementById('direct_image_url_input') as HTMLInputElement;
                              if (inputEl && inputEl.value.trim()) {
                                handleAddDirectImage(inputEl.value.trim());
                                inputEl.value = '';
                              } else {
                                alert('Please input or paste a valid image URL first.');
                              }
                            }}
                            className="px-3 py-1.5 bg-[#0E1321] hover:bg-slate-800 text-white text-[10px] uppercase font-bold tracking-wider rounded-lg cursor-pointer shrink-0 font-sans"
                          >
                            Add URL
                          </button>
                          
                          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] uppercase font-bold tracking-wider rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors shrink-0 font-sans">
                            <Upload className="h-3 w-3 text-slate-500" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDeviceImageUpload(e, 'bike')}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Device File Upload Zone for Bike */}
                        <div className="mt-2.5 p-2 px-3 bg-[#A7E22E]/5 border border-[#A7E22E]/20 border-dashed rounded-xl flex items-center justify-between gap-3">
                          <div className="text-[9.5px] text-left">
                            <span className="block font-bold text-slate-700">Add Bike Photos from your Device</span>
                            <span className="text-[8.5px] text-slate-450 font-sans">Supports PNG, JPG, WEBP (Max 2MB)</span>
                          </div>
                          
                          <label className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-white text-[9.5px] uppercase font-bold tracking-wider rounded-lg cursor-pointer flex items-center gap-1">
                            <Upload className="h-3.5 w-3.5 text-[#A7E22E]" />
                            <span>Choose Photos</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDeviceImageUpload(e, 'bike')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        
                        {/* Or Quick Preset Image Selection */}
                        <div className="pt-1 select-none">
                          <span className="block text-[8.5px] text-slate-450 uppercase tracking-wide mb-1">Quick Select Presets:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {DEFAULT_BIKE_IMAGES.filter(img => !editingBike.images?.includes(img)).map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddDirectImage(img)}
                                className="h-7 w-10 index-btn rounded border border-slate-200 bg-white p-0.5 hover:border-slate-350 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                              >
                                <img src={img} alt="" className="max-h-full object-contain" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Submission and saves trigger */}
                  <div className="pt-3.5 border-t border-slate-100 flex justify-end gap-3 select-none">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditingBike(null); }}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1 shadow-sm hover:shadow"
                    >
                      <Save className="h-4 w-4" />
                      Save Bike specifications
                    </button>
                  </div>
                </form>
              )}


              {/* ------------ TAB 2: CLIENT ORDERS LEDGER ------------ */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="pb-2 border-b border-slate-100 flex justify-between items-center select-none">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight">
                        Secured Storefront Orders
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Track live credit-card payment checkouts, UPI validations, and transition transaction statuses.
                      </p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-[10px] bg-slate-150 hover:bg-slate-200 text-slate-550 hover:text-slate-900 font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
                      Refresh Data
                    </button>
                  </div>

                  {(!displayOrders || displayOrders.length === 0) ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="font-sans text-xs text-slate-500 font-bold">No orders placed by customers yet.</p>
                      <p className="font-sans text-[10px] text-slate-400 mt-0.5">Add products to your cart and complete checkout to see them here in real-time!</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      {displayOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/60 shadow-3xs transition-all text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 select-none">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] bg-slate-200 text-slate-650 px-2 py-0.5 rounded-md font-bold">ID: {order.orderId || order.id}</span>
                              <span className="font-sans text-[10px] text-slate-500">
                                {order.createdAt?.seconds 
                                  ? new Date(order.createdAt.seconds * 1000).toLocaleString('en-IN', {
                                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })
                                  : 'Syncing timestamp...'
                                }
                              </span>
                            </div>

                            {/* Orders status ADVANCER select menu */}
                            <div className="flex items-center gap-1.5 font-sans">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                              <select
                                value={order.status || 'placed'}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase text-slate-700 cursor-pointer focus:border-[#A7E22E] focus:outline-none"
                              >
                                <option value="placed">Placed / Processing</option>
                                <option value="paid">Paid (Razorpay/Card)</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered / Closed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Items included details */}
                          <div className="my-3 py-2 border-y border-slate-200/50 space-y-1.5 font-medium">
                            <p className="text-[10.5px] font-black uppercase tracking-widest text-[#5F6D50] mb-1 select-none">Cart list Items bought</p>
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-slate-650 text-[10.5px]">
                                <span className="truncate max-w-[280px]">{item.productName} ({item.selectedColor?.name || 'Default'}) x{item.quantity}</span>
                                <span className="font-mono text-slate-800">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="font-sans text-[10px] text-slate-400 leading-snug">
                              <p>Buyer UID: <span className="font-mono text-slate-550 break-all select-all font-semibold">{order.userId}</span></p>
                              {order.paymentMethod && (
                                <p className="mt-0.5">Method: <span className="font-bold text-slate-700 uppercase select-none">{order.paymentMethod}</span> {order.transactionId ? `[TXN: ${order.transactionId}]` : ''}</p>
                              )}
                            </div>

                            <div className="text-right flex items-baseline gap-1 bg-white border rounded-xl px-3 py-1.5 shadow-3xs self-end">
                              <span className="text-[10px] font-bold text-slate-500 uppercase select-none">Settlement:</span>
                              <span className="font-mono font-black text-xs text-slate-900 leading-none">₹{order.finalTotal}</span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              {/* ------------ TAB 3: VISUAL METRICS BOARD ------------ */}
              {activeTab === 'metrics' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="pb-2 border-b border-slate-100 select-none">
                    <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight">
                      Transactional Metrics &am; Analytics
                    </h3>
                    <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                      Check real-time customer checkouts, income stats, and baseline operational indices.
                    </p>
                  </div>

                  {/* Summary metrics bento-style cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                    <div className="bg-slate-50 border p-4.5 rounded-2xl flex flex-col justify-between">
                      <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Income</span>
                        <h4 className="font-mono text-lg font-black text-slate-900 mt-1">₹{totalRevenue}</h4>
                      </div>
                    </div>

                    <div className="bg-slate-50 border p-4.5 rounded-2xl flex flex-col justify-between">
                      <Activity className="h-5 w-5 text-[#A7E22E] mb-2" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Checkout Count</span>
                        <h4 className="font-mono text-lg font-black text-slate-900 mt-1">{totalSalesCount}</h4>
                      </div>
                    </div>

                    <div className="bg-slate-50 border p-4.5 rounded-2xl flex flex-col justify-between">
                      <ShoppingBag className="h-5 w-5 text-indigo-500 mb-2" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Basket</span>
                        <h4 className="font-mono text-lg font-black text-slate-900 mt-1">₹{averageBasketValue}</h4>
                      </div>
                    </div>

                    <div className="bg-slate-50 border p-4.5 rounded-2xl flex flex-col justify-between">
                      <BarChart2 className="h-5 w-5 text-amber-500_dark mb-2" style={{ color: '#EAB308' }} />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Models</span>
                        <h4 className="font-mono text-lg font-black text-slate-900 mt-1">{bikes.length}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Orders statuses visual breakdown */}
                  <div className="bg-slate-50/50 rounded-2xl border p-4">
                    <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1 select-none">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Catalog Distribution
                    </h4>

                    <div className="space-y-3.5">
                      {bikes.map((bike) => {
                        const bikeUnitsPlaced = displayOrders ? displayOrders.reduce((total, order) => {
                          const quantityInOrder = order.items?.filter((item: any) => item.productId === bike.id)
                            .reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) || 0;
                          return total + quantityInOrder;
                        }, 0) : 0;

                        return (
                          <div key={bike.id} className="space-y-1.5">
                            <div className="flex justify-between items-baseline text-[10.5px]">
                              <span className="font-semibold text-slate-700 truncate max-w-[250px]">{bike.name}</span>
                              <span className="font-mono font-bold text-slate-550 select-none">{bikeUnitsPlaced} pieces ordered</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 select-none overflow-hidden">
                              <div 
                                className="bg-[#A7E22E] h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, displayOrders && displayOrders.length > 0 ? (bikeUnitsPlaced / displayOrders.length) * 100 : 0)}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}


              {/* ------------ TAB 4: BLOGS CONTENT MANAGEMENT ------------ */}
              {activeTab === 'blogs' && !isEditingBlog && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight text-left">
                        Blogs Catalog
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Add, modify, or delete articles and first-birthday guides dynamically on the live stream.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                        setEditingBlog({
                          id: `blog-post-${Math.floor(1000 + Math.random() * 9000)}`,
                          title: '',
                          excerpt: '',
                          imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80',
                          date: today,
                          readTime: '3 min read',
                          author: 'Balanza Team',
                          content: []
                        });
                        setIsEditingBlog(true);
                      }}
                      className="bg-[#A7E22E] hover:bg-[#97cc24] text-slate-950 font-black text-[11px] px-3.5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      Add New Blog
                    </button>
                  </div>

                  {blogs.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="font-sans text-xs text-slate-500 font-bold">No articles currently published.</p>
                      <p className="font-sans text-[10px] text-slate-400 mt-1">Click "Add New Blog" to draft your first article.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {blogs.map((b) => (
                        <div 
                          key={b.id} 
                          className="p-3.5 rounded-2xl border border-slate-150 shadow-3xs flex flex-row gap-4 items-center bg-slate-50/40 hover:border-slate-350 transition-all"
                        >
                          <div className="h-14 w-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                            <img 
                              src={b.imageUrl} 
                              alt={b.title} 
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-xs font-extrabold text-slate-900 truncate leading-snug">
                              {b.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans leading-normal">
                              {b.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[9px] text-[#5F6D50] font-bold">
                              <span>By {b.author}</span>
                              <span>•</span>
                              <span>{b.date}</span>
                              <span>•</span>
                              <span>{b.readTime}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlog({ ...b });
                                setIsEditingBlog(true);
                              }}
                              className="h-8 w-8 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to permanently delete this blog post?')) {
                                  await deleteBlog(b.id);
                                  showFeedback('Blog post deleted successfully!');
                                }
                              }}
                              className="h-8 w-8 bg-white border border-slate-200 text-rose-550 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ------------ EDIT/ADD BLOG ARTICLE FORM ------------ */}
              {activeTab === 'blogs' && isEditingBlog && editingBlog && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingBlog.title || !editingBlog.excerpt) {
                      alert('Please provide a Title and Excerpt for the blog article.');
                      return;
                    }
                    const blogToSave: BlogPost = {
                      id: editingBlog.id || `blog-${Date.now()}`,
                      title: editingBlog.title,
                      excerpt: editingBlog.excerpt,
                      imageUrl: editingBlog.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80',
                      date: editingBlog.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                      readTime: editingBlog.readTime || '3 min read',
                      author: editingBlog.author || 'Balanza Team',
                      content: editingBlog.content && editingBlog.content.length > 0 ? editingBlog.content : ['Article drafted.']
                    };
                    
                    const isExisting = blogs.some(b => b.id === blogToSave.id);
                    if (isExisting) {
                      await updateBlog(blogToSave);
                      showFeedback('Blog article updated successfully!');
                    } else {
                      await addBlog(blogToSave);
                      showFeedback('New blog article published successfully!');
                    }
                    setIsEditingBlog(false);
                    setEditingBlog(null);
                  }}
                  className="space-y-3.5 animate-fade-in text-left select-text"
                >
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div>
                      <span className="font-mono text-[8.5px] bg-slate-900 text-[#A7E22E] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-max mb-1">
                        {blogs.some(b => b.id === editingBlog.id) ? 'Publisher Update Mode' : 'Draft New Article'}
                      </span>
                      <h3 className="font-display text-base font-extrabold text-slate-900 leading-snug">
                        {blogs.some(b => b.id === editingBlog.id) ? `Edit: ${editingBlog.title}` : 'Compose New Article'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsEditingBlog(false); setEditingBlog(null); }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase px-3 py-1.5 bg-slate-100 rounded-lg transition-colors cursor-pointer font-sans"
                    >
                      Back to Blogs list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">Article Title</label>
                        <input
                          type="text"
                          required
                          value={editingBlog.title || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                          placeholder="e.g. BALANZA MINI - The Perfect First Birthday Gift"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-75 font-sans font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">Author</label>
                          <input
                            type="text"
                            required
                            value={editingBlog.author || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                            placeholder="e.g. Balanza Team"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">Read Time</label>
                          <input
                            type="text"
                            required
                            value={editingBlog.readTime || ''}
                            onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                            placeholder="e.g. 5 min read"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-semibold text-slate-65 font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-sans">Cover Image</label>
                          <label className="text-[10px] text-[#5F6D50] hover:text-slate-950 font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5 text-[#A7E22E]" />
                            <span>Upload from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDeviceImageUpload(e, 'blog')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={editingBlog.imageUrl || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                          placeholder="Paste image url or upload from device above"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                        />
                        <div className="mt-1.5 flex gap-1 items-center font-sans">
                          <span className="text-[9px] text-slate-400">Quick recommendation:</span>
                          <button
                            type="button"
                            onClick={() => setEditingBlog({ ...editingBlog, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80' })}
                            className="text-[8.5px] bg-slate-150 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold"
                          >
                            Happy Ride
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBlog({ ...editingBlog, imageUrl: 'https://images.unsplash.com/photo-1530101121860-702f1a659890?w=1000&auto=format&fit=crop&q=80' })}
                            className="text-[8.5px] bg-slate-150 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold"
                          >
                            Outdoor Explorer
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">Brief Excerpt / Summary</label>
                        <textarea
                          required
                          rows={2.5}
                          value={editingBlog.excerpt || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                          placeholder="A high-level capture of what this article discusses, visible in cards."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 text-xs focus:outline-none resize-none font-sans leading-normal"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 flex flex-col">
                      <div className="flex-1 flex flex-col">
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#5F6D50] mb-1 flex justify-between items-center font-sans">
                          <span>Article Content Paragraphs</span>
                          <span className="text-[8.5px] font-extrabold text-[#8D9E7D] lowercase">Separate paragraphs with double-newlines</span>
                        </label>
                        <textarea
                          required
                          value={editingBlog.content?.join('\n\n') || ''}
                          onChange={(e) => {
                            const paras = e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean);
                            setEditingBlog({ ...editingBlog, content: paras });
                          }}
                          placeholder="Write paragraphs of the article here. Or separate them with empty lines.&#10;&#10;E.g.: First paragraph here.&#10;&#10;Second paragraph here!"
                          className="flex-grow w-full px-3 py-2 bg-[#FCFAF2] border border-slate-200 rounded-xl focus:border-[#8D9E7D] text-xs focus:outline-none resize-none font-sans min-h-[170px] max-h-[220px]"
                        />
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="block text-[9px] font-extrabold text-slate-500 uppercase mb-1 font-sans font-sans">Cover Image Preview</span>
                        <div className="h-14 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-1">
                          {editingBlog.imageUrl ? (
                            <img src={editingBlog.imageUrl} alt="preview" className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <span className="text-[10px] text-slate-400 italic font-sans">No image URL set.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 select-none">
                    <button
                      type="button"
                      onClick={() => { setIsEditingBlog(false); setEditingBlog(null); }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-550 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      Publish Article
                    </button>
                  </div>
                </form>
              )}


              {/* ------------ TAB 5: UI SETTINGS & CMS ------------ */}
              {activeTab === 'settings' && localSettings && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight text-left">
                        UI CMS Settings
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Customize hero texts, images, announcement settings, and feature lists dynamically.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await updateUISettings(localSettings);
                        setFeedback('UI Settings successfully saved and persisted!');
                        setTimeout(() => setFeedback(''), 4500);
                      } catch (err) {
                        setFeedback('Error saving UI Configuration');
                        setTimeout(() => setFeedback(''), 4500);
                      }
                    }}
                    className="space-y-6 pb-12"
                  >
                    {/* Announcement Bar Settings Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Volume2 className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Announcement Bar Settings
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8">
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">
                            Announcement Text
                          </label>
                          <input
                            type="text"
                            value={localSettings.announcementText || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, announcementText: e.target.value })}
                            placeholder="Enter announcement text bar content"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>

                        <div className="md:col-span-4 flex items-end">
                          <label className="flex items-center gap-2.5 bg-white border border-slate-205 px-3 py-2 rounded-xl cursor-pointer select-none w-full">
                            <input
                              type="checkbox"
                              checked={!!localSettings.announcementMoving}
                              onChange={(e) => setLocalSettings({ ...localSettings, announcementMoving: e.target.checked })}
                              className="accent-slate-800 h-3.5 w-3.5 rounded"
                            />
                            <span className="text-[11px] font-bold text-slate-600 font-sans">
                              Moving marquee text
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Banner Texts Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Sparkles className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Hero Banner Contents
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">
                            Hero Display Title Text
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroTitle || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                            placeholder="e.g. Built for Little Explorers"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">
                            Hero Subtitle / Description text
                          </label>
                          <textarea
                            rows={2.5}
                            value={localSettings.heroSubtitle || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                            placeholder="Provide details about balance starters quality and characteristics"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Background Carousel Images Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Image className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Hero Slide Images (3 images recommended)
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {[0, 1, 2].map((idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <span className="text-[10px] font-extrabold text-slate-400 font-sans w-16 uppercase">
                              Slide {idx + 1}
                            </span>
                            <div className="flex-grow flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={localSettings.heroImages?.[idx] || ''}
                                onChange={(e) => {
                                  const newImgs = [...(localSettings.heroImages || [])];
                                  newImgs[idx] = e.target.value;
                                  setLocalSettings({ ...localSettings, heroImages: newImgs });
                                }}
                                placeholder={`Image path or link URL (e.g. /images/bike_hero_${idx + 1}.png)`}
                                className="flex-grow min-w-0 px-3 py-1.5 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                              />
                              <label className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-xl cursor-pointer shrink-0 font-bold uppercase transition-colors flex items-center gap-1.5 font-sans">
                                <Upload className="h-3 w-3 text-slate-500" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleDeviceImageUpload(e, `hero-${idx}` as any)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {localSettings.heroImages?.[idx] && (
                              <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                                <img
                                  src={localSettings.heroImages[idx]}
                                  alt="Preview"
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section Titles Settings Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Edit3 className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Subsection Header Texts
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">
                            Why Balanza Section Header
                          </label>
                          <input
                            type="text"
                            value={localSettings.whyBalanzaTitle || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, whyBalanzaTitle: e.target.value })}
                            placeholder="Why Balance Bikes?"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-sans">
                            Loved by Parents / Instagram Section Header
                          </label>
                          <input
                            type="text"
                            value={localSettings.instagramTitle || ''}
                            onChange={(e) => setLocalSettings({ ...localSettings, instagramTitle: e.target.value })}
                            placeholder="Loved by Parents. Adored by Kids."
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Video and Why Balanza Settings Section */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Video className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Tutorial Video URL Configuration
                        </h4>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#8D9E7D] mb-1 font-sans">
                          Video Playback Source URL (mp4 supported)
                        </label>
                        <input
                          type="text"
                          value={localSettings.whyBalanzaVideoUrl || ''}
                          onChange={(e) => setLocalSettings({ ...localSettings, whyBalanzaVideoUrl: e.target.value })}
                          placeholder="Empty for poster thumbnail, or paste real mp4 link"
                          className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                        />
                        <span className="block text-[9px] text-slate-400 mt-1 italic font-sans font-medium">
                          Leave blank to use cinematic poster thumbnail modal by default.
                        </span>
                      </div>
                    </div>

                    {/* Features section grid items customization */}
                    <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-150">
                        <Grid className="h-4.5 w-4.5 text-[#8D9E7D]" />
                        <h4 className="font-display text-xs font-bold text-slate-800 uppercase tracking-widest">
                          Features Bar Customization (5 segments)
                        </h4>
                      </div>

                      <div className="space-y-4 divide-y divide-slate-200/60 max-h-[300px] overflow-y-auto pr-2">
                        {[0, 1, 2, 3, 4].map((idx) => {
                          const feat = localSettings.features?.[idx] || {
                            iconName: 'Feather',
                            title: '',
                            desc: ''
                          };
                          return (
                            <div key={idx} className={`pt-4 first:pt-0 space-y-3`}>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#8D9E7D] text-white text-[9px] rounded px-1.5 py-0.5 font-sans font-bold">
                                  Feature {idx + 1}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 font-sans">
                                    Icon Type (Lucide Name)
                                  </label>
                                  <input
                                    type="text"
                                    value={feat.iconName || 'Feather'}
                                    onChange={(e) => {
                                      const newFeatures = [...(localSettings.features || [])];
                                      newFeatures[idx] = { ...feat, iconName: e.target.value };
                                      setLocalSettings({ ...localSettings, features: newFeatures });
                                    }}
                                    placeholder="e.g. ShieldCheck, Feather, Award"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans font-medium"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 font-sans">
                                    Display Bold Title
                                  </label>
                                  <input
                                    type="text"
                                    value={feat.title || ''}
                                    onChange={(e) => {
                                      const newFeatures = [...(localSettings.features || [])];
                                      newFeatures[idx] = { ...feat, title: e.target.value };
                                      setLocalSettings({ ...localSettings, features: newFeatures });
                                    }}
                                    placeholder="e.g. Lightweight Frame"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans font-medium"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 font-sans">
                                    Brief Description Text
                                  </label>
                                  <input
                                    type="text"
                                    value={feat.desc || ''}
                                    onChange={(e) => {
                                      const newFeatures = [...(localSettings.features || [])];
                                      newFeatures[idx] = { ...feat, desc: e.target.value };
                                      setLocalSettings({ ...localSettings, features: newFeatures });
                                    }}
                                    placeholder="e.g. Easy to handle"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans font-medium"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 select-none">
                      <button
                        type="submit"
                        className="px-9 py-3 bg-zinc-900 hover:bg-black text-[#A7E22E] rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Save className="h-4.5 w-4.5" />
                        Save
                      </button>
                    </div>
                  </form>

                  {/* Secure Administrative Credentials Section */}
                  <div className="p-5 bg-amber-50/40 border border-amber-200/50 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-amber-200/40">
                      <ShieldAlert className="h-4.5 w-4.5 text-amber-700" />
                      <h4 className="font-display text-xs font-bold text-amber-850 uppercase tracking-widest font-sans">
                        Admin Credentials & Password Security
                      </h4>
                    </div>

                    <form onSubmit={handleChangeCredentials} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-550 mb-1 font-sans">
                            New Admin Username (Email)
                          </label>
                          <input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="e.g. admin@balanza.com"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                          <p className="text-[9px] text-slate-400 mt-1">Leave empty to retain the current credentials.</p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-550 mb-1 font-sans">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                          <p className="text-[9px] text-slate-400 mt-1">Passwords must be strong and securely hashed.</p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-550 mb-1 font-sans font-sans">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmAdminPassword}
                            onChange={(e) => setConfirmAdminPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-white border border-slate-205 rounded-xl focus:border-slate-800 text-xs focus:outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={isUpdatingCredentials}
                          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-750 text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {isUpdatingCredentials ? "Saving Updates..." : "Save Secure Credentials"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ------------ TAB 6: CONTACT INQUIRIES LIST VIEW ------------ */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight text-left uppercase">
                        Customer &amp; Dealer Inquiries
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        View and manage messages submitted from the "Send us a message" and "Dealer Inquiry" forms.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchInquiries}
                      disabled={isLoadingInquiries}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-2 select-none">
                    {(['all', 'contact', 'dealer'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setInquiryFilter(filter)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          inquiryFilter === filter
                            ? 'bg-slate-950 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {filter === 'all' ? 'All Inquiries' : filter === 'contact' ? 'Contact Messages' : 'Dealer Inquiries'}
                      </button>
                    ))}
                  </div>

                  {isLoadingInquiries && inquiries.length === 0 ? (
                    <div className="py-12 text-center">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 font-sans">Retrieving submissions...</p>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="bg-[#FCFAF2] border border-dashed border-slate-205 rounded-2xl py-12 px-4 text-center">
                      <Mail className="h-8 w-8 text-slate-400 mx-auto mb-2.5" />
                      <p className="text-xs font-bold text-slate-700 font-sans">No Inquiries Found</p>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-sm mx-auto">
                        Inquiries will appear here automatically when visitors submit the contact forms.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                      {inquiries
                        .filter(inq => inquiryFilter === 'all' || inq.type === inquiryFilter)
                        .map((inq, index) => (
                          <div
                            key={inq.id || index}
                            className="p-5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/60 shadow-3xs transition-all text-xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-2 select-none">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  inq.type === 'dealer'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200/50'
                                    : 'bg-sky-100 text-sky-800 border border-sky-200/50'
                                }`}>
                                  {inq.type === 'dealer' ? 'Dealer Inquiry' : 'Contact Message'}
                                </span>
                                <span className="font-mono text-[9px] text-slate-400">ID: {inq.id}</span>
                              </div>
                              <span className="font-sans text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {inq.submittedAt || (inq.createdAt && new Date(inq.createdAt).toLocaleString()) || 'Just now'}
                              </span>
                            </div>

                            {inq.type === 'contact' ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">Contact Details</p>
                                  <p className="font-sans text-slate-900 font-extrabold text-sm">{inq.name || inq.fullName}</p>
                                  <p className="font-mono text-slate-600 font-medium">Email: <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">{inq.email}</a></p>
                                  <p className="font-sans text-slate-600 font-bold">Phone: {inq.phone || 'Not specified'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">Message</p>
                                  <p className="font-sans text-slate-900 font-black text-xs">Subject: {inq.subject}</p>
                                  <p className="font-sans text-slate-700 bg-white p-2.5 rounded-xl border border-slate-150/80 leading-relaxed font-semibold italic">
                                    "{inq.message}"
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">Business &amp; Contact info</p>
                                  <p className="font-sans text-slate-900 font-black text-sm">{inq.businessName}</p>
                                  <p className="font-sans text-slate-700 font-extrabold text-xs">Contact Person: {inq.contactPerson}</p>
                                  <p className="font-mono text-slate-600">Email: <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">{inq.email}</a></p>
                                  <p className="font-sans text-slate-600 font-bold">Phone: {inq.phone}</p>
                                  <p className="font-sans text-slate-600 font-semibold">Location: {inq.city}, {inq.state}</p>
                                  {inq.website && inq.website !== 'Not specified' && (
                                    <p className="font-sans text-slate-600 font-medium">Website: <a href={inq.website.startsWith('http') ? inq.website : `https://${inq.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{inq.website}</a></p>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider">Business Profile</p>
                                  <p className="font-sans text-slate-800 font-bold text-xs">Business Type: <span className="font-black text-slate-950">{inq.businessType}</span></p>
                                  <p className="font-sans text-slate-800 font-bold text-xs">Years in Business: <span className="font-black text-slate-950">{inq.yearsInBusiness}</span></p>
                                  <p className="font-sans text-slate-800 font-bold text-xs">Store Locations: <span className="font-black text-slate-950">{inq.storesCount || inq.storeLocations || '1'}</span></p>
                                  <p className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider mt-2 block">Description / About</p>
                                  <p className="font-sans text-slate-700 bg-white p-2.5 rounded-xl border border-slate-150/80 leading-relaxed font-semibold italic">
                                    "{inq.about || inq.businessDescription}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}


              {/* ------------ TAB 7: VIDEO MANAGEMENT ------------ */}
              {activeTab === 'videos' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-display text-base font-extrabold text-slate-900 tracking-tight text-left uppercase text-left">
                        Product Video Gallery CMS
                      </h3>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5">
                        Upload, preview, replace, and delete video assets (MP4, MOV, WEBM) up to 50MB.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchVideos}
                      disabled={isLoadingVideos}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoadingVideos ? 'animate-spin' : ''}`} />
                      Refresh List
                    </button>
                  </div>

                  {/* Drag-and-drop / Click-to-upload Zone with file input */}
                  <div className="relative border-2 border-dashed border-slate-250 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-6 text-center transition-all">
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={(e) => handleVideoUpload(e)}
                      disabled={isUploadingVideo}
                      id="admin-video-file-input"
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-video-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2 select-none"
                    >
                      <div className="h-10 w-10 rounded-full bg-[#A7E22E]/10 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {isUploadingVideo && !replacingVideoId ? "Processing file upload stream..." : "Click to select or Drag & Drop Video"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Supports MP4, MOV, and WEBM formats (Max 50MB file size limits apply).
                        </p>
                      </div>
                    </label>

                    {/* Integrated Upload Progress Bar */}
                    {isUploadingVideo && videoUploadProgress !== null && !replacingVideoId && (
                      <div className="mt-4 max-w-md mx-auto space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                          <span>Uploading content stream</span>
                          <span>{videoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#A7E22E] h-full transition-all duration-150"
                            style={{ width: `${videoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main List & Table */}
                  {isLoadingVideos && videos.length === 0 ? (
                    <div className="py-12 text-center">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 font-sans">Syncing video database index...</p>
                    </div>
                  ) : videos.length === 0 ? (
                    <div className="bg-[#FCFAF2] border border-dashed border-slate-205 rounded-2xl py-12 px-4 text-center">
                      <Video className="h-8 w-8 text-slate-400 mx-auto mb-2.5" />
                      <p className="text-xs font-bold text-slate-705 font-sans">No Videos found.</p>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-sm mx-auto">
                        Your uploaded video assets represent dynamic background footage or modular product previews.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Video Counter Stat Banner */}
                      <div className="flex justify-between items-center bg-[#A7E22E]/10 border border-[#A7E22E]/20 rounded-xl px-4 py-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 font-sans">Active Video assets</span>
                        <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-[#A7E22E]/30 font-sans">{videos.length}</span>
                      </div>

                      {/* Video Products Responsive list table */}
                      <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-[#8D9E7D] font-sans select-none">
                                <th className="p-3.5 pl-4 w-32">Preview</th>
                                <th className="p-3.5">Filename & Size</th>
                                <th className="p-3.5 w-44">Upload Date</th>
                                <th className="p-3.5 text-right pr-4 w-44">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700 font-sans">
                              {videos.map((vid) => {
                                const formattedDate = vid.uploadedAt 
                                  ? new Date(vid.uploadedAt).toLocaleString(undefined, {
                                      dateStyle: 'medium',
                                      timeStyle: 'short'
                                    })
                                  : 'Unknown Date';

                                return (
                                  <tr key={vid.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="p-3 pl-4">
                                      <div className="w-24 aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-205">
                                        <video
                                          src={vid.url}
                                          controls
                                          preload="metadata"
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-900 font-mono">
                                      <div className="max-w-[200px] truncate" title={vid.name}>
                                        {vid.name}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-normal">{vid.size}</div>
                                      <div className="mt-1 text-[9px] text-[#8D9E7D] break-all bg-slate-50 border border-slate-150 inline-block px-1.5 py-0.5 rounded-md font-sans">
                                        {vid.url}
                                      </div>
                                    </td>
                                    <td className="p-3 text-slate-500 font-medium font-sans">
                                      <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {formattedDate}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right pr-4">
                                      <div className="flex justify-end items-center gap-2">
                                        <label className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-slate-550 flex items-center gap-1 transition-all cursor-pointer text-[10px] font-bold uppercase select-none">
                                          <RefreshCw className={`h-3 w-3 ${isUploadingVideo && replacingVideoId === vid.id ? 'animate-spin' : ''}`} />
                                          <span>Replace</span>
                                          <input
                                            type="file"
                                            accept="video/mp4,video/quicktime,video/webm"
                                            onChange={(e) => handleVideoUpload(e, vid.id)}
                                            disabled={isUploadingVideo}
                                            className="hidden"
                                          />
                                        </label>

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteVideo(vid.id)}
                                          className="p-1 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                          title="Delete Video"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>

                                      {isUploadingVideo && replacingVideoId === vid.id && videoUploadProgress !== null && (
                                        <div className="max-w-[120px] ml-auto mt-2 space-y-1">
                                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                              className="bg-amber-500 h-full transition-all duration-150"
                                              style={{ width: `${videoUploadProgress}%` }}
                                            />
                                          </div>
                                          <div className="text-[8px] text-amber-600 font-bold">Replacing: {videoUploadProgress}%</div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>
        )}

      </div>
    </div>
  );
}
