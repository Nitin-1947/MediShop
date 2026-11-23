import React, { useState } from 'react';
import { 
  DrPillMascot, 
  ChemistChiragMascot, 
  SpeedyAmbulance, 
  CuteScannerMascot, 
  CuteMedicineBottle 
} from './CartoonMascots';
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
  DollarSign
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function ArchitectureDiagrams() {
  const [activeTab, setActiveTab] = useState('system_arch');
  const [selectedNode, setSelectedNode] = useState('gateway');

  const nodesInfo = {
    client: {
      title: "1. Customer & Chemist Client",
      icon: Smartphone,
      color: "bg-bubble-100 border-bubble-500",
      badge: "React 18 + Tailwind",
      summary: "Hyperlocal medicine discovery, prescription OCR photo upload, multi-item cart bill comparison, and 60-minute time-bound estimate QR code generation.",
      specs: [
        "Interactive Geolocation via Browser HTML5 / PostGIS input",
        "Prescription image capture with client-side preview",
        "Instant counter QR scanner display with live countdown",
        "Verified pickup rating submission"
      ]
    },
    gateway: {
      title: "2. API Gateway & Express Server",
      icon: Server,
      color: "bg-sunny-100 border-sunny-500",
      badge: "Node.js / Express Core",
      summary: "High-performance REST API routing requests, validating drug schedules, dispatching to OCR parser, and coordinating real-time cart cost optimization.",
      specs: [
        "Sub-15ms response latency for indexed queries",
        "CORS & Multer multipart streaming for prescription images & CSVs",
        "JWT / Session authentication with role separation (Customer vs Chemist)",
        "Rate limiting and payload sanitation"
      ]
    },
    ocr: {
      title: "3. Prescription Vision & OCR Engine",
      icon: Eye,
      color: "bg-lavender-100 border-lavender-500",
      badge: "Tesseract / Vision Parser",
      summary: "Intelligent optical character recognition extracting doctor details, medicine names, dosages, and cross-referencing with master drug schedules.",
      specs: [
        "Fuzzy string matching across 10,000+ Indian medicine brand names",
        "Dosage parsing (1-0-1, OD, BD, SOS, 5 days -> Strip quantity)",
        "Schedule H & H1 safety trigger with mandatory Rx audit tagging",
        "DPDP 2023 compliant encrypted storage with 7-day auto-purge"
      ]
    },
    geospatial: {
      title: "4. Hyperlocal Geospatial Engine",
      icon: MapPin,
      color: "bg-mint-100 border-mint-500",
      badge: "Haversine / PostGIS ST_DWithin",
      summary: "Calculates spatial spherical distance between user coordinates and verified pharmacies across 1km, 3km, and 5km radius zones.",
      specs: [
        "Sub-millisecond distance calculation per store candidate",
        "GIST index spatial search in PostgreSQL: ST_DWithin(location, point, radius)",
        "24/7 duty pharmacy filtering and emergency proximity weighting",
        "Live route estimation for multi-store split cart visits"
      ]
    },
    database: {
      title: "5. Master Database & Inventory Engine",
      icon: Database,
      color: "bg-medipink-100 border-medipink-500",
      badge: "PostgreSQL + RLS / Fast Store",
      summary: "Stores Master Indian Medicines, Pharmacy metadata, live stock quantities, dynamic near-expiry clearance discounts, and DPDP compliance logs.",
      specs: [
        "Master catalog with generic salt bioequivalence mapping",
        "Atomic stock reservations upon 60-min QR code generation",
        "Dynamic expiry indexing for liquidation discounts (<60 days)",
        "Verified review verification tied strictly to redeemed QR tokens"
      ]
    },
    pos: {
      title: "6. Chemist POS & Countertop Portal",
      icon: QrCode,
      color: "bg-emerald-100 border-emerald-500",
      badge: "Marg ERP / Vyapar Sync",
      summary: "Countertop scanner mode to scan customer estimate QR codes, instantly lock prices against inflation, and ingest daily billing CSVs.",
      specs: [
        "Zero-friction CSV upload from Marg ERP, Vyapar, and Tally",
        "One-click dynamic discount slider for nearing-expiry stock",
        "Drug Schedule H/H1 compliance register logger",
        "Instant stock deduction and verified dispensing confirmation"
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Cartoon Header Banner */}
      <div className="cartoon-card p-6 bg-gradient-to-r from-bubble-100 via-mint-100 to-sunny-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-slate-900 rounded-full text-xs font-black shadow-cartoon-sm">
            <Sparkles className="w-4 h-4 text-sunny-500 fill-sunny-400" />
            Interactive System Blueprint & Technical Architecture
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How Medishop Connect Works Under the Hood! 🔬
          </h2>
          <p className="text-slate-700 max-w-2xl font-semibold">
            Explore the end-to-end architecture: from customer prescription OCR capture to PostGIS geospatial calculations, multi-item split bill optimization, and Chemist POS compliance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DrPillMascot size={90} className="animate-bounce-subtle" />
          <ChemistChiragMascot size={90} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { playPop(); setActiveTab('system_arch'); }}
          className={`cartoon-btn ${activeTab === 'system_arch' ? 'bg-bubble-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <Cpu className="w-4 h-4" />
          1. System Architecture Diagram
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('schedule_matrix'); }}
          className={`cartoon-btn ${activeTab === 'schedule_matrix' ? 'bg-mint-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          2. Drug Schedule & DPDP Compliance
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('cart_algorithm'); }}
          className={`cartoon-btn ${activeTab === 'cart_algorithm' ? 'bg-sunny-400 text-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <DollarSign className="w-4 h-4" />
          3. Multi-Item Cart & Split Algorithm
        </button>
        <button
          onClick={() => { playPop(); setActiveTab('roadmap'); }}
          className={`cartoon-btn ${activeTab === 'roadmap' ? 'bg-medipink-400 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          <Activity className="w-4 h-4" />
          4. Feasibility & Roadmap
        </button>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE INTERACTIVE DIAGRAM */}
      {activeTab === 'system_arch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Interactive Flow Diagram */}
          <div className="lg:col-span-8 cartoon-card p-6 bg-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-bubble-500" />
                Interactive Component Diagram (Click a node!)
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-bubble-100 rounded-lg border border-bubble-400 text-bubble-600">
                Live Interactive Nodes
              </span>
            </div>

            {/* Diagram SVG Canvas / Visual Flow */}
            <div className="relative p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-x-auto">
              {/* Row 1: Client Layer */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => { playPop(); setSelectedNode('client'); }}
                  className={`cartoon-card p-4 w-72 text-left cursor-pointer transition-transform ${selectedNode === 'client' ? 'ring-4 ring-bubble-400 scale-105 bg-bubble-50' : 'bg-white hover:bg-bubble-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-bubble-200 border-2 border-slate-900">
                      <Smartphone className="w-6 h-6 text-bubble-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-bubble-600">Frontend Layer</div>
                      <div className="font-black text-slate-900">Customer & Chemist Client</div>
                      <div className="text-xs text-slate-500">React + Vite + Tailwind</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Connecting Down Arrow */}
              <div className="flex justify-center -my-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shadow-cartoon-sm animate-bounce-subtle">
                  ↓
                </div>
              </div>

              {/* Row 2: API Gateway Layer */}
              <div className="flex justify-center my-6">
                <button
                  onClick={() => { playPop(); setSelectedNode('gateway'); }}
                  className={`cartoon-card p-4 w-80 text-left cursor-pointer transition-transform ${selectedNode === 'gateway' ? 'ring-4 ring-sunny-400 scale-105 bg-sunny-50' : 'bg-white hover:bg-sunny-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sunny-200 border-2 border-slate-900">
                      <Server className="w-6 h-6 text-sunny-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-sunny-600">Orchestrator</div>
                      <div className="font-black text-slate-900">API Gateway & Express Server</div>
                      <div className="text-xs text-slate-500">Node.js / Express REST API</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Row 3: Dual Worker Engines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* OCR Engine */}
                <button
                  onClick={() => { playPop(); setSelectedNode('ocr'); }}
                  className={`cartoon-card p-4 text-left cursor-pointer transition-transform ${selectedNode === 'ocr' ? 'ring-4 ring-lavender-400 scale-105 bg-lavender-50' : 'bg-white hover:bg-lavender-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-lavender-200 border-2 border-slate-900">
                      <Eye className="w-6 h-6 text-lavender-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-lavender-600">Vision Worker</div>
                      <div className="font-black text-slate-900">OCR & Prescription Engine</div>
                      <div className="text-xs text-slate-500">Tesseract & Regex Parser</div>
                    </div>
                  </div>
                </button>

                {/* Geospatial Engine */}
                <button
                  onClick={() => { playPop(); setSelectedNode('geospatial'); }}
                  className={`cartoon-card p-4 text-left cursor-pointer transition-transform ${selectedNode === 'geospatial' ? 'ring-4 ring-mint-400 scale-105 bg-mint-50' : 'bg-white hover:bg-mint-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-mint-200 border-2 border-slate-900">
                      <MapPin className="w-6 h-6 text-mint-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-mint-600">Spatial Worker</div>
                      <div className="font-black text-slate-900">Geospatial Engine</div>
                      <div className="text-xs text-slate-500">PostGIS / Haversine (1-5km)</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Row 4: Database Layer */}
              <div className="flex justify-center my-6">
                <button
                  onClick={() => { playPop(); setSelectedNode('database'); }}
                  className={`cartoon-card p-4 w-80 text-left cursor-pointer transition-transform ${selectedNode === 'database' ? 'ring-4 ring-medipink-400 scale-105 bg-medipink-50' : 'bg-white hover:bg-medipink-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-medipink-200 border-2 border-slate-900">
                      <Database className="w-6 h-6 text-medipink-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-medipink-600">Data Store</div>
                      <div className="font-black text-slate-900">PostgreSQL + PostGIS DB</div>
                      <div className="text-xs text-slate-500">RLS, Spatial GIST & Inventory</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Row 5: Chemist POS */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => { playPop(); setSelectedNode('pos'); }}
                  className={`cartoon-card p-4 w-72 text-left cursor-pointer transition-transform ${selectedNode === 'pos' ? 'ring-4 ring-emerald-400 scale-105 bg-emerald-50' : 'bg-white hover:bg-emerald-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-200 border-2 border-slate-900">
                      <QrCode className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-emerald-600">Store Integration</div>
                      <div className="font-black text-slate-900">Chemist POS & Portal</div>
                      <div className="text-xs text-slate-500">Marg, Vyapar & Counter QR</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Node Detail Inspector Panel */}
          <div className="lg:col-span-4 cartoon-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Node Specifications
              </span>
              <span className="cartoon-badge bg-bubble-200 text-slate-900">
                {nodesInfo[selectedNode].badge}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {React.createElement(nodesInfo[selectedNode].icon, { className: "w-5 h-5 text-bubble-500" })}
                {nodesInfo[selectedNode].title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                {nodesInfo[selectedNode].summary}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Key Technical Features:
              </div>
              <div className="space-y-2">
                {nodesInfo[selectedNode].specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-mint-500 shrink-0 mt-0.5" />
                    <span className="font-bold">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-sunny-50 rounded-xl border-2 border-slate-900 shadow-cartoon-sm flex items-center gap-3">
              <DrPillMascot size={50} />
              <div className="text-xs">
                <span className="font-black text-slate-900">Dr. Pill's Arch Note:</span>
                <p className="text-slate-600">All data transfers between client and server use HTTPS/WSS with DPDP 2023 compliance!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRUG SCHEDULE & DPDP COMPLIANCE MATRIX */}
      {activeTab === 'schedule_matrix' && (
        <div className="space-y-6">
          <div className="cartoon-card p-6 bg-white space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-mint-500" />
                  Legal & Drug Schedule Compliance Framework
                </h3>
                <p className="text-slate-600 text-sm font-semibold">
                  Strictly follows the <strong className="text-slate-900">Drugs and Cosmetics Act, 1940</strong> and the <strong className="text-slate-900">Digital Personal Data Protection (DPDP) Act, 2023</strong>.
                </p>
              </div>
              <div className="cartoon-badge bg-mint-100 text-mint-700">
                100% Legally Compliant Aggregator
              </div>
            </div>

            {/* Visual Flowchart Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: General OTC */}
              <div className="cartoon-card p-5 bg-mint-50 border-2 border-mint-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="cartoon-badge bg-mint-200 text-mint-800">
                    Category A
                  </span>
                  <CuteMedicineBottle size={40} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">General OTC Medicines</h4>
                  <div className="text-xs text-slate-500 font-bold">Paracetamol, Multivitamins, Antacids, Pain Gels</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-mint-300 text-xs space-y-2">
                  <div className="font-black text-slate-800">Checkout Rule:</div>
                  <div className="text-mint-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Direct Instant Reservation Allowed
                  </div>
                  <p className="text-slate-600">
                    No doctor prescription required. Generates 60-min locked estimate slip instantly.
                  </p>
                </div>
              </div>

              {/* Category 2: Schedule H */}
              <div className="cartoon-card p-5 bg-sunny-50 border-2 border-sunny-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="cartoon-badge bg-sunny-200 text-sunny-800">
                    Category B
                  </span>
                  <FileText className="w-8 h-8 text-sunny-600" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Schedule H (Prescription)</h4>
                  <div className="text-xs text-slate-500 font-bold">Augmentin, Azithromycin, Telma, Pan-D</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-sunny-300 text-xs space-y-2">
                  <div className="font-black text-slate-800">Checkout Rule:</div>
                  <div className="text-sunny-700 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Mandatory Rx Upload Before Slip
                  </div>
                  <p className="text-slate-600">
                    Customer must scan valid doctor Rx. Chemist counter registers Doctor Reg # before dispensing.
                  </p>
                </div>
              </div>

              {/* Category 3: Schedule H1 / X */}
              <div className="cartoon-card p-5 bg-medipink-50 border-2 border-medipink-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="cartoon-badge bg-medipink-200 text-medipink-800">
                    Category C
                  </span>
                  <ShieldCheck className="w-8 h-8 text-medipink-600" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Schedule H1 & X (Controlled)</h4>
                  <div className="text-xs text-slate-500 font-bold">Alprazolam, Zolpidem, High Potency Sedatives</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-medipink-300 text-xs space-y-2">
                  <div className="font-black text-slate-800">Checkout Rule:</div>
                  <div className="text-medipink-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Mandatory Physical Rx + Store Register
                  </div>
                  <p className="text-slate-600">
                    No home delivery or blind reserves. Stored in red-lined Schedule H1 physical register at the pharmacy.
                  </p>
                </div>
              </div>
            </div>

            {/* DPDP Privacy Policy Architecture */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border-2 border-slate-900 shadow-cartoon space-y-3">
              <div className="flex items-center gap-2 text-sunny-400 font-black text-sm">
                <Sparkles className="w-4 h-4" />
                DPDP 2023 Digital Personal Data Protection Standards
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="font-black text-bubble-400 mb-1">1. Encrypted Storage (AES-256)</div>
                  <p className="text-slate-300">All prescription uploads are encrypted at rest with private KMS keys in cloud containers.</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="font-black text-bubble-400 mb-1">2. Short-Lived Signed URLs</div>
                  <p className="text-slate-300">Access to prescription previews is granted through time-bound signed URLs expiring in 15 minutes.</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="font-black text-bubble-400 mb-1">3. 7-Day Auto-Purge Hot Policy</div>
                  <p className="text-slate-300">Customer medical records and images are automatically purged from hot storage 7 days after order completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-ITEM CART & SPLIT ALGORITHM */}
      {activeTab === 'cart_algorithm' && (
        <div className="space-y-6">
          <div className="cartoon-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-sunny-500" />
                Multi-Item Cart Optimization & Split Matching Logic
              </h3>
              <p className="text-slate-600 text-sm font-semibold">
                How Medishop solves the "medicine hopping" friction and saves customers up to 30% by intelligently splitting baskets or picking 100% stocked stores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Single Shop 100% Match */}
              <div className="cartoon-card p-5 bg-bubble-50 border-2 border-bubble-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="cartoon-badge bg-bubble-200 text-bubble-800">
                    Convenience First
                  </span>
                  <SpeedyAmbulance size={60} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">Single-Shop Complete Match</h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    100% of cart items available under one roof at the nearest location.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-bubble-300 space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Store:</span>
                    <span className="text-slate-900">Sanjivani 24/7 Medico</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Distance:</span>
                    <span className="text-slate-900">0.25 km (Walking: 3 mins)</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Fulfillment:</span>
                    <span className="text-mint-600">3 of 3 Items In Stock (100%)</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
                    <span>Total Net Bill:</span>
                    <span className="text-bubble-600 font-black">₹234.50 (Save ₹38.90)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic">
                  💡 Best for urgent requirements and elderly patients who prefer 1 single counter stop.
                </div>
              </div>

              {/* Option 2: Split-Cart Savings Match */}
              <div className="cartoon-card p-5 bg-sunny-50 border-2 border-sunny-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="cartoon-badge bg-sunny-200 text-sunny-800">
                    Maximum Savings Engine
                  </span>
                  <div className="text-2xl font-black text-sunny-600 animate-wiggle">
                    💰 +₹35 Extra!
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">Split-Cart Savings Match</h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    Splits basket between 2 neighboring shops if buying high-discount items yields significant savings.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sunny-300 space-y-2 text-xs">
                  <div className="space-y-1 pb-2 border-b border-slate-200">
                    <div className="font-black text-slate-900">Shop 1: Apollo Hub (0.65 km)</div>
                    <div className="text-slate-600">Augmentin 625 Duo (18% Flat Discount)</div>
                  </div>
                  <div className="space-y-1 pb-2 border-b border-slate-200">
                    <div className="font-black text-slate-900">Shop 2: Shree Ganesh (2.3 km)</div>
                    <div className="text-slate-600">Dolo 650 + Pan-D (Clearance 30% Off)</div>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1">
                    <span>Combined Net Bill:</span>
                    <span className="text-mint-600 font-black">₹198.00 (Save ₹75.50!)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic">
                  💡 Automatically suggested whenever basket savings exceed ₹25 to ₹150 for chronic medicine buyers.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEASIBILITY & ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="cartoon-card p-6 bg-white space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-medipink-500" />
                Feasibility Matrix & 12-Week Implementation Roadmap
              </h3>
              <p className="text-slate-600 text-sm font-semibold">
                Strategic rollout ensuring rapid chemist adoption without requiring disruptive hardware replacements.
              </p>
            </div>

            {/* Feasibility Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-2 border-slate-900 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-white font-black uppercase">
                  <tr>
                    <th className="p-3">Dimension</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Analysis & Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-900 font-semibold">
                  <tr className="bg-mint-50">
                    <td className="p-3 font-black text-slate-900">Technical Feasibility</td>
                    <td className="p-3"><span className="cartoon-badge bg-mint-200 text-mint-800">High</span></td>
                    <td className="p-3 text-slate-700">Standard PostGIS spatial queries, Node.js concurrency, and Tesseract OCR parser. Fully tested and operational.</td>
                  </tr>
                  <tr className="bg-sunny-50">
                    <td className="p-3 font-black text-slate-900">Operational Feasibility</td>
                    <td className="p-3"><span className="cartoon-badge bg-sunny-200 text-sunny-800">Medium-High</span></td>
                    <td className="p-3 text-slate-700">Chemist onboarding addressed via automated Marg ERP / Vyapar CSV sync and instant mobile web QR scanner.</td>
                  </tr>
                  <tr className="bg-bubble-50">
                    <td className="p-3 font-black text-slate-900">Legal & Regulatory</td>
                    <td className="p-3"><span className="cartoon-badge bg-bubble-200 text-bubble-800">Compliant</span></td>
                    <td className="p-3 text-slate-700">Drugs and Cosmetics Act, 1940 adherence with mandatory Schedule H Rx tagging; DPDP 2023 with 7-day image purge.</td>
                  </tr>
                  <tr className="bg-medipink-50">
                    <td className="p-3 font-black text-slate-900">Financial Feasibility</td>
                    <td className="p-3"><span className="cartoon-badge bg-medipink-200 text-medipink-800">High</span></td>
                    <td className="p-3 text-slate-700">Zero inventory holding cost. Monetized via chemist SaaS tools (near-expiry alerts, demand heatmaps) and featured listings.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4-Phase Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="cartoon-card p-4 bg-bubble-50 space-y-2">
                <div className="text-xs font-black text-bubble-600">Phase 1: Weeks 1–3</div>
                <div className="font-black text-slate-900 text-sm">Foundation & Master DB</div>
                <div className="text-xs text-slate-600">PostgreSQL + PostGIS setup, Auth & 10,000+ Indian medicine brands master catalog.</div>
              </div>
              <div className="cartoon-card p-4 bg-sunny-50 space-y-2">
                <div className="text-xs font-black text-sunny-600">Phase 2: Weeks 4–6</div>
                <div className="font-black text-slate-900 text-sm">Search & POS Sync</div>
                <div className="text-xs text-slate-600">Geospatial queries, Marg ERP stock parser, and multi-item split cart cost calculator.</div>
              </div>
              <div className="cartoon-card p-4 bg-lavender-50 space-y-2">
                <div className="text-xs font-black text-lavender-600">Phase 3: Weeks 7–9</div>
                <div className="font-black text-slate-900 text-sm">Smart UX & Compliance</div>
                <div className="text-xs text-slate-600">Prescription OCR vision reader, 60-min QR counter lock, and DPDP encrypted storage.</div>
              </div>
              <div className="cartoon-card p-4 bg-mint-50 space-y-2">
                <div className="text-xs font-black text-mint-600">Phase 4: Weeks 10–12</div>
                <div className="font-black text-slate-900 text-sm">Pilot Launch</div>
                <div className="text-xs text-slate-600">Beta rollout across 25 Indiranagar & Koramangala pharmacies with physical counter QR stickers.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
