import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerPortal from './components/CustomerPortal';
import ChemistDashboard from './components/ChemistDashboard';
import PrescriptionOCRModal from './components/PrescriptionOCRModal';
import EstimateSlipModal from './components/EstimateSlipModal';
import VerifiedReviewsModal from './components/VerifiedReviewsModal';
import AuthModal from './components/AuthModal';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Heart, User, Store } from 'lucide-react';

export default function App() {
  // Authentication & active session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medishop_auth');
      return saved ? JSON.parse(saved) : {
        role: 'customer',
        user: { id: "cust-1", phone: "9845012345", full_name: "Rahul Verma", pincode: "560038" }
      };
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    return currentUser?.role === 'chemist' ? 'chemist' : 'customer';
  });

  // Pre-visit cart
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState(null);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedPharmacyForReview, setSelectedPharmacyForReview] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [chemistScannerToken, setChemistScannerToken] = useState(null);

  // Sync session with local storage
  const handleAuthSuccess = (authData) => {
    setCurrentUser(authData);
    try {
      localStorage.setItem('medishop_auth', JSON.stringify(authData));
    } catch (e) {
      console.error(e);
    }
    // Automatically switch to the respective dashboard
    if (authData.role === 'chemist') {
      setCurrentView('chemist');
    } else {
      setCurrentView('customer');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('medishop_auth');
    setCurrentView('customer');
  };

  // Open auth modal with role preset
  const handleOpenAuth = (rolePreset = 'customer') => {
    setAuthInitialRole(rolePreset);
    setIsAuthModalOpen(true);
  };

  // Handle OCR extracted items addition
  const handleAddPrescriptionItems = (extractedItems) => {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'chemist' ? (
          <ChemistDashboard
            initialEstimateToken={chemistScannerToken}
            onClearToken={() => setChemistScannerToken(null)}
            activePharmacy={currentUser?.role === 'chemist' ? currentUser.pharmacy : null}
            onSwitchToCustomer={() => setCurrentView('customer')}
          />
        ) : (
          <CustomerPortal
            onOpenOcrModal={() => setIsOcrModalOpen(true)}
            onGenerateEstimate={handleGenerateEstimate}
            cartItems={cartItems}
            setCartItems={setCartItems}
            onOpenReviews={(pharmacy) => setSelectedPharmacyForReview(pharmacy)}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-mono font-bold text-sm">
              +
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Medishop Connect
              </div>
              <div>
                Drugs & Cosmetics Act, 1940 and DPDP Act, 2023 Compliant.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-slate-600">
            <button
              onClick={() => handleOpenAuth('chemist')}
              className="hover:text-teal-700"
            >
              Medical Shop Owner Registration (Drug License)
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenAuth('customer')}
              className="hover:text-teal-700"
            >
              Customer Phone Signup
            </button>
          </div>

          <div className="text-slate-400 font-medium">
            Clinical Teal & Clean Slate Edition
          </div>
        </div>
      </footer>

      {/* MODAL 0: Role-Based Authentication (Customer vs Chemist) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialRole={authInitialRole}
      />

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
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 space-y-5 overflow-y-auto shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Pre-Visit Basket ({cartItems.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <div className="font-semibold text-xs text-slate-600">Basket is empty</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.brand_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">MRP ₹{item.mrp} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-900">₹{(item.mrp * item.qty).toFixed(2)}</span>
                        <button
                          onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between font-bold text-sm">
                  <span>Cart Retail Total:</span>
                  <span className="font-mono">₹{cartItems.reduce((sum, i) => sum + i.mrp * i.qty, 0).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('customer');
                  }}
                  className="w-full clinical-btn-primary py-2.5 text-xs"
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
