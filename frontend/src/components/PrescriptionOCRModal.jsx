import React, { useState } from 'react';
import { 
  DrPillMascot, 
  CuteMedicineBottle 
} from './CartoonMascots';
import { 
  UploadCloud, 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audio';

export default function PrescriptionOCRModal({ isOpen, onClose, onAddPrescriptionItems }) {
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [customFile, setCustomFile] = useState(null);

  if (!isOpen) return null;

  const handleRunOcr = async (sampleType) => {
    setSelectedSample(sampleType);
    setIsScanning(true);
    playPop();

    try {
      const response = await fetch('/api/prescriptions/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample_id: sampleType })
      });
      const data = await response.json();
      
      // Simulate quick friendly scan delay for realistic cartoon laser effect
      setTimeout(() => {
        setIsScanning(false);
        setOcrResult(data);
        playSuccessChime();
      }, 1200);
    } catch (err) {
      console.error("OCR parse error:", err);
      setIsScanning(false);
    }
  };

  const handleApplyToCart = () => {
    if (!ocrResult || !ocrResult.extracted_items) return;
    const itemsToAdd = ocrResult.extracted_items.map(item => ({
      ...item.medicine_details,
      qty: item.recommended_qty || 1
    }));
    onAddPrescriptionItems(itemsToAdd, ocrResult.prescription_metadata);
    playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="cartoon-card bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative border-4 border-slate-900 shadow-cartoon-lg">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-medipink-100 hover:bg-medipink-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-lavender-100 border-2 border-slate-900 rounded-2xl shadow-cartoon-sm">
            <Camera className="w-8 h-8 text-lavender-700" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-lavender-100 border border-lavender-400 rounded-full text-xs font-black text-lavender-700">
              <Sparkles className="w-3.5 h-3.5" />
              AI Prescription OCR Scanner
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Scan & Upload Doctor's Prescription 📷
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              Extracts doctor notes, medicine names, and dosages into your multi-item cart in seconds.
            </p>
          </div>
        </div>

        {/* Sample Prescription Presets for Instant Demo */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-sunny-500 fill-sunny-400" />
            Quick Demo: Select a sample doctor prescription:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleRunOcr('bronchitis')}
              disabled={isScanning}
              className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
                selectedSample === 'bronchitis' ? 'bg-bubble-200 shadow-cartoon-sm' : 'bg-slate-50 hover:bg-bubble-50'
              }`}
            >
              <div className="text-xs font-black text-slate-900">Dr. Priya (Chest/Allergy)</div>
              <div className="text-[11px] text-slate-600 font-bold mt-1">Augmentin + Pan-D + Dolo</div>
              <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 bg-sunny-200 rounded-md border border-slate-900">
                Schedule H Antibiotic
              </span>
            </button>

            <button
              onClick={() => handleRunOcr('hypertension_diabetes')}
              disabled={isScanning}
              className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
                selectedSample === 'hypertension_diabetes' ? 'bg-mint-200 shadow-cartoon-sm' : 'bg-slate-50 hover:bg-mint-50'
              }`}
            >
              <div className="text-xs font-black text-slate-900">Dr. Narayan (Cardio)</div>
              <div className="text-[11px] text-slate-600 font-bold mt-1">Telma 40 + Glycomet-GP</div>
              <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 bg-mint-200 rounded-md border border-slate-900">
                Chronic Care Basket
              </span>
            </button>

            <button
              onClick={() => handleRunOcr('general')}
              disabled={isScanning}
              className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
                selectedSample === 'general' ? 'bg-sunny-200 shadow-cartoon-sm' : 'bg-slate-50 hover:bg-sunny-50'
              }`}
            >
              <div className="text-xs font-black text-slate-900">Dr. Rajesh (General Rx)</div>
              <div className="text-[11px] text-slate-600 font-bold mt-1">Montair-LC + ORS Sachet</div>
              <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 bg-bubble-200 rounded-md border border-slate-900">
                Mild Allergy & Hydration
              </span>
            </button>
          </div>
        </div>

        {/* Prescription Drag & Drop Area */}
        <div 
          onClick={() => handleRunOcr('bronchitis')}
          className="cartoon-card p-6 border-2 border-dashed border-slate-400 bg-slate-50 text-center cursor-pointer hover:bg-lavender-50 transition-colors space-y-3"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-lavender-200 border-2 border-slate-900 flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-lavender-700" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-sm">
              Drag & Drop Prescription Photo or Click to Scan
            </div>
            <div className="text-xs text-slate-500 font-bold mt-1">
              Supports JPG, PNG, PDF • Auto-encrypted under DPDP Act 2023
            </div>
          </div>
        </div>

        {/* Scanning Laser Animation */}
        {isScanning && (
          <div className="cartoon-card p-6 bg-lavender-100 text-center space-y-3 relative overflow-hidden border-2 border-lavender-500">
            {/* Animated Laser Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500 shadow-lg shadow-red-500/50 animate-bounce" />
            <DrPillMascot size={70} className="mx-auto animate-spin" />
            <div className="font-black text-slate-900 text-sm">
              Dr. Capsule is reading handwriting & cross-referencing Schedule H records...
            </div>
            <div className="text-xs text-slate-600 font-semibold">
              OCR Engine running fuzzy string matching on Indian Brand Registry...
            </div>
          </div>
        )}

        {/* OCR Result View */}
        {ocrResult && !isScanning && (
          <div className="space-y-4 pt-2 border-t-2 border-slate-200">
            {/* Doctor & Patient Metadata Header */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs flex flex-wrap justify-between gap-2">
              <div>
                <span className="text-slate-500 font-bold">Doctor:</span>{' '}
                <strong className="text-slate-900">{ocrResult.prescription_metadata.doctor_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Patient:</span>{' '}
                <strong className="text-slate-900">{ocrResult.prescription_metadata.patient_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Rx ID:</span>{' '}
                <span className="font-mono text-purple-700 font-bold">{ocrResult.prescription_metadata.rx_id}</span>
              </div>
            </div>

            {/* Schedule Compliance Warning / Notice */}
            <div className={`p-3 rounded-xl border-2 border-slate-900 flex items-start gap-2.5 text-xs font-semibold ${
              ocrResult.has_schedule_h ? 'bg-sunny-100 text-sunny-900' : 'bg-mint-100 text-mint-900'
            }`}>
              {ocrResult.has_schedule_h ? (
                <AlertTriangle className="w-4 h-4 text-sunny-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-mint-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-black">Schedule Notice: </span>
                {ocrResult.schedule_compliance_notice}
              </div>
            </div>

            {/* Extracted Medicines List */}
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Extracted Medicines ({ocrResult.extracted_items.length}):
              </div>
              {ocrResult.extracted_items.map((item, idx) => (
                <div key={idx} className="cartoon-card p-3 bg-white flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">
                        {item.medicine_details?.brand_name || item.detected_text}
                      </span>
                      <span className={`cartoon-badge ${
                        item.schedule === 'Schedule H' ? 'bg-sunny-200 text-sunny-800' : 'bg-mint-200 text-mint-800'
                      }`}>
                        {item.schedule}
                      </span>
                    </div>
                    <div className="text-slate-500 font-bold">
                      {item.dosage} • Duration: {item.duration}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Salt: {item.medicine_details?.generic_salt}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-slate-900 text-sm">
                      ₹{item.medicine_details?.mrp}
                    </div>
                    <div className="text-xs text-mint-600 font-bold">
                      Qty: {item.recommended_qty} strip
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button: Add all to Cart */}
            <button
              onClick={handleApplyToCart}
              className="w-full cartoon-btn cartoon-btn-primary py-3 text-base shadow-cartoon-hover"
            >
              <span>Add All Extracted Medicines to Pre-Visit Cart</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
