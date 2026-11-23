import React, { useState } from 'react';
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
      
      setTimeout(() => {
        setIsScanning(false);
        setOcrResult(data);
        playSuccessChime();
      }, 900);
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
      <div className="clinical-card bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-600">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-800">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Prescription OCR Vision Reader
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Scan & Upload Doctor's Prescription
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Automatically detects handwriting, medicine names, dosages, and Schedule H safety notices.
            </p>
          </div>
        </div>

        {/* Sample Prescription Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>Choose a Sample Doctor Prescription:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleRunOcr('bronchitis')}
              disabled={isScanning}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSample === 'bronchitis' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">Dr. Priya (Chest Care)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Augmentin + Pan-D + Dolo</div>
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                Schedule H Antibiotic
              </span>
            </button>

            <button
              onClick={() => handleRunOcr('hypertension_diabetes')}
              disabled={isScanning}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSample === 'hypertension_diabetes' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">Dr. Narayan (Cardiology)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Telma 40 + Glycomet-GP</div>
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 bg-teal-100 text-teal-800 rounded">
                Chronic Care Basket
              </span>
            </button>

            <button
              onClick={() => handleRunOcr('general')}
              disabled={isScanning}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSample === 'general' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">Dr. Rajesh (General Rx)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Montair-LC + ORS Sachet</div>
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                General OTC & Allergy
              </span>
            </button>
          </div>
        </div>

        {/* Prescription Drag & Drop Area */}
        <div 
          onClick={() => handleRunOcr('bronchitis')}
          className="clinical-card p-6 border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 text-center cursor-pointer transition-colors space-y-2"
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">
              Drag & Drop Prescription Photo or Click to Scan
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
              JPG, PNG, PDF • Auto-encrypted under DPDP Act 2023 with 7-day auto-purge
            </div>
          </div>
        </div>

        {/* Scanning State */}
        {isScanning && (
          <div className="clinical-card p-6 bg-teal-50/50 border border-teal-200 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="font-bold text-slate-900 text-xs">
              Reading doctor handwriting and cross-referencing Schedule H database...
            </div>
          </div>
        )}

        {/* Results */}
        {ocrResult && !isScanning && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Metadata Header */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap justify-between gap-2">
              <div>
                <span className="text-slate-400">Doctor:</span>{' '}
                <strong className="text-slate-800">{ocrResult.prescription_metadata.doctor_name}</strong>
              </div>
              <div>
                <span className="text-slate-400">Patient:</span>{' '}
                <strong className="text-slate-800">{ocrResult.prescription_metadata.patient_name}</strong>
              </div>
              <div>
                <span className="text-slate-400">Rx ID:</span>{' '}
                <span className="font-mono text-teal-700 font-bold">{ocrResult.prescription_metadata.rx_id}</span>
              </div>
            </div>

            {/* Compliance Warning */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
              ocrResult.has_schedule_h 
                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}>
              {ocrResult.has_schedule_h ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold">Schedule Notice: </span>
                {ocrResult.schedule_compliance_notice}
              </div>
            </div>

            {/* Extracted Medicines List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Extracted Medicines ({ocrResult.extracted_items.length}):
              </div>
              {ocrResult.extracted_items.map((item, idx) => (
                <div key={idx} className="clinical-card p-3 bg-white flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.medicine_details?.brand_name || item.detected_text}
                      </span>
                      <span className={`clinical-badge ${
                        item.schedule === 'Schedule H' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {item.schedule}
                      </span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      {item.dosage} • Duration: {item.duration}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold font-mono text-slate-900">
                      ₹{item.medicine_details?.mrp}
                    </div>
                    <div className="text-xs text-teal-700 font-semibold">
                      Qty: {item.recommended_qty} strip
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleApplyToCart}
              className="w-full clinical-btn-primary py-2.5"
            >
              <span>Add All Extracted Medicines to Pre-Visit Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
