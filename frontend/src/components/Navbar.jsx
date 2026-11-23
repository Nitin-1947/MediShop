import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Store, 
  Search, 
  Cpu, 
  User, 
  LogOut, 
  ShieldCheck, 
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { toggleMute, getMuteState, playPop } from '../utils/audio';

export default function Navbar({ 
  currentView, 
  onChangeView, 
  cartCount, 
  onOpenCart, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => { playPop(); onChangeView(currentUser?.role === 'chemist' ? 'chemist' : 'customer'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
            <span className="text-xl font-bold font-mono">+</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Medishop<span className="text-teal-600">Connect</span>
              </span>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-800 rounded-full text-[10px] font-bold border border-teal-200">
                Hyperlocal
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-600" />
              <span>Real-Time Pharmacy Network</span>
            </div>
          </div>
        </div>

        {/* View Navigation Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { playPop(); onChangeView('customer'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'customer' 
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-teal-600" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => { playPop(); onChangeView('chemist'); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'chemist' 
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-teal-600" />
            <span>Chemist Dashboard</span>
          </button>
        </nav>

        {/* Right side: User Session / Auth + Audio + Cart */}
        <div className="flex items-center gap-2.5">
          {/* Active Auth Profile Indicator / Switch Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center gap-2">
                {currentUser.role === 'chemist' ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                        {currentUser.pharmacy?.store_name || "Chemist"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        {currentUser.pharmacy?.license_number}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-800 leading-tight">
                        {currentUser.user?.full_name || "Customer"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {currentUser.user?.phone}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => { playPop(); onOpenAuth(currentUser.role === 'chemist' ? 'customer' : 'chemist'); }}
                title="Switch Portal Account"
                className="p-2 text-slate-500 hover:text-teal-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Switch</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { playPop(); onOpenAuth('customer'); }}
              className="clinical-btn-secondary text-xs py-1.5 px-3"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? "Unmute Sound" : "Mute Sound"}
            className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => { playPop(); onOpenCart(); }}
            className="clinical-btn-primary py-2 px-3 text-xs relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Pre-Visit Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-teal-800 text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Pills */}
      <div className="flex md:hidden px-4 pb-2.5 pt-1 gap-1.5 overflow-x-auto bg-slate-50 border-t border-slate-200 text-xs font-bold">
        <button
          onClick={() => { playPop(); onChangeView('customer'); }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentView === 'customer' ? 'bg-teal-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Customer Portal
        </button>
        <button
          onClick={() => { playPop(); onChangeView('chemist'); }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            currentView === 'chemist' ? 'bg-teal-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Chemist Dashboard
        </button>
      </div>
    </header>
  );
}
