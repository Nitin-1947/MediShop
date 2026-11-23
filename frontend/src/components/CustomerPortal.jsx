import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  DrPillMascot, 
  SpeedyAmbulance, 
  CuteMedicineBottle, 
  ChemistChiragMascot,
  CartoonCityscape
} from './CartoonMascots';
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
  HeartHandshake, 
  Phone,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { playPop, playSuccessChime, playCashDing } from '../utils/audio';

export default function CustomerPortal({ 
  onOpenOcrModal, 
  onGenerateEstimate, 
  cartItems, 
  setCartItems,
  onOpenReviews 
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
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // User simulated location (Indiranagar 100ft road)
  const userLat = 12.9716;
  const userLng = 77.6412;

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

  // Swap with lower cost generic substitute
  const handleSwapGeneric = (originalId, substitute) => {
    playCashDing();
    confetti({ particleCount: 40, spread: 50 });
    setCartItems(prev => {
      const existing = prev.find(i => i.id === originalId);
      const qty = existing ? existing.qty : 1;
      return prev
        .filter(i => i.id !== originalId)
        .concat([{ ...substitute, qty }]);
    });
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
          customer_name: "Rohan Verma",
          customer_phone: "+91 98450 12345",
          items: cartItems.map(i => ({ id: i.id, qty: i.qty }))
        })
      });
      const data = await res.json();
      if (data.success) {
        playSuccessChime();
        confetti({ particleCount: 90, spread: 80 });
        onGenerateEstimate(data.estimate);
      }
    } catch (err) {
      alert("Failed to generate estimate slip.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Cartoon Hero Banner */}
      <div className="cartoon-card p-6 md:p-8 bg-gradient-to-r from-bubble-200 via-mint-100 to-sunny-200 relative overflow-hidden border-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border-2 border-slate-900 rounded-full text-xs font-black shadow-cartoon-sm">
              <Sparkles className="w-4 h-4 text-sunny-500 fill-sunny-400" />
              Hyperlocal Medicine Discovery & Price Transparency
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Find Medicines in Nearby Pharmacies at Lowest Net Price! 💊
            </h1>
            <p className="text-slate-700 text-sm md:text-base font-semibold max-w-xl">
              Check real-time stock across licensed chemists in your neighborhood, compare total basket costs with active discounts, and lock in your price with a 60-min QR slip before you step out!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => { playPop(); onOpenOcrModal(); }}
                className="cartoon-btn cartoon-btn-pink py-2.5 px-5 text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Doctor's Prescription (OCR)</span>
              </button>

              <button
                onClick={() => { playPop(); setShowCartDrawer(true); }}
                className="cartoon-btn cartoon-btn-primary py-2.5 px-5 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Pre-Visit Cart ({cartItems.reduce((sum, i) => sum + i.qty, 0)})</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center items-center gap-2">
            <DrPillMascot size={130} className="animate-bounce-subtle" />
            <SpeedyAmbulance size={130} />
          </div>
        </div>

        {/* Decorative Cityscape at bottom */}
        <CartoonCityscape className="mt-4 opacity-75" />
      </div>

      {/* SEARCH & FILTER CONTROLS BAR */}
      <div className="cartoon-card p-5 bg-white space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Brand Name (e.g., Augmentin, Dolo) or Generic Salt..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-900 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-bubble-400 shadow-cartoon-sm"
            />
          </div>

          {/* Radius Selector */}
          <div className="md:col-span-3 flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border-2 border-slate-900 shadow-cartoon-sm">
            <MapPin className="w-4 h-4 text-bubble-600 shrink-0 ml-1.5" />
            <span className="text-xs font-black text-slate-700">Radius:</span>
            {[1.0, 3.0, 5.0].map(r => (
              <button
                key={r}
                onClick={() => { playPop(); setRadiusKm(r); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                  radiusKm === r ? 'bg-bubble-400 text-slate-900 border border-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* 24/7 Emergency Toggle */}
          <div className="md:col-span-3 flex items-center justify-between p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 shadow-cartoon-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-medipink-500" />
              <span className="text-xs font-black text-slate-900">24/7 Night Duty Only</span>
            </div>
            <button
              onClick={() => { playPop(); setIs24x7Only(!is24x7Only); }}
              className={`w-12 h-6 rounded-full border-2 border-slate-900 transition-colors p-0.5 flex items-center ${
                is24x7Only ? 'bg-mint-400 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white border border-slate-900 shadow-sm" />
            </button>
          </div>
        </div>

        {/* Category & Schedule Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-slate-100">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          {['ALL', 'Antibiotic', 'Analgesic', 'Gastrointestinal', 'Anti-Allergic', 'Cardiovascular', 'OTC'].map(cat => (
            <button
              key={cat}
              onClick={() => { playPop(); setSelectedCategory(cat); }}
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-slate-900 transition-all ${
                selectedCategory === cat ? 'bg-slate-900 text-white shadow-cartoon-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN SECTION: MEDICINE CATALOG & NEARBY STORES / CART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Medicines Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <CuteMedicineBottle size={36} />
              <span>Available Medicines in Your Zone ({medicines.length})</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Indiranagar Hub (560038)
            </span>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map(med => {
              const inCartItem = cartItems.find(i => i.id === med.id);
              const qty = inCartItem ? inCartItem.qty : 0;

              return (
                <div key={med.id} className="cartoon-card p-5 bg-white space-y-3 flex flex-col justify-between cartoon-card-hover">
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-slate-900 text-base leading-tight">
                          {med.brand_name}
                        </h3>
                        <div className="text-xs text-slate-500 font-bold mt-0.5">
                          {med.manufacturer}
                        </div>
                      </div>
                      <span className={`cartoon-badge ${
                        med.schedule_category === 'Schedule H' 
                          ? 'bg-sunny-200 text-sunny-800' 
                          : med.schedule_category === 'Schedule H1'
                            ? 'bg-medipink-200 text-medipink-800'
                            : 'bg-mint-200 text-mint-800'
                      }`}>
                        {med.schedule_category}
                      </span>
                    </div>

                    {/* Generic Salt Description */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 mt-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Salt Formula:</span>
                      {med.generic_salt}
                    </div>

                    <div className="text-[11px] text-slate-500 font-bold mt-2">
                      Pack: {med.pack_size}
                    </div>
                  </div>

                  {/* Generic Substitute Recommendation Banner if available */}
                  {med.substitutes && med.substitutes.length > 0 && (
                    <div className="p-2.5 bg-mint-50 rounded-xl border border-mint-300 text-xs space-y-1">
                      <div className="flex items-center justify-between text-mint-800 font-black">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-mint-600" />
                          Generic Alternative: {med.substitutes[0].brand_name}
                        </span>
                        <span className="text-emerald-700 font-mono">
                          Save ₹{med.substitutes[0].savings_vs_brand} ({med.substitutes[0].savings_pct}%)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const fullSub = medicines.find(m => m.id === med.substitutes[0].id);
                          if (fullSub) handleAddToCart(fullSub);
                        }}
                        className="text-[11px] font-bold text-mint-700 hover:underline flex items-center gap-1"
                      >
                        Add {med.substitutes[0].brand_name} (₹{med.substitutes[0].mrp}) instead →
                      </button>
                    </div>
                  )}

                  {/* Price & Cart Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 font-bold">MRP:</span>
                      <div className="text-xl font-black text-slate-900">₹{med.mrp}</div>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border-2 border-slate-900">
                        <button
                          onClick={() => handleUpdateQty(med.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-900 flex items-center justify-center font-black active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-black text-sm">{qty}</span>
                        <button
                          onClick={() => handleUpdateQty(med.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-900 flex items-center justify-center font-black active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(med)}
                        className="cartoon-btn cartoon-btn-primary py-2 px-3.5 text-xs"
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

        {/* Right Column: Pre-Visit Cart & Smart Estimate Matcher (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cart Header Card */}
          <div className="cartoon-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-bubble-500" />
                <h3 className="text-xl font-black text-slate-900">
                  Pre-Visit Basket ({cartItems.length})
                </h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => { playPop(); setCartItems([]); }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <DrPillMascot size={65} className="mx-auto opacity-50" />
                <div className="font-bold text-sm">Your basket is empty!</div>
                <p className="text-xs">
                  Add medicines or scan your prescription to compare nearby store prices in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart items list */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-black text-slate-900">{item.brand_name}</div>
                        <div className="text-[11px] text-slate-500 font-bold">₹{item.mrp} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">₹{(item.mrp * item.qty).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BEST SINGLE-SHOP COMPLETE MATCH CARD */}
                {estimationData && estimationData.single_store_matches && estimationData.single_store_matches.length > 0 && (
                  <div className="cartoon-card p-4 bg-bubble-50 border-2 border-bubble-500 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="cartoon-badge bg-bubble-200 text-bubble-800 text-[10px]">
                        Single-Shop 100% Match
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        Save {estimationData.single_store_matches[0].savings_percentage}%
                      </span>
                    </div>

                    <div>
                      <div className="font-black text-slate-900 text-base">
                        {estimationData.single_store_matches[0].store_name}
                      </div>
                      <div className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {estimationData.single_store_matches[0].distance_km} km away • {estimationData.single_store_matches[0].is_24_7 ? "24/7 Open" : "Open now"}
                      </div>
                    </div>

                    {/* Stock Status Indicator */}
                    <div className="p-2 bg-white rounded-xl border border-bubble-200 text-xs flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5 text-mint-700">
                        <CheckCircle2 className="w-4 h-4 text-mint-500" />
                        All {estimationData.single_store_matches[0].items_available_count} of {cartItems.length} Items In Stock
                      </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-3 bg-white rounded-xl border-2 border-slate-900 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500 font-bold">
                        <span>Total Retail MRP:</span>
                        <span>₹{estimationData.single_store_matches[0].total_mrp}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discounted Total:</span>
                        <span>- ₹{estimationData.single_store_matches[0].total_savings}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
                        <span>Locked Estimated Bill:</span>
                        <span className="text-bubble-600 text-base">₹{estimationData.single_store_matches[0].total_discounted_price}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCreateReservation(estimationData.single_store_matches[0].pharmacy_id)}
                      className="w-full cartoon-btn cartoon-btn-primary py-2.5 text-xs shadow-cartoon-hover"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Lock In Price & Generate 60-Min QR Slip</span>
                    </button>
                  </div>
                )}

                {/* SPLIT-CART SAVINGS MATCH (IF HIGHER SAVINGS FOUND!) */}
                {estimationData && estimationData.split_cart_match && (
                  <div className="cartoon-card p-4 bg-sunny-50 border-2 border-sunny-500 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="cartoon-badge bg-sunny-200 text-sunny-800 text-[10px]">
                        Split-Cart Match Recommendation
                      </span>
                      <span className="text-xs font-black text-sunny-700 animate-wiggle">
                        Save +₹{estimationData.split_cart_match.extra_savings_vs_single} Extra!
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold">
                      Split your basket across 2 neighboring shops to get highest clearance discounts:
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-sunny-300">
                        <div className="font-black text-slate-900">
                          1. {estimationData.split_cart_match.store_a.store_name} ({estimationData.split_cart_match.store_a.distance_km} km)
                        </div>
                        <div className="text-[11px] text-slate-600 font-bold">
                          Items: {estimationData.split_cart_match.store_a.items.map(i => i.brand_name).join(', ')}
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded-lg border border-sunny-300">
                        <div className="font-black text-slate-900">
                          2. {estimationData.split_cart_match.store_b.store_name} ({estimationData.split_cart_match.store_b.distance_km} km)
                        </div>
                        <div className="text-[11px] text-slate-600 font-bold">
                          Items: {estimationData.split_cart_match.store_b.items.map(i => i.brand_name).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-black pt-1">
                      <span>Combined Net Bill:</span>
                      <span className="text-emerald-700 text-sm font-mono">
                        ₹{estimationData.split_cart_match.combined_net_bill}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nearby Verified Pharmacies Directory */}
          <div className="cartoon-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Verified Pharmacies in {radiusKm} km Zone ({pharmacies.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {pharmacies.map(pharm => (
                <div key={pharm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">{pharm.store_name}</span>
                    <span className="text-bubble-600 font-black">{pharm.distance_km} km</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">{pharm.address}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-emerald-700 font-bold">Flat {pharm.flat_store_discount}% OFF</span>
                    <button
                      onClick={() => onOpenReviews(pharm)}
                      className="text-slate-700 hover:text-bubble-600 font-black flex items-center gap-1"
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
