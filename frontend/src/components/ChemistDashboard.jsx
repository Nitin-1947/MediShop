import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ChemistChiragMascot, 
  CuteScannerMascot, 
  DrPillMascot, 
  CuteMedicineBottle 
} from './CartoonMascots';
import { 
  QrCode, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  RefreshCw, 
  Percent, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Sliders
} from 'lucide-react';
import { playPop, playSuccessChime, playCashDing } from '../utils/audio';

export default function ChemistDashboard({ initialEstimateToken = null, onClearToken }) {
  const [activeTab, setActiveTab] = useState('qr_scanner');
  const [pharmacyId, setPharmacyId] = useState('pharm-1'); // Default to Sanjivani 24/7 Medico
  const [inventoryList, setInventoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);

  // Scanner state
  const [scanInput, setScanInput] = useState(initialEstimateToken || 'EST-894102');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEstimate, setScannedEstimate] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [dispenseSuccess, setDispenseSuccess] = useState(null);

  // Dynamic Discounting State
  const [updatingInvId, setUpdatingInvId] = useState(null);

  // Regulatory Compliance logs
  const [complianceLogs, setComplianceLogs] = useState([]);

  // Fetch Inventory and Compliance Logs
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chemist/inventory/${pharmacyId}`);
      const data = await res.json();
      if (data.success) {
        setInventoryList(data.inventory);
        setNearExpiryCount(data.near_expiry_count);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplianceLogs = async () => {
    try {
      const res = await fetch(`/api/chemist/compliance-logs/${pharmacyId}`);
      const data = await res.json();
      if (data.success) {
        setComplianceLogs(data.logs);
      }
    } catch (err) {
      console.error("Error fetching compliance logs:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchComplianceLogs();
  }, [pharmacyId]);

  useEffect(() => {
    if (initialEstimateToken) {
      setScanInput(initialEstimateToken);
      handleLookupEstimate(initialEstimateToken);
    }
  }, [initialEstimateToken]);

  // Lookup Estimate by Token
  const handleLookupEstimate = async (tokenId = scanInput) => {
    if (!tokenId.trim()) return;
    setIsScanning(true);
    setScanError(null);
    setDispenseSuccess(null);
    playPop();

    try {
      const res = await fetch(`/api/estimates/${tokenId.trim()}`);
      const data = await res.json();

      setTimeout(() => {
        setIsScanning(false);
        if (data.success && data.estimate) {
          setScannedEstimate(data.estimate);
          playSuccessChime();
        } else {
          setScanError(data.error || "Estimate token not recognized.");
          setScannedEstimate(null);
        }
      }, 700);
    } catch (err) {
      setIsScanning(false);
      setScanError("Failed to connect to estimation service.");
    }
  };

  // Dispense & Redeem QR Token
  const handleDispense = async () => {
    if (!scannedEstimate) return;
    playPop();

    try {
      const res = await fetch('/api/estimates/verify-redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimate_id: scannedEstimate.id,
          chemist_name: "Chirag Sharma (Pharmacist Reg: KA-8890)",
          verified_doctor_reg_no: "KA-MED-49110"
        })
      });
      const data = await res.json();

      if (data.success) {
        playCashDing();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setDispenseSuccess(data.message);
        setScannedEstimate(data.estimate);
        fetchInventory();
        fetchComplianceLogs();
      } else {
        setScanError(data.error || "Dispense verification failed.");
      }
    } catch (err) {
      setScanError("Error processing dispense verification.");
    }
  };

  // Dynamic Discount Update (<60 Days Liquidation)
  const handleUpdateDiscount = async (invItem, newDiscount) => {
    setUpdatingInvId(invItem.id);
    playPop();

    try {
      const res = await fetch('/api/chemist/inventory/update-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory_id: invItem.id,
          override_discount: newDiscount
        })
      });
      const data = await res.json();
      if (data.success) {
        playSuccessChime();
        // Update local state
        setInventoryList(prev => prev.map(item => 
          item.id === invItem.id ? { ...item, current_effective_discount: newDiscount } : item
        ));
      }
    } catch (err) {
      console.error("Discount update error:", err);
    } finally {
      setUpdatingInvId(null);
    }
  };

  // Simulate POS CSV Bulk Upload
  const handleUploadPosCsv = async (format) => {
    playPop();
    try {
      const res = await fetch('/api/chemist/inventory/upload-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacy_id: pharmacyId, sample_format: format })
      });
      const data = await res.json();
      if (data.success) {
        playCashDing();
        confetti({ particleCount: 50, spread: 60 });
        alert(`Success! Synced with ${data.software_detected}. Processed ${data.rows_processed} medicine rows.`);
        fetchInventory();
      }
    } catch (err) {
      alert("Error syncing POS CSV.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Chemist Header Profile Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-emerald-100 via-mint-100 to-sunny-100 flex flex-col md:flex-row items-center justify-between gap-6 border-3">
        <div className="flex items-center gap-4">
          <ChemistChiragMascot size={90} className="shrink-0" />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-slate-900 rounded-full text-xs font-black shadow-cartoon-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Chemist Countertop Station Online
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Sanjivani 24/7 Medico & Chemist 🏪
            </h2>
            <div className="text-xs text-slate-700 font-bold flex flex-wrap items-center gap-3">
              <span>Licensed Chemist: Chirag Sharma</span>
              <span>•</span>
              <span>Drug License: KA-BLR-DL-2023-88219</span>
              <span>•</span>
              <span className="text-emerald-700">Flat Store Discount: 14%</span>
            </div>
          </div>
        </div>

        {/* Quick Expiry Warning Badge */}
        {nearExpiryCount > 0 && (
          <div className="p-4 bg-sunny-200 border-2 border-slate-900 rounded-2xl shadow-cartoon text-center space-y-1 shrink-0">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-900">
              <AlertTriangle className="w-4 h-4 text-sunny-700" />
              Dynamic Expiry Alert
            </div>
            <div className="text-xl font-black text-slate-900">
              {nearExpiryCount} Items &lt;60 Days
            </div>
            <button
              onClick={() => { playPop(); setActiveTab('dynamic_discounts'); }}
              className="text-xs font-black text-slate-900 underline hover:text-emerald-800"
            >
              Apply Liquidation Discounts →
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { playPop(); setActiveTab('qr_scanner'); }}
          className={`cartoon-btn ${activeTab === 'qr_scanner' ? 'bg-bubble-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <QrCode className="w-4 h-4" />
          1. Countertop QR Scanner Mode
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('dynamic_discounts'); }}
          className={`cartoon-btn ${activeTab === 'dynamic_discounts' ? 'bg-sunny-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <Sliders className="w-4 h-4" />
          2. Dynamic Expiry Discounting ({nearExpiryCount})
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('pos_inventory'); }}
          className={`cartoon-btn ${activeTab === 'pos_inventory' ? 'bg-mint-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <Package className="w-4 h-4" />
          3. POS Inventory & CSV Sync
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('compliance_register'); }}
          className={`cartoon-btn ${activeTab === 'compliance_register' ? 'bg-lavender-300 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          4. Schedule H/H1 Compliance Logger
        </button>
      </div>

      {/* TAB 1: COUNTERTOP QR SCANNER MODE */}
      {activeTab === 'qr_scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Input & Camera Simulator */}
          <div className="lg:col-span-5 cartoon-card p-6 bg-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-bubble-500" />
                Scan Customer Estimate Slip
              </h3>
              <CuteScannerMascot size={55} />
            </div>

            <p className="text-xs text-slate-600 font-semibold">
              When a customer walks in with a Medishop Estimate QR Code on their phone, scan or enter the 6-digit token to instantly unlock and verify the locked-in bill.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Customer Token ID / QR Data:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g. EST-894102"
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-900 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-bubble-400"
                />
                <button
                  onClick={() => handleLookupEstimate(scanInput)}
                  disabled={isScanning}
                  className="cartoon-btn cartoon-btn-primary"
                >
                  <Search className="w-4 h-4" />
                  <span>Lookup</span>
                </button>
              </div>

              {/* Sample QR token buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Quick Demo:</span>
                <button
                  onClick={() => {
                    setScanInput('EST-894102');
                    handleLookupEstimate('EST-894102');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 font-mono text-[11px] font-bold"
                >
                  EST-894102 (Sample)
                </button>
              </div>
            </div>

            {/* Simulated Laser Scanner Box */}
            <div className="p-6 bg-slate-900 rounded-2xl border-2 border-slate-900 text-center relative overflow-hidden space-y-2">
              <div className="w-28 h-28 mx-auto border-2 border-dashed border-red-400 rounded-xl flex items-center justify-center relative">
                <QrCode className="w-16 h-16 text-slate-600" />
                {isScanning && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-md shadow-red-500 animate-bounce" />
                )}
              </div>
              <div className="text-xs text-slate-300 font-bold">
                {isScanning ? "Scanning QR Code beam..." : "Point physical 2D barcode scanner or type token"}
              </div>
            </div>

            {scanError && (
              <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {scanError}
              </div>
            )}
          </div>

          {/* Scanned Slip Details & Dispense Action */}
          <div className="lg:col-span-7 cartoon-card p-6 bg-white space-y-5">
            <h3 className="text-xl font-black text-slate-900 pb-3 border-b-2 border-slate-100 flex items-center justify-between">
              <span>Estimate Verification Details</span>
              {scannedEstimate && (
                <span className={`cartoon-badge ${
                  scannedEstimate.status === 'VERIFIED_DISPENSED' 
                    ? 'bg-emerald-200 text-emerald-800' 
                    : 'bg-bubble-200 text-bubble-800'
                }`}>
                  Status: {scannedEstimate.status}
                </span>
              )}
            </h3>

            {scannedEstimate ? (
              <div className="space-y-4">
                {/* Customer & Timestamp info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold">Customer:</span>
                    <div className="font-black text-slate-900 text-sm mt-0.5">{scannedEstimate.customer_name}</div>
                    <div className="text-slate-500">{scannedEstimate.customer_phone}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold">Token ID:</span>
                    <div className="font-mono font-black text-bubble-600 text-sm mt-0.5">{scannedEstimate.id}</div>
                    <div className="text-slate-500">Expires 60m from issue</div>
                  </div>
                </div>

                {/* Schedule H / H1 Regulatory Compliance Check */}
                {scannedEstimate.schedule_compliance?.has_schedule_h ? (
                  <div className="p-3 bg-sunny-50 rounded-xl border-2 border-slate-900 flex items-start gap-2.5 text-xs text-sunny-900">
                    <ShieldCheck className="w-5 h-5 text-sunny-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black">Schedule H Drug Present — Prescription Verified!</div>
                      <div className="text-slate-600 mt-0.5">
                        Attaching Dr. Reg: <strong>{scannedEstimate.schedule_compliance.doctor_name}</strong> • Rx ID: <strong>{scannedEstimate.schedule_compliance.rx_id}</strong> to digital compliance register.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-mint-50 rounded-xl border-2 border-mint-400 flex items-center gap-2 text-xs font-bold text-mint-800">
                    <CheckCircle2 className="w-4 h-4 text-mint-600" />
                    All OTC items. No prescription attachment required.
                  </div>
                )}

                {/* Items to Dispense */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Reserved Bill Items ({scannedEstimate.items.length}):
                  </div>
                  <div className="divide-y divide-slate-200 border-2 border-slate-900 rounded-xl overflow-hidden bg-white text-xs">
                    {scannedEstimate.items.map((item, i) => (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-black text-slate-900">{item.brand_name}</div>
                          <div className="text-[11px] text-slate-500 font-bold">
                            Qty: {item.qty} strip • MRP ₹{item.mrp} (-{item.discount_pct}% OFF)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">₹{item.total_price}</div>
                          <div className="text-[10px] text-mint-600 font-bold">
                            Locked Net Rate
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Locked Amount */}
                <div className="p-4 bg-emerald-50 rounded-xl border-2 border-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-bold">Final Locked Bill (Collect at Counter):</div>
                    <div className="text-2xl font-black text-slate-900">₹{scannedEstimate.total_discounted_price}</div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-500">Customer Saved:</span>
                    <div className="text-base font-black text-emerald-600">₹{scannedEstimate.total_savings}</div>
                  </div>
                </div>

                {/* Dispense Action */}
                {scannedEstimate.status === 'RESERVED' ? (
                  <button
                    onClick={handleDispense}
                    className="w-full cartoon-btn cartoon-btn-mint py-3.5 text-base shadow-cartoon-hover"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify Rx & Dispense Medicines (Collect ₹{scannedEstimate.total_discounted_price})</span>
                  </button>
                ) : (
                  <div className="p-4 bg-slate-100 rounded-xl border-2 border-slate-300 text-center font-bold text-slate-600 text-sm">
                    ✅ This estimate has already been verified and dispensed!
                  </div>
                )}

                {dispenseSuccess && (
                  <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl text-xs font-black text-emerald-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    {dispenseSuccess} Customer can now post a Verified Pickup review!
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <DrPillMascot size={70} className="mx-auto opacity-40" />
                <div className="font-bold text-sm">No estimate slip loaded yet.</div>
                <div className="text-xs">Type or scan a valid token like <code>EST-894102</code> to inspect.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC EXPIRY DISCOUNTING */}
      {activeTab === 'dynamic_discounts' && (
        <div className="cartoon-card p-6 bg-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-6 h-6 text-sunny-500" />
                Dynamic Expiry Discounting Engine ⏳
              </h3>
              <p className="text-slate-600 text-sm font-semibold">
                Liquidate stock nearing expiry within 60 days. Increase discounts with one touch—nearby customers immediately discover your special clearance deals!
              </p>
            </div>
            <div className="cartoon-badge bg-sunny-100 text-sunny-800">
              {nearExpiryCount} Near-Expiry Alert Flags
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryList
              .filter(item => item.is_near_expiry)
              .map(item => (
                <div key={item.id} className="cartoon-card p-4 bg-sunny-50 border-2 border-sunny-400 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-base">{item.medicine?.brand_name}</div>
                      <div className="text-xs text-slate-600 font-bold">{item.medicine?.generic_salt}</div>
                    </div>
                    <span className="cartoon-badge bg-red-100 text-red-700 border-red-500 text-[11px]">
                      {item.days_until_expiry} Days Left!
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-bold">Batch:</span>
                      <div className="font-mono font-bold text-slate-800">{item.batch_no}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Stock:</span>
                      <div className="font-bold text-slate-800">{item.stock_quantity} strips</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Retail MRP:</span>
                      <div className="font-bold text-slate-800">₹{item.medicine?.mrp}</div>
                    </div>
                  </div>

                  {/* Interactive Discount Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-700">Clearance Discount:</span>
                      <span className="text-emerald-700 font-mono text-sm">{item.current_effective_discount}% OFF</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={item.current_effective_discount}
                        onChange={(e) => handleUpdateDiscount(item, parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">50% Max</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-semibold flex justify-between items-center pt-1 border-t border-slate-200">
                    <span>Effective Customer Price:</span>
                    <strong className="text-emerald-700 text-xs font-black">
                      ₹{(item.medicine?.mrp * (1 - item.current_effective_discount / 100)).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: POS INVENTORY & CSV SYNC */}
      {activeTab === 'pos_inventory' && (
        <div className="cartoon-card p-6 bg-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-mint-500" />
                POS Daily Stock Ingestion & Management
              </h3>
              <p className="text-slate-600 text-sm font-semibold">
                Sync daily inventory effortlessly via Marg ERP, Vyapar, or Tally CSV exports without tedious manual typing.
              </p>
            </div>

            {/* Quick POS Export Loaders */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleUploadPosCsv('Marg ERP')}
                className="cartoon-btn cartoon-btn-secondary text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Simulate Marg ERP Sync</span>
              </button>
              <button
                onClick={() => handleUploadPosCsv('Vyapar')}
                className="cartoon-btn cartoon-btn-secondary text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Simulate Vyapar Sync</span>
              </button>
            </div>
          </div>

          {/* Live Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-2 border-slate-900 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-white font-black uppercase">
                <tr>
                  <th className="p-3">Medicine & Salt</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Stock Qty</th>
                  <th className="p-3">Retail MRP</th>
                  <th className="p-3">Active Discount</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900 font-semibold">
                {inventoryList.map(item => (
                  <tr key={item.id} className={item.is_near_expiry ? 'bg-sunny-50' : 'bg-white hover:bg-slate-50'}>
                    <td className="p-3 font-black text-slate-900">
                      <div>{item.medicine?.brand_name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.medicine?.generic_salt}</div>
                    </td>
                    <td className="p-3 font-mono">{item.batch_no}</td>
                    <td className="p-3 font-mono">
                      {item.expiry_date}
                      {item.is_near_expiry && (
                        <span className="block text-[10px] text-red-600 font-black">
                          ({item.days_until_expiry} days left)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-black text-slate-900">{item.stock_quantity} units</td>
                    <td className="p-3">₹{item.medicine?.mrp}</td>
                    <td className="p-3 font-black text-emerald-700">
                      {item.current_effective_discount}% OFF
                    </td>
                    <td className="p-3">
                      <span className={`cartoon-badge ${
                        item.medicine?.schedule_category === 'Schedule H' ? 'bg-sunny-200 text-sunny-800' : 'bg-mint-200 text-mint-800'
                      }`}>
                        {item.medicine?.schedule_category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE H / H1 COMPLIANCE REGISTER */}
      {activeTab === 'compliance_register' && (
        <div className="cartoon-card p-6 bg-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-lavender-600" />
                Drugs & Cosmetics Act Compliance Audit Register
              </h3>
              <p className="text-slate-600 text-sm font-semibold">
                Statutory digital record keeping for all Schedule H / H1 prescription medicines dispensed via Medishop estimate slips.
              </p>
            </div>
            <div className="cartoon-badge bg-lavender-100 text-lavender-800">
              Regulatory Audit Ready
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-2 border-slate-900 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-white font-black uppercase">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Customer / Patient</th>
                  <th className="p-3">Prescribing Doctor</th>
                  <th className="p-3">Prescription ID</th>
                  <th className="p-3">Restricted Medicines</th>
                  <th className="p-3">Dispensed At</th>
                  <th className="p-3">Chemist Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900 font-semibold">
                {complianceLogs.map(log => (
                  <tr key={log.id} className="bg-white hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="p-3 font-black text-slate-900">{log.patient_name}</td>
                    <td className="p-3 text-slate-700">{log.doctor_name}</td>
                    <td className="p-3 font-mono text-purple-700 font-bold">{log.rx_id}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {log.drug_names.map((name, i) => (
                          <span key={i} className="px-2 py-0.5 bg-sunny-100 rounded border border-sunny-400 text-[10px] font-black text-slate-900">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{new Date(log.verified_at).toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-700">{log.verified_by_chemist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
