import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Smartphone, 
  Eye, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity, 
  Zap,
  ArrowRight,
  Clock,
  QrCode,
  DollarSign,
  Building2,
  Check
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function ArchitectureDiagrams() {
  const [activeTab, setActiveTab] = useState('system_arch');
  const [selectedNode, setSelectedNode] = useState('gateway');

  const nodesInfo = {
    client: {
      title: "1. Customer & Chemist Client",
      icon: Smartphone,
      badge: "React 18 + Tailwind",
      summary: "Separate dual-portal entry for Customers (phone signup, hyperlocal discovery, 60-min QR slip) and Medical Shop Owners (Drug License authentication, Wholesaler Bill OCR scanner).",
      specs: [
        "Dedicated Customer Mobile Phone & OTP onboarding",
        "Licensed Pharmacy Registration with Drug License verification (Form 20B/21B)",
        "Direct Distributor Invoice OCR scanner for instant stock ingestion",
        "Countertop QR code redemption and verified pickup ratings"
      ]
    },
    gateway: {
      title: "2. API Gateway & Express Server",
      icon: Server,
      badge: "Node.js / Express Core",
      summary: "High-performance REST API routing customer searches, coordinating OCR vision jobs, executing multi-item cart optimizations, and managing audit logs.",
      specs: [
        "Sub-15ms response latency with in-memory spatial index",
        "Multer multipart parser for prescription photos & distributor bill PDFs",
        "Role-based access control (Customer vs Verified Chemist)",
        "Rate limiting and payload sanitation"
      ]
    },
    ocr: {
      title: "3. Prescription & Invoice Vision Engines",
      icon: Eye,
      badge: "Dual OCR Engine",
      summary: "Dual optical character recognition modules: (A) Patient Prescription Scanner detecting Schedule H drugs, and (B) Chemist Purchase Bill Scanner extracting batch, expiry, and wholesale rates.",
      specs: [
        "Distributor invoice parser auto-mapping brand names to master inventory",
        "Prescription handwriting recognition with dosage & duration extraction",
        "Schedule H & H1 safety trigger enforcing doctor registration records",
        "DPDP 2023 compliant encrypted storage with 7-day auto-purge"
      ]
    },
    geospatial: {
      title: "4. Hyperlocal Geospatial Engine",
      icon: MapPin,
      badge: "Haversine / PostGIS ST_DWithin",
      summary: "Calculates spherical distance between customer coordinates and nearby verified retail pharmacies across 1km, 3km, and 5km radius zones.",
      specs: [
        "Sub-millisecond distance calculation per pharmacy candidate",
        "GIST index spatial query in PostgreSQL: ST_DWithin(location, point, radius)",
        "24/7 night duty duty pharmacy filtering and emergency proximity weighting",
        "Live route estimation for multi-store split cart visits"
      ]
    },
    database: {
      title: "5. Master Database & Inventory Engine",
      icon: Database,
      badge: "PostgreSQL + RLS / Fast Store",
      summary: "Stores Master Indian Medicines, Pharmacy license metadata, live stock levels, dynamic near-expiry clearance discounts, and DPDP compliance logs.",
      specs: [
        "Master catalog with generic salt bioequivalence mapping",
        "Atomic stock reservations upon 60-min QR code generation",
        "Dynamic expiry indexing for liquidation discounts (<60 days)",
        "Verified review verification tied strictly to redeemed QR tokens"
      ]
    },
    pos: {
      title: "6. Chemist Countertop & Wholesaler Bill Engine",
      icon: QrCode,
      badge: "Direct Wholesaler Sync",
      summary: "Countertop scanner mode to scan customer estimate QR codes, instantly lock prices against inflation, and ingest daily billing CSVs & invoices.",
      specs: [
        "Instant invoice scan converting distributor paper bills to live digital stock",
        "One-click dynamic discount slider for nearing-expiry stock",
        "Drug Schedule H/H1 compliance register logger",
        "Countertop QR reader with instant stock deduction and receipt stamping"
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            System Blueprint & Technical Specification
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Architecture, Compliance & Geospatial Engine 🔬
          </h2>
          <p className="text-slate-300 max-w-2xl text-xs sm:text-sm font-medium">
            Explore the end-to-end architecture: from customer phone onboarding to distributor bill OCR parsing, PostGIS spatial queries, and Chemist POS counter verification.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP 2023 & Drugs Act 1940</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => { playPop(); setActiveTab('system_arch'); }}
          className={`clinical-btn ${
            activeTab === 'system_arch' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>1. System Architecture Diagram</span>
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('schedule_matrix'); }}
          className={`clinical-btn ${
            activeTab === 'schedule_matrix' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2. Drug Schedule & DPDP Compliance</span>
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('cart_algorithm'); }}
          className={`clinical-btn ${
            activeTab === 'cart_algorithm' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>3. Multi-Item Cart & Split Algorithm</span>
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('roadmap'); }}
          className={`clinical-btn ${
            activeTab === 'roadmap' 
              ? 'bg-teal-600 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>4. Feasibility & Roadmap</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE INTERACTIVE DIAGRAM */}
      {activeTab === 'system_arch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 clinical-card p-6 bg-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Interactive Component Flow (Click any layer)</span>
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200">
                Interactive Architecture
              </span>
            </div>

            {/* Architecture Flow Canvas */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              {/* Client Layer */}
              <button
                onClick={() => { playPop(); setSelectedNode('client'); }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedNode === 'client'
                    ? 'bg-white border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-teal-700">Presentation Layer</div>
                    <div className="text-sm font-bold text-slate-900">Separate Customer & Chemist Portals</div>
                    <div className="text-xs text-slate-500">React 18 + Vite + Tailwind CSS (Clinical Teal)</div>
                  </div>
                </div>
              </button>

              <div className="text-center text-slate-400 font-bold text-xs">↓ HTTPS / JSON API</div>

              {/* Gateway Layer */}
              <button
                onClick={() => { playPop(); setSelectedNode('gateway'); }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedNode === 'gateway'
                    ? 'bg-white border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500">API Gateway & Orchestration</div>
                    <div className="text-sm font-bold text-slate-900">Node.js Express Server Engine</div>
                    <div className="text-xs text-slate-500">REST API • Role Auth • Cart Optimization • Latency &lt; 15ms</div>
                  </div>
                </div>
              </button>

              {/* Dual Engines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { playPop(); setSelectedNode('ocr'); }}
                  className={`p-3.5 rounded-xl text-left transition-all ${
                    selectedNode === 'ocr'
                      ? 'bg-white border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white border border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-teal-700">Dual OCR Engine</div>
                      <div className="text-xs font-bold text-slate-900">Rx & Distributor Bill OCR</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { playPop(); setSelectedNode('geospatial'); }}
                  className={`p-3.5 rounded-xl text-left transition-all ${
                    selectedNode === 'geospatial'
                      ? 'bg-white border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white border border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Spatial Engine</div>
                      <div className="text-xs font-bold text-slate-900">PostGIS / Haversine (1-5km)</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center text-slate-400 font-bold text-xs">↓ Ingestion & Queries</div>

              {/* Database Layer */}
              <button
                onClick={() => { playPop(); setSelectedNode('database'); }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedNode === 'database'
                    ? 'bg-white border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-teal-700">Storage & Relational Index</div>
                    <div className="text-sm font-bold text-slate-900">PostgreSQL + PostGIS Database</div>
                    <div className="text-xs text-slate-500">Medicines Master • Store Inventory • DPDP Audit Logs</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Node Spec Inspector Panel */}
          <div className="lg:col-span-4 clinical-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Layer Specification
              </span>
              <span className="clinical-badge bg-teal-50 text-teal-800 border border-teal-200">
                {nodesInfo[selectedNode].badge}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {React.createElement(nodesInfo[selectedNode].icon, { className: "w-4 h-4 text-teal-600" })}
                <span>{nodesInfo[selectedNode].title}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {nodesInfo[selectedNode].summary}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Technical Highlights:
              </div>
              <div className="space-y-2">
                {nodesInfo[selectedNode].specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRUG SCHEDULE & DPDP COMPLIANCE MATRIX */}
      {activeTab === 'schedule_matrix' && (
        <div className="clinical-card p-6 bg-white space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Drug Schedule & DPDP Act 2023 Compliance Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Strictly adheres to the <strong>Drugs and Cosmetics Act, 1940</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
              <div className="text-xs font-bold text-teal-800 uppercase">Category A</div>
              <div className="font-bold text-slate-900 text-sm">General OTC Medicines</div>
              <div className="text-xs text-slate-600 font-medium">Paracetamol, Multivitamins, Antacids, Wound Gels</div>
              <div className="pt-2 text-xs text-teal-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Direct 60-Min Counter Reserve
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase">Category B</div>
              <div className="font-bold text-slate-900 text-sm">Schedule H (Prescription)</div>
              <div className="text-xs text-slate-600 font-medium">Augmentin, Azithromycin, Telma, Pan-D</div>
              <div className="pt-2 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Mandatory Doctor Rx Verification
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <div className="text-xs font-bold text-rose-800 uppercase">Category C</div>
              <div className="font-bold text-slate-900 text-sm">Schedule H1 & X (Controlled)</div>
              <div className="text-xs text-slate-600 font-medium">Alprazolam, Zolpidem, Controlled Sedatives</div>
              <div className="pt-2 text-xs text-rose-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Physical Rx + In-Store Register Entry
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-ITEM CART & SPLIT ALGORITHM */}
      {activeTab === 'cart_algorithm' && (
        <div className="clinical-card p-6 bg-white space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <span>Multi-Item Cart Optimization & Split Matching Logic</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              How Medishop eliminates medicine hopping friction and saves customers up to 30% by evaluating single-store 100% fulfill vs multi-store split baskets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
              <div className="text-xs font-bold text-teal-800 uppercase">Option 1</div>
              <div className="text-base font-bold text-slate-900">Single-Shop 100% Complete Match</div>
              <p className="text-xs text-slate-600 font-medium">
                100% of basket items fulfilled under one roof at the nearest verified pharmacy.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Store:</span>
                  <span>Sanjivani 24/7 Medico (0.21 km)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Fulfillment:</span>
                  <span className="text-teal-700">100% In Stock</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Net Bill:</span>
                  <span className="text-teal-700">₹234.50 (Save ₹38.90)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="text-xs font-bold text-amber-800 uppercase">Option 2</div>
              <div className="text-base font-bold text-slate-900">Split-Cart Savings Match</div>
              <p className="text-xs text-slate-600 font-medium">
                Splits basket between 2 neighboring shops when clearance discounts produce significant savings (&gt; ₹25 to ₹150).
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Shop 1 (Apollo Hub):</span>
                  <span>Augmentin 625 (18% Flat Disc)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Shop 2 (Shree Ganesh):</span>
                  <span>Dolo 650 + Pan-D (Clearance 30%)</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Combined Net Bill:</span>
                  <span className="text-emerald-700">₹198.00 (Save ₹75.50)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEASIBILITY & ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="clinical-card p-6 bg-white space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Feasibility Matrix & Implementation Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              12-week operational roadmap with zero-disruption chemist onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-teal-700">Weeks 1–3</div>
              <div className="font-bold text-slate-900 text-xs">Master DB & PostGIS</div>
              <div className="text-[11px] text-slate-500">PostgreSQL spatial index, master 10k Indian brands catalog.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-teal-700">Weeks 4–6</div>
              <div className="font-bold text-slate-900 text-xs">Search & Bill OCR</div>
              <div className="text-[11px] text-slate-500">Distributor purchase bill OCR & multi-item split cart calculator.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-teal-700">Weeks 7–9</div>
              <div className="font-bold text-slate-900 text-xs">Prescription OCR</div>
              <div className="text-[11px] text-slate-500">Doctor Rx handwriting reader & DPDP encrypted storage.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-teal-700">Weeks 10–12</div>
              <div className="font-bold text-slate-900 text-xs">Pilot Launch</div>
              <div className="text-[11px] text-slate-500">Beta rollout across 25 local pharmacies in Indiranagar/Koramangala.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
