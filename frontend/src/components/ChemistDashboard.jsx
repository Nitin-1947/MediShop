import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ChemistBillOCRScanner from './ChemistBillOCRScanner';
import { 
  QrCode, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  RefreshCw, 
  Sliders, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  ArrowRight,
  TrendingDown,
  Scan,
  BadgeCheck,
  Check
} from 'lucide-react';
import { playPop, playSuccessChime, playCashDing } from '../utils/audio';

export default function ChemistDashboard({ 
  initialEstimateToken = null, 
  onClearToken, 
  activePharmacy = null,
  onSwitchToCustomer 
}) {
  const [activeTab, setActiveTab] = useState('bill_ocr'); // default to the new requested feature: bill_ocr!
  const [pharmacyId, setPharmacyId] = useState(activePharmacy?.id || 'pharm-1');
  const [pharmacyProfile, setPharmacyProfile] = useState(activePharmacy || null);
  const [inventoryList, setInventoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);

  // Scanner state
  const [scanInput, setScanInput] = useState(initialEstimateToken || 'EST-894102');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEstimate, setScannedEstimate] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [dispenseSuccess, setDispenseSuccess] = useState(null);

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
        if (!pharmacyProfile) {
          setPharmacyProfile(data.pharmacy);
        }
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
    if (activePharmacy) {
      setPharmacyId(activePharmacy.id);
      setPharmacyProfile(activePharmacy);
    }
  }, [activePharmacy]);

  useEffect(() => {
    fetchInventory();
    fetchComplianceLogs();
  }, [pharmacyId]);

  useEffect(() => {
    if (initialEstimateToken) {
      setActiveTab('qr_scanner');
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
      }, 600);
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
          chemist_name: pharmacyProfile?.owner_name || "Licensed Chemist",
          verified_doctor_reg_no: "KA-MED-49110"
        })
      });
      const data = await res.json();

      if (data.success) {
        playCashDing();
        confetti({
          particleCount: 70,
          spread: 60,
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
        setInventoryList(prev => prev.map(item => 
          item.id === invItem.id ? { ...item, current_effective_discount: newDiscount } : item
        ));
      }
    } catch (err) {
      console.error("Discount update error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chemist Header Profile Banner */}
      <div className="clinical-card p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
              <BadgeCheck className="w-4 h-4 text-teal-400" />
              Verified Licensed Retail Pharmacy
            </span>
            <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
              DL No: {pharmacyProfile?.license_number || "KA-BLR-DL-2023-88219"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{pharmacyProfile?.store_name || "Sanjivani 24/7 Medico & Chemist"}</span>
          </h2>

          <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 font-medium">
            <span>Owner: <strong className="text-white">{pharmacyProfile?.owner_name || "Chirag Sharma"}</strong></span>
            <span>•</span>
            <span>{pharmacyProfile?.address || "Indiranagar 100ft Road, Bengaluru"}</span>
            <span>•</span>
            <span className="text-teal-300">Flat Store Discount: {pharmacyProfile?.flat_store_discount || 14}%</span>
          </div>
        </div>

        {/* Quick Expiry Warning Badge */}
        {nearExpiryCount > 0 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-1 shrink-0">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Expiry Alert
            </div>
            <div className="text-lg font-bold text-white">
              {nearExpiryCount} Items &lt; 60 Days
            </div>
            <button
              onClick={() => { playPop(); setActiveTab('dynamic_discounts'); }}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline block"
            >
              Set Liquidation Discount →
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => { playPop(); setActiveTab('bill_ocr'); }}
          className={`clinical-btn ${
            activeTab === 'bill_ocr' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>1. Wholesaler Bill OCR Scanner</span>
          <span className="px-1.5 py-0.2 bg-teal-500 text-[10px] rounded text-white font-bold">New</span>
        </button>

        <button
          onClick={() => { playPop(); setActiveTab('qr_scanner'); }}
          className={`clinical-btn ${
            activeTab === 'qr_scanner' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>2. Countertop QR Pickup Verification</span>
        </button>

        <button
          onClick={() => { playPop(); setActiveTab('dynamic_discounts'); }}
          className={`clinical-btn ${
            activeTab === 'dynamic_discounts' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Dynamic Expiry Discounting ({nearExpiryCount})</span>
        </button>

        <button
          onClick={() => { playPop(); setActiveTab('pos_inventory'); }}
          className={`clinical-btn ${
            activeTab === 'pos_inventory' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>4. Live Store Inventory ({inventoryList.length})</span>
        </button>

        <button
          onClick={() => { playPop(); setActiveTab('compliance_register'); }}
          className={`clinical-btn ${
            activeTab === 'compliance_register' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>5. Schedule H/H1 Compliance Register</span>
        </button>
      </div>

      {/* TAB 1: WHOLESALER BILL OCR SCANNER */}
      {activeTab === 'bill_ocr' && (
        <ChemistBillOCRScanner
          pharmacyId={pharmacyId}
          onInventoryUpdated={() => fetchInventory()}
        />
      )}

      {/* TAB 2: COUNTERTOP QR SCANNER MODE */}
      {activeTab === 'qr_scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Input */}
          <div className="lg:col-span-5 clinical-card p-6 bg-white space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-teal-600" />
                <span>Verify Customer Estimate Slip</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Scan customer QR code or enter token to view locked-in quoted rates and verify Doctor prescription.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Token ID / Scanned Data:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g. EST-894102"
                  className="clinical-input font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleLookupEstimate(scanInput)}
                  disabled={isScanning}
                  className="clinical-btn-primary shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Lookup</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Sample Token:</span>
                <button
                  type="button"
                  onClick={() => {
                    setScanInput('EST-894102');
                    handleLookupEstimate('EST-894102');
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[11px] font-semibold text-slate-700"
                >
                  EST-894102
                </button>
              </div>
            </div>

            {scanError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{scanError}</span>
              </div>
            )}
          </div>

          {/* Scanned Slip Details */}
          <div className="lg:col-span-7 clinical-card p-6 bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Estimate Verification Details
              </h3>
              {scannedEstimate && (
                <span className={`clinical-badge ${
                  scannedEstimate.status === 'VERIFIED_DISPENSED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  Status: {scannedEstimate.status}
                </span>
              )}
            </div>

            {scannedEstimate ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold">Customer:</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{scannedEstimate.customer_name}</div>
                    <div className="text-slate-500">{scannedEstimate.customer_phone}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold">Token ID:</span>
                    <div className="font-mono font-bold text-teal-700 text-sm mt-0.5">{scannedEstimate.id}</div>
                    <div className="text-slate-500">60-Min Price Lock</div>
                  </div>
                </div>

                {/* Schedule H / Prescription check */}
                {scannedEstimate.schedule_compliance?.has_schedule_h && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Schedule H Drug Attached: </span>
                      {scannedEstimate.schedule_compliance.doctor_name} ({scannedEstimate.schedule_compliance.rx_id})
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Reserved Items ({scannedEstimate.items.length}):
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                    {scannedEstimate.items.map((item, i) => (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{item.brand_name}</div>
                          <div className="text-[11px] text-slate-500">
                            Qty: {item.qty} strip • MRP ₹{item.mrp} (-{item.discount_pct}% OFF)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">₹{item.total_price}</div>
                          <div className="text-[10px] text-teal-700 font-semibold">Locked Rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Locked Amount */}
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Final Quoted Bill (Collect at Counter):</div>
                    <div className="text-2xl font-bold text-slate-900">₹{scannedEstimate.total_discounted_price}</div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-500">Customer Saved:</span>
                    <div className="text-base font-bold text-emerald-700">₹{scannedEstimate.total_savings}</div>
                  </div>
                </div>

                {scannedEstimate.status === 'RESERVED' ? (
                  <button
                    onClick={handleDispense}
                    className="w-full clinical-btn-primary py-3 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Rx & Dispense Medicines (Collect ₹{scannedEstimate.total_discounted_price})</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-center font-bold text-slate-600 text-xs">
                    ✅ This estimate has already been verified and dispensed!
                  </div>
                )}

                {dispenseSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {dispenseSuccess}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <QrCode className="w-12 h-12 mx-auto text-slate-300" />
                <div className="font-semibold text-sm">No estimate slip loaded yet</div>
                <div className="text-xs">Type or scan an active estimate code to preview.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC EXPIRY DISCOUNTING */}
      {activeTab === 'dynamic_discounts' && (
        <div className="clinical-card p-6 bg-white space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                <span>Dynamic Expiry Discounting Engine</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Liquidate stock nearing expiry (&lt;60 days). Increasing clearance discounts immediately reflects in customer discovery.
              </p>
            </div>
            <div className="clinical-badge bg-amber-50 text-amber-800 border border-amber-200">
              {nearExpiryCount} Near-Expiry Flags
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventoryList
              .filter(item => item.is_near_expiry)
              .map(item => (
                <div key={item.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.medicine?.brand_name}</div>
                      <div className="text-xs text-slate-500">{item.medicine?.generic_salt}</div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded border border-rose-300">
                      {item.days_until_expiry} Days Left
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400">Batch:</span>
                      <div className="font-mono font-semibold text-slate-800">{item.batch_no}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Stock:</span>
                      <div className="font-bold text-slate-800">{item.stock_quantity} strips</div>
                    </div>
                    <div>
                      <span className="text-slate-400">MRP:</span>
                      <div className="font-bold text-slate-800">₹{item.medicine?.mrp}</div>
                    </div>
                  </div>

                  {/* Interactive Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Clearance Discount:</span>
                      <span className="text-teal-700 font-mono font-bold">{item.current_effective_discount}% OFF</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={item.current_effective_discount}
                        onChange={(e) => handleUpdateDiscount(item, parseFloat(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 shrink-0">50% Max</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE STORE INVENTORY */}
      {activeTab === 'pos_inventory' && (
        <div className="clinical-card p-6 bg-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                <span>Live Stock Inventory for {pharmacyProfile?.store_name}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Active medicine inventory mapped to this pharmacy. Updated in real-time by Distributor Bill OCR.
              </p>
            </div>
            <button
              onClick={() => { playPop(); setActiveTab('bill_ocr'); }}
              className="clinical-btn-primary text-xs py-2 px-3"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scan New Purchase Bill</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine & Generic Salt</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">In-Stock Qty</th>
                  <th className="p-3">Retail MRP</th>
                  <th className="p-3">Active Discount</th>
                  <th className="p-3">Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inventoryList.map(item => (
                  <tr key={item.id} className={item.is_near_expiry ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.medicine?.brand_name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.medicine?.generic_salt}</div>
                    </td>
                    <td className="p-3 font-mono">{item.batch_no}</td>
                    <td className="p-3 font-mono">
                      {item.expiry_date}
                      {item.is_near_expiry && (
                        <span className="block text-[10px] text-rose-600 font-bold">
                          ({item.days_until_expiry}d left)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{item.stock_quantity} units</td>
                    <td className="p-3 font-mono font-bold">₹{item.medicine?.mrp}</td>
                    <td className="p-3 font-mono text-teal-700 font-bold">{item.current_effective_discount}% OFF</td>
                    <td className="p-3">
                      <span className={`clinical-badge ${
                        item.medicine?.schedule_category === 'Schedule H' 
                          ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
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

      {/* TAB 5: REGULATORY COMPLIANCE REGISTER */}
      {activeTab === 'compliance_register' && (
        <div className="clinical-card p-6 bg-white space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Drugs & Cosmetics Act Compliance Register</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Mandatory statutory digital logs for all Schedule H / H1 prescription medicines dispensed at this counter.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Customer / Patient</th>
                  <th className="p-3">Prescribing Doctor</th>
                  <th className="p-3">Prescription ID</th>
                  <th className="p-3">Restricted Medicines</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {complianceLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-semibold text-slate-900">{log.id}</td>
                    <td className="p-3 font-bold text-slate-900">{log.patient_name}</td>
                    <td className="p-3 text-slate-600">{log.doctor_name}</td>
                    <td className="p-3 font-mono text-teal-700 font-bold">{log.rx_id}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {log.drug_names.map((name, i) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{new Date(log.verified_at).toLocaleString()}</td>
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
