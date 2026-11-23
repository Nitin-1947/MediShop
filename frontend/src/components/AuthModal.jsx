import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Mail,
  Building2,
  Clock
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audio';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialRole = 'customer' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'customer' | 'chemist'
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Customer Form State
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPincode, setCustomerPincode] = useState('560038');
  const [otpCode, setOtpCode] = useState('1234');
  const [showOtpField, setShowOtpField] = useState(false);

  // Chemist Form State
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [chemistPhone, setChemistPhone] = useState('');
  const [chemistEmail, setChemistEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePincode, setStorePincode] = useState('560038');
  const [storeDiscount, setStoreDiscount] = useState('15');
  const [is24x7, setIs24x7] = useState(false);
  const [chemistLoginQuery, setChemistLoginQuery] = useState('');

  if (!isOpen) return null;

  // Handle Customer Submit
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!customerPhone.trim()) {
      setErrorMsg("Please enter your 10-digit mobile number.");
      return;
    }

    if (!showOtpField && mode === 'signup') {
      setShowOtpField(true);
      playPop();
      return;
    }

    setIsLoading(true);
    playPop();

    try {
      const endpoint = mode === 'signup' ? '/api/auth/customer-signup' : '/api/auth/customer-login';
      const payload = mode === 'signup' 
        ? { phone: customerPhone, full_name: customerName || "Customer " + customerPhone.slice(-4), pincode: customerPincode }
        : { phone: customerPhone, otp: otpCode };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        playSuccessChime();
        onAuthSuccess({
          role: 'customer',
          user: data.user
        });
        onClose();
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Chemist Submit
  const handleChemistSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    playPop();

    try {
      if (mode === 'signup') {
        if (!storeName || !ownerName || !licenseNumber || !chemistPhone || !storeAddress) {
          setErrorMsg("Please fill in all mandatory pharmacy details and Drug License number.");
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/chemist-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_name: storeName,
            owner_name: ownerName,
            license_number: licenseNumber,
            phone: chemistPhone,
            email: chemistEmail,
            address: storeAddress,
            pincode: storePincode,
            flat_store_discount: parseFloat(storeDiscount) || 12.0,
            is_24_7: is24x7
          })
        });
        const data = await res.json();

        if (data.success) {
          playSuccessChime();
          onAuthSuccess({
            role: 'chemist',
            pharmacy: data.pharmacy
          });
          onClose();
        } else {
          setErrorMsg(data.error || "Pharmacy registration failed.");
        }
      } else {
        // Chemist Login
        const res = await fetch('/api/auth/chemist-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_or_license: chemistLoginQuery || "KA-BLR-DL-2023-88219"
          })
        });
        const data = await res.json();

        if (data.success) {
          playSuccessChime();
          onAuthSuccess({
            role: 'chemist',
            pharmacy: data.pharmacy
          });
          onClose();
        } else {
          setErrorMsg(data.error || "Login failed.");
        }
      }
    } catch (err) {
      setErrorMsg("Connection error. Please check server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Verified Portal Access
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to Medishop Connect
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Choose your account portal to access customer price comparisons or manage your licensed pharmacy inventory.
          </p>
        </div>

        {/* Portal Role Selector (Two distinct tabs) */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => { playPop(); setSelectedRole('customer'); setErrorMsg(null); }}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'customer'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => { playPop(); setSelectedRole('chemist'); setErrorMsg(null); }}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'chemist'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-teal-600" />
            <span>Medical Shop Owner</span>
          </button>
        </div>

        {/* Mode Toggle (Signup vs Login) */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {selectedRole === 'customer' ? 'Customer Authentication' : 'Chemist License Verification'}
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => { playPop(); setMode('signup'); setShowOtpField(false); setErrorMsg(null); }}
              className={`font-semibold pb-0.5 border-b-2 transition-colors ${
                mode === 'signup' ? 'text-teal-700 border-teal-600' : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              New Registration
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => { playPop(); setMode('login'); setErrorMsg(null); }}
              className={`font-semibold pb-0.5 border-b-2 transition-colors ${
                mode === 'login' ? 'text-teal-700 border-teal-600' : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. CUSTOMER PORTAL AUTH FORM */}
        {selectedRole === 'customer' && (
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="clinical-input pl-9"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Mobile Number (for Order & Estimate SMS)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9845012345"
                  className="clinical-input pl-9"
                  maxLength={10}
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                A 4-digit verification code will be sent to this number.
              </p>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Default Area / Pincode
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerPincode}
                    onChange={(e) => setCustomerPincode(e.target.value)}
                    placeholder="560038 (Indiranagar, Bengaluru)"
                    className="clinical-input pl-9"
                  />
                </div>
              </div>
            )}

            {/* OTP Verification Step */}
            {showOtpField && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal-800">Enter OTP Verification Code</span>
                  <span className="text-teal-600 font-mono font-bold">Demo OTP: 1234</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="clinical-input pl-9 font-mono font-bold tracking-widest text-center"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full clinical-btn-primary py-2.5"
            >
              <span>{isLoading ? "Verifying..." : (showOtpField ? "Verify OTP & Enter Customer Portal" : (mode === 'signup' ? "Send OTP & Register" : "Sign In to Pre-Visit Cart"))}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. MEDICAL SHOP OWNER / CHEMIST PORTAL AUTH FORM */}
        {selectedRole === 'chemist' && (
          <form onSubmit={handleChemistSubmit} className="space-y-4">
            {mode === 'signup' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pharmacy / Store Name *
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Sanjivani 24/7 Medico"
                        className="clinical-input pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pharmacist / Owner Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Chirag Sharma"
                        className="clinical-input pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mandatory Drug License Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Drug License Number (Form 20B/21B) *
                    </label>
                    <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Drugs & Cosmetics Act 1940
                    </span>
                  </div>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-teal-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. KA-BLR-DL-2024-88219"
                      className="clinical-input pl-9 font-mono font-semibold uppercase"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Verified automatically against state drug controller records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Store Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={chemistPhone}
                        onChange={(e) => setChemistPhone(e.target.value)}
                        placeholder="e.g. 9845012345"
                        className="clinical-input pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Store Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={chemistEmail}
                        onChange={(e) => setChemistEmail(e.target.value)}
                        placeholder="contact@sanjivani.in"
                        className="clinical-input pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Physical Store Address *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      placeholder="Shop #12, 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru"
                      rows={2}
                      className="clinical-input pl-9 resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Store-wide Flat Discount %
                    </label>
                    <input
                      type="number"
                      value={storeDiscount}
                      onChange={(e) => setStoreDiscount(e.target.value)}
                      min="0"
                      max="40"
                      className="clinical-input"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-4">
                    <input
                      type="checkbox"
                      id="is24x7"
                      checked={is24x7}
                      onChange={(e) => setIs24x7(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="is24x7" className="text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      24/7 Night Duty Pharmacy
                    </label>
                  </div>
                </div>
              </>
            ) : (
              // Chemist Login Mode
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Enter Drug License Number or Store Phone
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={chemistLoginQuery}
                      onChange={(e) => setChemistLoginQuery(e.target.value)}
                      placeholder="KA-BLR-DL-2023-88219 or Phone"
                      className="clinical-input pl-9"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-700">Quick Demo Presets:</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setChemistLoginQuery('KA-BLR-DL-2023-88219')}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono hover:border-teal-500"
                    >
                      Sanjivani 24/7 (KA-BLR-DL-2023-88219)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChemistLoginQuery('KA-BLR-DL-2021-34901')}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-mono hover:border-teal-500"
                    >
                      Apollo Hub (KA-BLR-DL-2021-34901)
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full clinical-btn-primary py-2.5"
            >
              <span>{isLoading ? "Verifying License..." : (mode === 'signup' ? "Verify Drug License & Register Pharmacy" : "Access Pharmacy Dashboard")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
