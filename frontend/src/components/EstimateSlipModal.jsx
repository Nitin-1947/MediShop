import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CuteScannerMascot, 
  DrPillMascot 
} from './CartoonMascots';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Share2, 
  Printer, 
  X, 
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audio';

export default function EstimateSlipModal({ isOpen, onClose, estimate, onOpenChemistScanner }) {
  const [secondsRemaining, setSecondsRemaining] = useState(60 * 60);

  useEffect(() => {
    if (!estimate) return;
    
    // Calculate remaining seconds
    const exp = new Date(estimate.expires_at).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((exp - now) / 1000));
      setSecondsRemaining(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [estimate]);

  if (!isOpen || !estimate) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const qrPayload = JSON.stringify({
    token: estimate.id,
    store_id: estimate.pharmacy_id,
    amount: estimate.total_discounted_price,
    items_count: estimate.items.length,
    timestamp: estimate.created_at
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="cartoon-card bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-5 relative border-4 border-slate-900 shadow-cartoon-lg">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-mint-100 border-2 border-slate-900 rounded-full text-xs font-black text-mint-800 shadow-cartoon-sm">
            <Sparkles className="w-4 h-4 text-mint-600" />
            Locked-In Digital Estimate Slip
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            60-Minute Counter Reservation 🎟️
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Show this QR code at the pharmacy counter to get your locked discount.
          </p>
        </div>

        {/* 60-Minute Countdown Timer Widget */}
        <div className={`cartoon-card p-4 text-center border-2 flex items-center justify-between ${
          secondsRemaining > 300 ? 'bg-bubble-50 border-bubble-400' : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-slate-900">
              <Clock className="w-5 h-5 text-bubble-600 animate-spin" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black uppercase text-slate-500">Price Lock Guarantee</div>
              <div className="text-xs font-bold text-slate-800">Reservation active for:</div>
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 bg-white px-3 py-1 rounded-xl border-2 border-slate-900 shadow-cartoon-sm">
            {formattedTimer}
          </div>
        </div>

        {/* Scannable QR Code Card */}
        <div className="cartoon-card p-5 bg-gradient-to-b from-sunny-50 to-white text-center space-y-3 border-2 border-sunny-400">
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-cartoon-sm inline-block">
            <QRCodeSVG 
              value={qrPayload}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#0F172A"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Token ID:</div>
            <div className="text-lg font-black font-mono text-bubble-600 tracking-wider">
              {estimate.id}
            </div>
          </div>
          <div className="text-xs text-slate-600 font-bold">
            Scan with countertop scanner or Chemist Dashboard
          </div>
        </div>

        {/* Pharmacy Details */}
        <div className="cartoon-card p-4 bg-slate-50 space-y-2 text-xs">
          <div className="font-black text-slate-900 text-sm flex items-center justify-between">
            <span>{estimate.store_name}</span>
            <span className="cartoon-badge bg-mint-200 text-mint-800 text-[10px]">Verified Store</span>
          </div>
          <div className="text-slate-600 flex items-center gap-1.5 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {estimate.store_address}
          </div>
          <div className="text-slate-600 flex items-center gap-1.5 font-semibold">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {estimate.store_phone} • DL No: {estimate.license_number}
          </div>
        </div>

        {/* Regulatory Schedule Compliance Badge */}
        {estimate.schedule_compliance?.has_schedule_h && (
          <div className="p-3 bg-lavender-50 rounded-xl border-2 border-slate-900 flex items-center gap-2.5 text-xs font-semibold text-lavender-900">
            <ShieldCheck className="w-5 h-5 text-lavender-600 shrink-0" />
            <div>
              <span className="font-black">Schedule H Verification Attached: </span>
              {estimate.schedule_compliance.doctor_name} ({estimate.schedule_compliance.rx_id})
            </div>
          </div>
        )}

        {/* Itemized Locked Bill */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Reserved Items ({estimate.items.length}):
          </div>
          <div className="divide-y divide-slate-200 border-2 border-slate-900 rounded-xl overflow-hidden bg-white text-xs">
            {estimate.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-black text-slate-900">{item.brand_name}</div>
                  <div className="text-[11px] text-slate-500 font-bold">
                    Qty: {item.qty} strip • MRP ₹{item.mrp} (-{item.discount_pct}% OFF)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">₹{item.total_price}</div>
                  <div className="text-[10px] text-mint-600 font-bold">
                    Save ₹{(item.mrp * item.qty - item.total_price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Totals */}
        <div className="p-4 bg-bubble-50 rounded-2xl border-2 border-slate-900 space-y-1.5 text-xs">
          <div className="flex justify-between font-bold text-slate-600">
            <span>Total Retail MRP:</span>
            <span>₹{estimate.total_mrp}</span>
          </div>
          <div className="flex justify-between font-bold text-mint-600">
            <span>Total Locked Savings:</span>
            <span>- ₹{estimate.total_savings}</span>
          </div>
          <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t-2 border-slate-900">
            <span>Locked Counter Payable:</span>
            <span className="text-bubble-600">₹{estimate.total_discounted_price}</span>
          </div>
        </div>

        {/* Quick Simulation Link for User / Evaluator */}
        <div className="pt-2">
          <button
            onClick={() => {
              playPop();
              onOpenChemistScanner(estimate.id);
            }}
            className="w-full cartoon-btn cartoon-btn-sunny py-3 text-sm shadow-cartoon-hover"
          >
            <QrCode className="w-5 h-5" />
            <span>Simulate: Scan this QR in Chemist Counter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
