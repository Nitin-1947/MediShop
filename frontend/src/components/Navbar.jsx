import React, { useState } from 'react';
import { DrPillMascot } from './CartoonMascots';
import { 
  ShoppingBag, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Store, 
  Search, 
  Cpu, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { toggleMute, getMuteState, playPop } from '../utils/audio';

export default function Navbar({ currentView, onChangeView, cartCount, onOpenCart }) {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-3 border-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Mascot */}
        <div 
          onClick={() => { playPop(); onChangeView('customer'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <DrPillMascot size={52} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-cartoon">
                Medishop<span className="text-bubble-500">Connect</span>
              </span>
              <span className="cartoon-badge bg-sunny-300 text-slate-900 text-[10px] py-0.5 px-2">
                Hyperlocal
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>Indiranagar 100ft Rd, Bengaluru</span>
            </div>
          </div>
        </div>

        {/* View Navigation Switcher (Customer vs Chemist vs Architecture) */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 shadow-cartoon-sm">
          <button
            onClick={() => { playPop(); onChangeView('customer'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              currentView === 'customer' 
                ? 'bg-bubble-400 text-slate-900 border border-slate-900 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => { playPop(); onChangeView('chemist'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              currentView === 'chemist' 
                ? 'bg-mint-400 text-slate-900 border border-slate-900 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Chemist Dashboard</span>
          </button>

          <button
            onClick={() => { playPop(); onChangeView('architecture'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              currentView === 'architecture' 
                ? 'bg-sunny-400 text-slate-900 border border-slate-900 shadow-sm' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture & Diagrams</span>
          </button>
        </nav>

        {/* Right actions: Audio Mute & Cart Button */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? "Unmute Sound SFX" : "Mute Sound SFX"}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-700 transition-transform active:scale-95 shadow-cartoon-sm"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-bubble-600" />}
          </button>

          {/* Cart Floating Button */}
          <button
            onClick={() => { playPop(); onOpenCart(); }}
            className="cartoon-btn cartoon-btn-primary py-2 px-3.5 relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Pre-Visit Basket</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-medipink-500 text-white text-[11px] font-black border border-slate-900 flex items-center justify-center animate-bounce-subtle">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile view switch pills */}
      <div className="flex md:hidden px-4 pb-2.5 pt-1 gap-1.5 overflow-x-auto">
        <button
          onClick={() => { playPop(); onChangeView('customer'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 ${
            currentView === 'customer' ? 'bg-bubble-400 border border-slate-900' : 'bg-slate-100'
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => { playPop(); onChangeView('chemist'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 ${
            currentView === 'chemist' ? 'bg-mint-400 border border-slate-900' : 'bg-slate-100'
          }`}
        >
          Chemist
        </button>
        <button
          onClick={() => { playPop(); onChangeView('architecture'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 ${
            currentView === 'architecture' ? 'bg-sunny-400 border border-slate-900' : 'bg-slate-100'
          }`}
        >
          Architecture & Diagrams
        </button>
      </div>
    </header>
  );
}
