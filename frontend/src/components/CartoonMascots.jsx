import React from 'react';

// Clinical Medical Badge (Teal Cross & Prescription Shield)
export function DrPillMascot({ size = 80, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="100" rx="22" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2" />
      {/* Medical Cross */}
      <rect x="42" y="24" width="16" height="52" rx="8" fill="#0D9488" />
      <rect x="24" y="42" width="52" height="16" rx="8" fill="#0D9488" />
      {/* Center Vitality Ring */}
      <circle cx="50" cy="50" r="10" fill="#14B8A6" />
      <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
      {/* Precision Dots */}
      <circle cx="76" cy="24" r="4" fill="#2DD4BF" />
    </svg>
  );
}

// Professional Licensed Pharmacist / Drug Controller Shield
export function ChemistChiragMascot({ size = 80, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="100" rx="22" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      {/* Shield Outline */}
      <path d="M50 20 L78 30 V52 C78 70 50 82 50 82 C50 82 22 70 22 52 V30 Z" fill="#0F766E" />
      {/* Inner Verification Check */}
      <path d="M38 50 L46 58 L64 40" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="26" r="5" fill="#22C55E" />
    </svg>
  );
}

// 24/7 Rapid Proximity Indicator
export function SpeedyAmbulance({ size = 90, className = "" }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Van Body */}
      <rect x="15" y="22" width="110" height="48" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <path d="M90 22 H110 C120 22 125 30 128 42 L130 52 C130 58 126 62 120 62 H15 Z" fill="#F0FDFA" />
      {/* Teal Accent Line */}
      <rect x="15" y="46" width="112" height="6" fill="#0D9488" />
      {/* Emergency Cross */}
      <path d="M45 32 H55 M50 27 V37" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
      {/* Wheels */}
      <circle cx="42" cy="70" r="10" fill="#0F172A" />
      <circle cx="42" cy="70" r="4" fill="#94A3B8" />
      <circle cx="98" cy="70" r="10" fill="#0F172A" />
      <circle cx="98" cy="70" r="4" fill="#94A3B8" />
    </svg>
  );
}

// Pharmaceutical Formulation Icon
export function CuteMedicineBottle({ size = 60, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="80" height="80" rx="18" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="1.5" />
      {/* Bottle */}
      <rect x="25" y="24" width="30" height="42" rx="8" fill="#0D9488" />
      <rect x="32" y="16" width="16" height="8" rx="3" fill="#0F766E" />
      {/* Label */}
      <rect x="28" y="34" width="24" height="22" rx="4" fill="#FFFFFF" />
      <path d="M37 45 H43 M40 42 V48" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Precision Optical Scanner Icon
export function CuteScannerMascot({ size = 60, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="80" height="80" rx="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* QR/Barcode Reticle */}
      <path d="M22 32 V24 H30 M50 24 H58 V32 M22 48 V56 H30 M58 48 V56 H50" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
      {/* Laser line */}
      <line x1="20" y1="40" x2="60" y2="40" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
      <circle cx="40" cy="40" r="4" fill="#0D9488" />
    </svg>
  );
}

// Clean Minimal Health Grid Accent
export function CartoonCityscape({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden relative ${className}`}>
      <div className="h-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
    </div>
  );
}
