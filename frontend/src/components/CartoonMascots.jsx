import React from 'react';

// Dr. Pill / Dr. Capsule Mascot
export function DrPillMascot({ size = 100, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="35" ry="6" fill="#CBD5E1" />
      
      {/* Pill Capsule Body */}
      <g>
        {/* Top Half (Sky Blue) */}
        <path d="M35 55 C35 30 85 30 85 55 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="4" />
        {/* Bottom Half (Mint Green) */}
        <path d="M35 55 C35 85 85 85 85 55 Z" fill="#34D399" stroke="#0F172A" strokeWidth="4" />
        {/* Dividing Belt */}
        <line x1="33" y1="55" x2="87" y2="55" stroke="#0F172A" strokeWidth="4" />
      </g>

      {/* Head Mirror / Doctor Band */}
      <rect x="42" y="24" width="36" height="6" rx="3" fill="#F43F5E" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="60" cy="22" r="7" fill="#FDE047" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="60" cy="22" r="3" fill="#FFFFFF" />

      {/* Glasses */}
      <circle cx="48" cy="45" r="9" fill="white" stroke="#0F172A" strokeWidth="3" />
      <circle cx="72" cy="45" r="9" fill="white" stroke="#0F172A" strokeWidth="3" />
      <line x1="57" y1="45" x2="63" y2="45" stroke="#0F172A" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="49" cy="45" r="4" fill="#0F172A" />
      <circle cx="51" cy="43" r="1.5" fill="white" />
      <circle cx="73" cy="45" r="4" fill="#0F172A" />
      <circle cx="75" cy="43" r="1.5" fill="white" />

      {/* Cheerful Smile */}
      <path d="M52 64 Q60 74 68 64" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="#F43F5E" />
      {/* Rosy Cheeks */}
      <ellipse cx="42" cy="62" rx="4" ry="2.5" fill="#FDA4AF" />
      <ellipse cx="78" cy="62" rx="4" ry="2.5" fill="#FDA4AF" />

      {/* Stethoscope */}
      <path d="M42 66 C40 85 55 94 60 94 C65 94 80 85 78 66" fill="none" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="95" r="5" fill="#FDE047" stroke="#0F172A" strokeWidth="2.5" />

      {/* Thumbs Up Hand Left */}
      <g transform="translate(18, 54)">
        <path d="M14 12 C10 8 4 10 4 16 C4 22 10 24 14 20" fill="#FFE4E6" stroke="#0F172A" strokeWidth="3" />
        <path d="M12 8 C12 3 8 0 5 2 C2 4 4 10 8 11" fill="#FFE4E6" stroke="#0F172A" strokeWidth="3" />
      </g>

      {/* Waving Hand Right */}
      <g transform="translate(85, 48)">
        <path d="M2 14 C6 8 14 6 18 12 C20 18 12 24 6 22" fill="#FFE4E6" stroke="#0F172A" strokeWidth="3" />
        <path d="M15 8 C18 4 22 6 20 10 C18 14 14 14 12 11" fill="#FFE4E6" stroke="#0F172A" strokeWidth="2.5" />
      </g>

      {/* Little Feet */}
      <ellipse cx="48" cy="98" rx="8" ry="5" fill="#FDE047" stroke="#0F172A" strokeWidth="3" />
      <ellipse cx="72" cy="98" rx="8" ry="5" fill="#FDE047" stroke="#0F172A" strokeWidth="3" />
    </svg>
  );
}

// Chemist Chirag Uncle Mascot (Friendly Pharmacist)
export function ChemistChiragMascot({ size = 100, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="36" ry="6" fill="#CBD5E1" />

      {/* Head */}
      <circle cx="60" cy="46" r="26" fill="#FED7AA" stroke="#0F172A" strokeWidth="3.5" />

      {/* Pharmacist White Cap */}
      <path d="M38 34 C38 18 82 18 82 34 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
      {/* Red Cross on Cap */}
      <path d="M57 24 H63 M60 21 V27" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />

      {/* Mustache & Smile */}
      <path d="M48 56 Q55 62 60 56 Q65 62 72 56" fill="#78350F" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 62 Q60 67 66 62" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

      {/* Friendly Eyes & Spectacles */}
      <circle cx="48" cy="42" r="7" fill="white" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="72" cy="42" r="7" fill="white" stroke="#0F172A" strokeWidth="2.5" />
      <line x1="55" y1="42" x2="65" y2="42" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="49" cy="42" r="3" fill="#0F172A" />
      <circle cx="73" cy="42" r="3" fill="#0F172A" />

      {/* Pharmacist Body & Green Apron */}
      <path d="M34 72 C34 72 40 70 60 70 C80 70 86 72 86 72 L92 108 H28 Z" fill="#10B981" stroke="#0F172A" strokeWidth="3.5" />
      {/* Apron Pocket */}
      <rect x="48" y="82" width="24" height="18" rx="4" fill="#059669" stroke="#0F172A" strokeWidth="2.5" />
      {/* Pen in pocket */}
      <line x1="54" y1="78" x2="54" y2="84" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="76" x2="60" y2="84" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

      {/* Holding Medicine / Clipboard */}
      <g transform="translate(80, 70)">
        <rect x="0" y="0" width="18" height="24" rx="2" fill="#FEF3C7" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="4" y="-3" width="10" height="4" rx="1" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
        <line x1="4" y1="7" x2="14" y2="7" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="12" x2="14" y2="12" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="17" x2="11" y2="17" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Speedy Ambulance Mascot (24/7 Fast Discovery)
export function SpeedyAmbulance({ size = 120, className = "" }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Motion Lines */}
      <line x1="5" y1="45" x2="25" y2="45" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="55" x2="28" y2="55" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="65" x2="22" y2="65" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

      {/* Red Siren on Top */}
      <ellipse cx="75" cy="22" rx="7" ry="5" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" />
      <path d="M72 17 L78 17" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />

      {/* Van Body */}
      <path d="M30 45 C30 35 40 30 52 30 H115 C125 30 135 38 142 50 L152 68 C155 74 152 82 145 82 H35 C30 82 28 78 28 72 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />

      {/* Turquoise Stripe */}
      <rect x="29" y="58" width="122" height="10" fill="#38BDF8" />

      {/* Front Windshield Window */}
      <path d="M118 36 H130 C136 36 142 44 146 54 H118 Z" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.5" />

      {/* Side Window */}
      <rect x="68" y="36" width="38" height="18" rx="4" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.5" />

      {/* Red Cross Symbol with Heart */}
      <g transform="translate(45, 42)">
        <circle cx="10" cy="10" r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
        <path d="M6 10 H14 M10 6 V14" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Friendly Eyes on Headlight */}
      <circle cx="148" cy="72" r="5" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />

      {/* Wheels */}
      <g transform="translate(48, 76)">
        <circle cx="10" cy="10" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
        <circle cx="10" cy="10" r="5" fill="#E2E8F0" />
      </g>
      <g transform="translate(120, 76)">
        <circle cx="10" cy="10" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
        <circle cx="10" cy="10" r="5" fill="#E2E8F0" />
      </g>
    </svg>
  );
}

// Cute Medicine Bottle & Tonic
export function CuteMedicineBottle({ size = 80, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Measuring Cup Cap */}
      <rect x="38" y="10" width="24" height="12" rx="3" fill="#F43F5E" stroke="#0F172A" strokeWidth="3" />
      <rect x="42" y="22" width="16" height="6" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />

      {/* Bottle Body */}
      <rect x="25" y="28" width="50" height="60" rx="14" fill="#FEF08A" stroke="#0F172A" strokeWidth="3.5" />

      {/* Liquid Wave */}
      <path d="M26 62 Q38 58 50 62 T74 62 V74 C74 82 66 87 58 87 H42 C34 87 26 82 26 74 Z" fill="#FBBF24" />

      {/* Cute Face */}
      <circle cx="42" cy="46" r="3.5" fill="#0F172A" />
      <circle cx="58" cy="46" r="3.5" fill="#0F172A" />
      <path d="M46 54 Q50 58 54 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="36" cy="52" rx="2.5" ry="1.5" fill="#FB7185" />
      <ellipse cx="64" cy="52" rx="2.5" ry="1.5" fill="#FB7185" />

      {/* Plus Label */}
      <rect x="42" y="66" width="16" height="16" rx="4" fill="white" stroke="#0F172A" strokeWidth="2" />
      <path d="M47 74 H53 M50 71 V77" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Cute QR & Scanner Mascot (Digital Estimate Slip)
export function CuteScannerMascot({ size = 90, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Scanner Gun / Body */}
      <rect x="20" y="15" width="60" height="50" rx="12" fill="#818CF8" stroke="#0F172A" strokeWidth="3.5" />
      
      {/* Screen Frame */}
      <rect x="28" y="23" width="44" height="34" rx="6" fill="#EEF2FF" stroke="#0F172A" strokeWidth="2.5" />

      {/* Mini QR Pattern inside */}
      <rect x="33" y="28" width="8" height="8" fill="#4F46E5" />
      <rect x="59" y="28" width="8" height="8" fill="#4F46E5" />
      <rect x="33" y="44" width="8" height="8" fill="#4F46E5" />
      <rect x="47" y="36" width="6" height="6" fill="#0F172A" />

      {/* Laser Scan Beam */}
      <line x1="26" y1="40" x2="74" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 2" />

      {/* Cheerful Robot Eyes */}
      <circle cx="42" cy="18" r="2.5" fill="#FDE047" />
      <circle cx="58" cy="18" r="2.5" fill="#FDE047" />

      {/* Scanner Handle */}
      <path d="M44 65 L40 88 C40 92 46 95 54 95 C62 95 64 92 64 88 L60 65 Z" fill="#6366F1" stroke="#0F172A" strokeWidth="3" />
    </svg>
  );
}

// Cartoon Cityscape with Pharmacies & Clouds
export function CartoonCityscape({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden relative ${className}`}>
      <svg viewBox="0 0 800 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Clouds */}
        <g fill="#E0F2FE">
          <ellipse cx="120" cy="40" rx="35" ry="16" />
          <ellipse cx="145" cy="32" rx="25" ry="18" />
          <ellipse cx="480" cy="30" rx="40" ry="18" />
          <ellipse cx="510" cy="22" rx="28" ry="20" />
          <ellipse cx="700" cy="45" rx="30" ry="14" />
        </g>

        {/* Building Silhouettes */}
        <rect x="40" y="80" width="70" height="80" rx="6" fill="#FED7AA" stroke="#0F172A" strokeWidth="3" />
        <rect x="55" y="95" width="14" height="16" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <rect x="80" y="95" width="14" height="16" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <rect x="55" y="125" width="14" height="16" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <rect x="80" y="125" width="14" height="16" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

        {/* Medical Pharmacy Store A (Sanjivani 24/7) */}
        <rect x="130" y="55" width="110" height="105" rx="8" fill="#BAE6FD" stroke="#0F172A" strokeWidth="3.5" />
        {/* Green Pharmacy Cross */}
        <g transform="translate(170, 70)">
          <rect x="8" y="0" width="10" height="26" rx="2" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
          <rect x="0" y="8" width="26" height="10" rx="2" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
        </g>
        <rect x="150" y="110" width="30" height="50" rx="4" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="190" y="115" width="35" height="35" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {/* Tall Clinic Building */}
        <rect x="260" y="40" width="85" height="120" rx="8" fill="#DDD6FE" stroke="#0F172A" strokeWidth="3.5" />
        <circle cx="302" cy="62" r="12" fill="#F43F5E" stroke="#0F172A" strokeWidth="2.5" />
        <path d="M298 62 H306 M302 58 V66" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <rect x="278" y="85" width="15" height="18" fill="white" stroke="#0F172A" strokeWidth="2" />
        <rect x="312" y="85" width="15" height="18" fill="white" stroke="#0F172A" strokeWidth="2" />
        <rect x="278" y="115" width="15" height="18" fill="white" stroke="#0F172A" strokeWidth="2" />
        <rect x="312" y="115" width="15" height="18" fill="white" stroke="#0F172A" strokeWidth="2" />

        {/* Pharmacy Store B (Apollo Hub) */}
        <rect x="365" y="65" width="120" height="95" rx="8" fill="#FEF08A" stroke="#0F172A" strokeWidth="3.5" />
        {/* Signboard */}
        <rect x="380" y="75" width="90" height="20" rx="4" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="400" cy="85" r="4" fill="white" />
        <rect x="410" y="83" width="45" height="4" rx="2" fill="white" />
        <rect x="400" y="110" width="40" height="50" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

        {/* Hospital Building */}
        <rect x="505" y="30" width="140" height="130" rx="10" fill="#FBCFE8" stroke="#0F172A" strokeWidth="3.5" />
        <rect x="555" y="42" width="40" height="20" rx="4" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
        <path d="M570 52 H580 M575 47 V57" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <rect x="525" y="75" width="22" height="22" fill="white" stroke="#0F172A" strokeWidth="2" />
        <rect x="565" y="75" width="22" height="22" fill="white" stroke="#0F172A" strokeWidth="2" />
        <rect x="605" y="75" width="22" height="22" fill="white" stroke="#0F172A" strokeWidth="2" />

        {/* Chemist Store C */}
        <rect x="665" y="70" width="100" height="90" rx="8" fill="#A7F3D0" stroke="#0F172A" strokeWidth="3.5" />
        <rect x="685" y="80" width="60" height="18" rx="4" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
        <rect x="695" y="112" width="35" height="48" rx="4" fill="white" stroke="#0F172A" strokeWidth="2.5" />

        {/* Street Road Ground */}
        <line x1="0" y1="158" x2="800" y2="158" stroke="#0F172A" strokeWidth="5" />
      </svg>
    </div>
  );
}
