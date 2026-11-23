import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Camera, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  TrendingDown, 
  Phone,
  QrCode,
  ShieldCheck,
  Building2,
  Filter,
  Check
} from 'lucide-react';
import { playPop, playSuccessChime, playCashDing } from '../utils/audio';

export default function CustomerPortal({ 
  onOpenOcrModal, 
  onGenerateEstimate, 
  cartItems, 
  setCartItems,
  onOpenReviews,
  currentUser 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSchedule, setSelectedSchedule] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [is24x7Only, setIs24x7Only] = useState(false);

  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoadingMeds, setIsLoadingMeds] = useState(false);

  // Cart Estimation Results from backend
  const [estimationData, setEstimationData] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // User location coordinates
  const userLat = currentUser?.user?.lat || 12.9716;
  const userLng = currentUser?.user?.lng || 77.6412;

  // Fetch medicines catalog
  const fetchMedicines = async () => {
    setIsLoadingMeds(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedSchedule !== 'ALL') params.append('schedule', selectedSchedule);

      const res = await fetch(`/api/medicines?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMedicines(data.medicines);
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setIsLoadingMeds(false);
    }
  };

  // Fetch nearby pharmacies
  const fetchPharmacies = async () => {
    try {
      const res = await fetch(`/api/pharmacies?lat=${userLat}&lng=${userLng}&radius=${radiusKm}&is_24_7=${is24x7Only}`);
      const data = await res.json();
      if (data.success) {
        setPharmacies(data.pharmacies);
      }
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [searchQuery, selectedCategory, selectedSchedule]);

  useEffect(() => {
    fetchPharmacies();
  }, [radiusKm, is24x7Only]);

  // Real-time Multi-Item Cart Cost Calculation Logic
  useEffect(() => {
    if (cartItems.length === 0) {
      setEstimationData(null);
      return;
    }

    const calculateCartEstimate = async () => {
      setIsEstimating(true);
      try {
        const payload = {
          user_lat: userLat,
          user_lng: userLng,
          radius_km: radiusKm,
          items: cartItems.map(item => ({ id: item.id, qty: item.qty || 1 }))
        };

        const res = await fetch('/api/cart/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setEstimationData(data);
        }
      } catch (err) {
        console.error("Cart estimate error:", err);
      } finally {
        setIsEstimating(false);
      }
    };

    calculateCartEstimate();
  }, [cartItems, radiusKm]);

  // Cart operations
  const handleAddToCart = (medicine) => {
    playPop();
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.id === medicine.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...medicine, qty: 1 }];
    });
  };

  const handleUpdateQty = (medicineId, delta) => {
    playPop();
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === medicineId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (medicineId) => {
    playPop();
    setCartItems(prev => prev.filter(i => i.id !== medicineId));
  };

  // Trigger locked estimate reservation
  const handleCreateReservation = async (pharmacyId) => {
    playPop();
    try {
      const res = await fetch('/api/estimates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          customer_name: currentUser?.user?.full_name || "Rahul Verma",
          customer_phone: currentUser?.user?.phone || "+91 98450 12345",
          items: cartItems.map(i => ({ id: i.id, qty: i.qty }))
        })
      });
      const data = await res.json();
      if (data.success) {
        playSuccessChime();
        confetti({ particleCount: 85, spread: 75 });
        onGenerateEstimate(data.estimate);
      }
    } catch (err) {
      alert("Failed to generate estimate slip.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Clean Slate & Clinical Teal Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-xs font-semibold text-teal-300">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Hyperlocal Medicine Availability & Counter Price Lock
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find Prescription & OTC Medicines in Local Pharmacies at Lowest Net Cost.
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            Check real-time stock across licensed retail pharmacies, compare multi-item basket rates with active discounts, and lock in your price with a 60-minute QR estimate slip before stepping out.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => { playPop(); onOpenOcrModal(); }}
              className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Doctor's Prescription (OCR)</span>
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pl-1">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Drugs & Cosmetics Act 1940 Compliant</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="clinical-card p-4 sm:p-5 bg-white space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Brand Name (e.g., Augmentin, Dolo) or Generic Salt..."
              className="clinical-input pl-10 text-xs sm:text-sm"
            />
          </div>

          {/* Radius Selector */}
          <div className="md:col-span-3 flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-1.5" />
            <span className="text-xs font-semibold text-slate-600">Radius:</span>
            {[1.0, 3.0, 5.0].map(r => (
              <button
                key={r}
                onClick={() => { playPop(); setRadiusKm(r); }}
                className={`flex-1 py-1 rounded text-xs font-semibold transition-all ${
                  radiusKm === r ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* 24/7 Filter */}
          <div className="md:col-span-3 flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>24/7 Night Duty Only</span>
            </div>
            <button
              onClick={() => { playPop(); setIs24x7Only(!is24x7Only); }}
              className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                is24x7Only ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider mr-1 text-[11px]">
            Therapeutic Class:
          </span>
          {['ALL', 'Antibiotic', 'Analgesic', 'Gastrointestinal', 'Anti-Allergic', 'Cardiovascular', 'OTC'].map(cat => (
            <button
              key={cat}
              onClick={() => { playPop(); setSelectedCategory(cat); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: CATALOG & PRE-VISIT CART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Medicine Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-slate-900">
              Verified Medicines in Your Radius ({medicines.length})
            </h2>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Verified Pharmacy Network
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map(med => {
              const inCartItem = cartItems.find(i => i.id === med.id);
              const qty = inCartItem ? inCartItem.qty : 0;

              return (
                <div key={med.id} className="clinical-card p-4 bg-white flex flex-col justify-between clinical-card-hover space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {med.brand_name}
                        </h3>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {med.manufacturer}
                        </div>
                      </div>

                      <span className={`clinical-badge ${
                        med.schedule_category === 'Schedule H' 
                          ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                          : med.schedule_category === 'Schedule H1'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {med.schedule_category}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 mt-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Salt Formula:</span>
                      {med.generic_salt}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 font-medium">
                      Pack: {med.pack_size}
                    </div>
                  </div>

                  {/* Generic Substitute Banner */}
                  {med.substitutes && med.substitutes.length > 0 && (
                    <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          Generic: {med.substitutes[0].brand_name}
                        </span>
                        <span className="text-emerald-700 font-mono">
                          Save {med.substitutes[0].savings_pct}% (₹{med.substitutes[0].savings_vs_brand})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const fullSub = medicines.find(m => m.id === med.substitutes[0].id);
                          if (fullSub) handleAddToCart(fullSub);
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        Add {med.substitutes[0].brand_name} (₹{med.substitutes[0].mrp}) instead →
                      </button>
                    </div>
                  )}

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Retail MRP</span>
                      <span className="text-lg font-bold font-mono text-slate-900">₹{med.mrp}</span>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => handleUpdateQty(med.id, -1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-slate-800">{qty}</span>
                        <button
                          onClick={() => handleUpdateQty(med.id, 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(med)}
                        className="clinical-btn-primary text-xs py-1.5 px-3"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Basket</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pre-Visit Cart & Smart Estimate (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="clinical-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Pre-Visit Basket ({cartItems.length})
                </h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => { playPop(); setCartItems([]); }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                <div className="font-semibold text-xs text-slate-600">Your basket is empty</div>
                <p className="text-[11px] text-slate-400">
                  Add medicines or scan your prescription to compare nearby store prices in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart items list */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.brand_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">₹{item.mrp} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">₹{(item.mrp * item.qty).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BEST SINGLE-SHOP COMPLETE MATCH CARD */}
                {estimationData && estimationData.single_store_matches && estimationData.single_store_matches.length > 0 && (
                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="clinical-badge bg-teal-100 text-teal-800 text-[10px]">
                        Single-Shop 100% Match
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        Save {estimationData.single_store_matches[0].savings_percentage}%
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {estimationData.single_store_matches[0].store_name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {estimationData.single_store_matches[0].distance_km} km away • {estimationData.single_store_matches[0].is_24_7 ? "24/7 Duty" : "Open now"}
                      </div>
                    </div>

                    {/* Stock status */}
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center font-semibold text-teal-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        All {estimationData.single_store_matches[0].items_available_count} of {cartItems.length} Items In Stock
                      </span>
                    </div>

                    {/* Price breakdown */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Retail MRP Total:</span>
                        <span>₹{estimationData.single_store_matches[0].total_mrp}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Total Quoted Savings:</span>
                        <span>- ₹{estimationData.single_store_matches[0].total_savings}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100 text-sm">
                        <span>Locked Estimated Bill:</span>
                        <span className="text-teal-700 font-mono">₹{estimationData.single_store_matches[0].total_discounted_price}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCreateReservation(estimationData.single_store_matches[0].pharmacy_id)}
                      className="w-full clinical-btn-primary py-2.5 text-xs"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Lock In Price & Generate 60-Min QR Slip</span>
                    </button>
                  </div>
                )}

                {/* SPLIT-CART MATCH */}
                {estimationData && estimationData.split_cart_match && (
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="clinical-badge bg-amber-100 text-amber-800 text-[10px]">
                        Split-Cart Match Recommendation
                      </span>
                      <span className="text-xs font-bold text-amber-800">
                        Save +₹{estimationData.split_cart_match.extra_savings_vs_single} Extra!
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Splitting basket between 2 neighboring stores provides higher discount rates:
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <div className="font-bold text-slate-900">
                          1. {estimationData.split_cart_match.store_a.store_name} ({estimationData.split_cart_match.store_a.distance_km} km)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Items: {estimationData.split_cart_match.store_a.items.map(i => i.brand_name).join(', ')}
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded border border-amber-200">
                        <div className="font-bold text-slate-900">
                          2. {estimationData.split_cart_match.store_b.store_name} ({estimationData.split_cart_match.store_b.distance_km} km)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Items: {estimationData.split_cart_match.store_b.items.map(i => i.brand_name).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                      <span>Combined Net Bill:</span>
                      <span className="text-emerald-700 font-mono">
                        ₹{estimationData.split_cart_match.combined_net_bill}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verified Nearby Pharmacies Directory */}
          <div className="clinical-card p-5 bg-white space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-teal-600" />
              Verified Pharmacies ({pharmacies.length})
            </h4>

            <div className="space-y-2">
              {pharmacies.map(pharm => (
                <div key={pharm.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{pharm.store_name}</span>
                    <span className="text-teal-700 font-mono font-semibold">{pharm.distance_km} km</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{pharm.address}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-emerald-700 font-bold">{pharm.flat_store_discount}% Store Discount</span>
                    <button
                      onClick={() => onOpenReviews(pharm)}
                      className="text-slate-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      {pharm.rating} ({pharm.reviews_count})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
