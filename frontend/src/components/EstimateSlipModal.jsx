import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  X, 
  ArrowRight,
  QrCode,
  Building2
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function EstimateSlipModal({ isOpen, onClose, estimate, onOpenChemistScanner }) {
  const [secondsRemaining, setSecondsRemaining] = useState(60 * 60);

  useEffect(() => {
    if (!estimate) return;
    
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
      <div className="clinical-card bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Verified Price-Lock Guarantee
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            60-Minute Counter Reservation Slip
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Present this QR code at the pharmacy counter to collect reserved stock at quoted rates.
          </p>
        </div>

        {/* 60-Minute Countdown Timer Widget */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          secondsRemaining > 300 ? 'bg-teal-50/60 border-teal-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white border border-teal-200 text-teal-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Lock Guarantee Window</div>
              <div className="text-xs font-semibold text-slate-700">Expires in:</div>
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {formattedTimer}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block shadow-xs">
            <QRCodeSVG 
              value={qrPayload}
              size={160}
              level="H"
              includeMargin={false}
              fgColor="#0F172A"
            />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Estimate Token ID</div>
            <div className="text-base font-bold font-mono text-teal-700">
              {estimate.id}
            </div>
          </div>
        </div>

        {/* Pharmacy Details */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>{estimate.store_name}</span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Verified Retailer
            </span>
          </div>
          <div className="text-slate-500 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {estimate.store_address}
          </div>
          <div className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {estimate.store_phone} • DL No: {estimate.license_number}
          </div>
        </div>

        {/* Itemized Locked Bill */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Reserved Items ({estimate.items.length}):
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
            {estimate.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{item.brand_name}</div>
                  <div className="text-[11px] text-slate-400">
                    Qty: {item.qty} strip • MRP ₹{item.mrp} (-{item.discount_pct}% OFF)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-slate-900">₹{item.total_price}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    Save ₹{(item.mrp * item.qty - item.total_price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Totals */}
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Total Retail MRP:</span>
            <span>₹{estimate.total_mrp}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Total Locked Savings:</span>
            <span>- ₹{estimate.total_savings}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-teal-200">
            <span>Counter Payable:</span>
            <span className="text-teal-800 text-base font-mono">₹{estimate.total_discounted_price}</span>
          </div>
        </div>

        {/* Quick Simulation Link */}
        <button
          onClick={() => {
            playPop();
            onOpenChemistScanner(estimate.id);
          }}
          className="w-full clinical-btn-primary py-2.5 text-xs"
        >
          <QrCode className="w-4 h-4" />
          <span>Simulate: Scan this Token in Chemist Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
