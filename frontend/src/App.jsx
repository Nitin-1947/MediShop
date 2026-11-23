import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CustomerPortal from './components/CustomerPortal';
import ChemistDashboard from './components/ChemistDashboard';
import ArchitectureDiagrams from './components/ArchitectureDiagrams';
import PrescriptionOCRModal from './components/PrescriptionOCRModal';
import EstimateSlipModal from './components/EstimateSlipModal';
import VerifiedReviewsModal from './components/VerifiedReviewsModal';
import { DrPillMascot, ChemistChiragMascot, SpeedyAmbulance } from './components/CartoonMascots';
import { ShoppingBag, X, Trash2, ArrowRight, QrCode, ShieldCheck, Heart } from 'lucide-react';
import { playPop, playSuccessChime } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'chemist' | 'architecture'
  
  // Initial cart with sample medicine so pre-visit estimator works immediately
  const [cartItems, setCartItems] = useState([
    {
      id: "med-1",
      brand_name: "Augmentin 625 Duo",
      generic_salt: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
      manufacturer: "GlaxoSmithKline (GSK)",
      mrp: 204.50,
      schedule_category: "Schedule H",
      pack_size: "10 Tablets per strip",
      qty: 1
    },
    {
      id: "med-3",
      brand_name: "Dolo 650",
      generic_salt: "Paracetamol (650mg)",
      manufacturer: "Micro Labs Ltd",
      mrp: 34.50,
      schedule_category: "OTC",
      pack_size: "15 Tablets per strip",
      qty: 2
    }
  ]);

  // Modals state
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState(null);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedPharmacyForReview, setSelectedPharmacyForReview] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [chemistScannerToken, setChemistScannerToken] = useState(null);

  // Handle OCR extracted items addition
  const handleAddPrescriptionItems = (extractedItems, metadata) => {
    setCartItems(prev => {
      let updated = [...prev];
      extractedItems.forEach(item => {
        const existing = updated.find(u => u.id === item.id);
        if (existing) {
          existing.qty += (item.qty || 1);
        } else {
          updated.push({ ...item, qty: item.qty || 1 });
        }
      });
      return updated;
    });
  };

  // Handle Estimate generation
  const handleGenerateEstimate = (estimate) => {
    setActiveEstimate(estimate);
    setIsEstimateModalOpen(true);
  };

  // Switch to Chemist view and prefill scanner
  const handleOpenChemistScanner = (token) => {
    setIsEstimateModalOpen(false);
    setChemistScannerToken(token);
    setCurrentView('chemist');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-bubble-300">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'customer' && (
          <CustomerPortal
            onOpenOcrModal={() => setIsOcrModalOpen(true)}
            onGenerateEstimate={handleGenerateEstimate}
            cartItems={cartItems}
            setCartItems={setCartItems}
            onOpenReviews={(pharmacy) => setSelectedPharmacyForReview(pharmacy)}
          />
        )}

        {currentView === 'chemist' && (
          <ChemistDashboard
            initialEstimateToken={chemistScannerToken}
            onClearToken={() => setChemistScannerToken(null)}
          />
        )}

        {currentView === 'architecture' && (
          <ArchitectureDiagrams />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-3 border-slate-900 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <DrPillMascot size={46} />
            <div>
              <div className="font-black text-slate-900 text-lg">
                Medishop Connect
              </div>
              <div className="text-xs text-slate-500 font-bold">
                Compliant with Drugs & Cosmetics Act, 1940 and DPDP Act, 2023.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <button
              onClick={() => { playPop(); setCurrentView('architecture'); }}
              className="hover:text-bubble-600 underline"
            >
              System Architecture & Diagrams
            </button>
            <span>•</span>
            <button
              onClick={() => { playPop(); setCurrentView('chemist'); }}
              className="hover:text-mint-600 underline"
            >
              Chemist Station (Marg / Vyapar Sync)
            </button>
            <span>•</span>
            <button
              onClick={() => { playPop(); setIsOcrModalOpen(true); }}
              className="hover:text-medipink-500 underline"
            >
              Prescription OCR Vision
            </button>
          </div>

          <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-medipink-500 fill-medipink-500" /> for Indian Neighborhood Pharmacies
          </div>
        </div>
      </footer>

      {/* MODAL 1: Prescription OCR Scanner */}
      <PrescriptionOCRModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onAddPrescriptionItems={handleAddPrescriptionItems}
      />

      {/* MODAL 2: 60-Minute Estimate Slip & QR Reservation */}
      <EstimateSlipModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        estimate={activeEstimate}
        onOpenChemistScanner={handleOpenChemistScanner}
      />

      {/* MODAL 3: Verified Pickup Customer Reviews */}
      <VerifiedReviewsModal
        isOpen={Boolean(selectedPharmacyForReview)}
        onClose={() => setSelectedPharmacyForReview(null)}
        pharmacy={selectedPharmacyForReview}
      />

      {/* SLIDE-OVER DRAWER: Quick Cart View */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white border-l-4 border-slate-900 h-full p-6 space-y-5 overflow-y-auto shadow-cartoon-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-bubble-500" />
                  <h3 className="text-xl font-black text-slate-900">
                    Pre-Visit Basket ({cartItems.length})
                  </h3>
                </div>
                <button
                  onClick={() => { playPop(); setIsCartDrawerOpen(false); }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center font-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <DrPillMascot size={60} className="mx-auto opacity-40" />
                  <div className="font-bold text-sm">Basket is empty</div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cartItems.map(item => (
                    <div key={item.id} className="cartoon-card p-3 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-black text-slate-900">{item.brand_name}</div>
                        <div className="text-[11px] text-slate-500 font-bold">MRP ₹{item.mrp} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900">₹{(item.mrp * item.qty).toFixed(2)}</span>
                        <button
                          onClick={() => {
                            playPop();
                            setCartItems(prev => prev.filter(i => i.id !== item.id));
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-3 pt-4 border-t-2 border-slate-100">
                <div className="flex justify-between font-black text-sm">
                  <span>Cart Items Retail Total:</span>
                  <span>₹{cartItems.reduce((sum, i) => sum + i.mrp * i.qty, 0).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    playPop();
                    setIsCartDrawerOpen(false);
                    setCurrentView('customer');
                  }}
                  className="w-full cartoon-btn cartoon-btn-primary py-3 text-sm shadow-cartoon-hover"
                >
                  <span>Compare Nearby Stores & Lock Price</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
