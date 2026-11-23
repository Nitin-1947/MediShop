import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Scan, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  PackagePlus, 
  Receipt, 
  RefreshCw,
  Sparkles,
  Layers,
  Calendar,
  DollarSign
} from 'lucide-react';
import { playPop, playSuccessChime, playCashDing } from '../utils/audio';

export default function ChemistBillOCRScanner({ pharmacyId, onInventoryUpdated }) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [parsedInvoice, setParsedInvoice] = useState(null);
  const [editableItems, setEditableItems] = useState([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Scan & Parse invoice using backend OCR engine
  const handleScanInvoice = async (sampleType) => {
    setSelectedSample(sampleType);
    setIsScanning(true);
    setCommitSuccess(null);
    setErrorMessage(null);
    playPop();

    try {
      const res = await fetch('/api/chemist/invoice/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sample_id: sampleType,
          pharmacy_id: pharmacyId
        })
      });
      const data = await res.json();

      setTimeout(() => {
        setIsScanning(false);
        if (data.success) {
          playSuccessChime();
          setParsedInvoice(data.invoice_metadata);
          setEditableItems(data.line_items);
        } else {
          setErrorMessage(data.error || "Failed to parse invoice.");
        }
      }, 900);
    } catch (err) {
      setIsScanning(false);
      setErrorMessage("Error connecting to invoice scanner.");
    }
  };

  // Update item field in table
  const handleItemChange = (index, field, value) => {
    setEditableItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Commit parsed items directly into that specific shop's inventory
  const handleCommitInventory = async () => {
    if (!editableItems || editableItems.length === 0) return;
    setIsCommitting(true);
    setErrorMessage(null);
    playPop();

    try {
      const res = await fetch('/api/chemist/invoice/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          invoice_number: parsedInvoice?.invoice_number || "INV-BILL-OCR",
          items: editableItems
        })
      });
      const data = await res.json();

      if (data.success) {
        playCashDing();
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
        setCommitSuccess(data);
        if (onInventoryUpdated) {
          onInventoryUpdated();
        }
      } else {
        setErrorMessage(data.error || "Failed to commit inventory.");
      }
    } catch (err) {
      setErrorMessage("Network error while updating store inventory.");
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 p-6 rounded-2xl border border-teal-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-teal-300 rounded-full text-xs font-semibold text-teal-800 shadow-sm">
            <Scan className="w-3.5 h-3.5 text-teal-600" />
            Direct Purchase Bill & Invoice OCR Scanner
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Scan Wholesaler Invoices to Auto-Update Medicine Stock
          </h3>
          <p className="text-xs text-slate-600 max-w-xl font-medium">
            Upload or scan your distributor purchase bills (GSK, Sun Pharma, Cipla, Micro Labs). The OCR system extracts brand names, batch numbers, expiry dates, and received quantities, immediately updating this shop's live stock!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 bg-teal-600 text-white rounded-lg shadow-sm flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>Store ID: {pharmacyId}</span>
          </span>
        </div>
      </div>

      {/* Preset Distributor Invoices for Instant 1-Click Simulation */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-teal-600" />
          <span>Quick Demo: Choose a Sample Wholesaler Purchase Invoice</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleScanInvoice('wholesaler_gsk')}
            disabled={isScanning}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedSample === 'wholesaler_gsk'
                ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Vardhman Pharma (GSK & Alkem)</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Augmentin 625, Pan-D, Azithral, Dolo</div>
            <div className="mt-2 text-[10px] font-semibold text-teal-700 bg-teal-50 inline-block px-2 py-0.5 rounded border border-teal-200">
              4 Medicine Items • Net ₹21,800
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleScanInvoice('sunpharma_invoice')}
            disabled={isScanning}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedSample === 'sunpharma_invoice'
                ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Sun Healthcare Stockist Bill</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Pantocid DSR, Volini Gel, Telma 40</div>
            <div className="mt-2 text-[10px] font-semibold text-teal-700 bg-teal-50 inline-block px-2 py-0.5 rounded border border-teal-200">
              3 Medicine Items • Net ₹14,460
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleScanInvoice('micro_cipla_invoice')}
            disabled={isScanning}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedSample === 'micro_cipla_invoice'
                ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Karnataka Pharma (Micro & Cipla)</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Dolo 650 (120 strips), Montair-LC, ORS</div>
            <div className="mt-2 text-[10px] font-semibold text-teal-700 bg-teal-50 inline-block px-2 py-0.5 rounded border border-teal-200">
              3 Medicine Items • Net ₹9,810
            </div>
          </button>
        </div>
      </div>

      {/* Bill Upload Drag & Drop Area */}
      <div 
        onClick={() => handleScanInvoice('wholesaler_gsk')}
        className="clinical-card p-6 border-2 border-dashed border-slate-300 hover:border-teal-500 text-center cursor-pointer transition-all bg-white hover:bg-teal-50/20 space-y-2"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">
            Upload Printed Purchase Invoice / Bill PDF or JPG
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">
            Click here or drag-and-drop a wholesaler bill image to run optical character extraction
          </div>
        </div>
      </div>

      {/* Scanning State */}
      {isScanning && (
        <div className="clinical-card p-8 text-center space-y-3 bg-teal-50/50 border border-teal-200">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-slate-900">
            Scanning & Parsing Distributor Bill Lines...
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Optical OCR matching medicine brands, batch codes, GST rates, and received quantities...
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Parsed Invoice Review & Live Stock Update Table */}
      {parsedInvoice && !isScanning && (
        <div className="clinical-card p-6 space-y-5 bg-white">
          {/* Invoice Header Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Distributor Invoice
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {parsedInvoice.distributor_name}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Invoice #{parsedInvoice.invoice_number} • Date: {parsedInvoice.invoice_date}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase block">
                Total Wholesaler Value
              </span>
              <span className="text-xl font-bold font-mono text-teal-700">
                ₹{parsedInvoice.total_invoice_value?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Extracted Medicine Lines ({editableItems.length}) — Review & Adjust Before Commit:
              </span>
              <span className="text-xs text-teal-700 font-semibold">
                Quantities will be directly added to your live store stock
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medicine Brand</th>
                    <th className="p-3">Generic Salt</th>
                    <th className="p-3">Batch No</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Qty Recv.</th>
                    <th className="p-3">Retail MRP</th>
                    <th className="p-3">Wholesale Rate</th>
                    <th className="p-3">Customer Disc %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {editableItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {item.medicine_name}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {item.generic_salt}
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        <input
                          type="text"
                          value={item.batch_no}
                          onChange={(e) => handleItemChange(idx, 'batch_no', e.target.value)}
                          className="w-24 px-2 py-1 border border-slate-200 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        <input
                          type="date"
                          value={item.expiry_date}
                          onChange={(e) => handleItemChange(idx, 'expiry_date', e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.quantity_received}
                          onChange={(e) => handleItemChange(idx, 'quantity_received', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-teal-300 bg-teal-50 font-bold text-teal-800 rounded text-xs"
                          min="1"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        ₹{item.mrp}
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        ₹{item.purchase_rate}
                      </td>
                      <td className="p-3 font-mono">
                        <input
                          type="number"
                          value={item.discount_for_customer}
                          onChange={(e) => handleItemChange(idx, 'discount_for_customer', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1 border border-slate-200 rounded text-xs text-emerald-700 font-bold"
                          min="0"
                          max="50"
                        /> %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Commit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Clicking commit will instantly add these stock quantities to your pharmacy's live inventory and make them visible to nearby customers.
            </div>

            <button
              type="button"
              onClick={handleCommitInventory}
              disabled={isCommitting}
              className="clinical-btn-primary py-2.5 px-6 shrink-0"
            >
              <PackagePlus className="w-4 h-4" />
              <span>{isCommitting ? "Updating Inventory..." : "Approve & Update Store Inventory Directly"}</span>
            </button>
          </div>

          {commitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {commitSuccess.message}
              </div>
              <div className="text-emerald-800 font-medium pl-6">
                Updated {commitSuccess.summary.updated_stock_lines} existing medicines and created {commitSuccess.summary.added_medicines} new stock lines. Total active lines in store: {commitSuccess.summary.total_store_inventory_lines} ({commitSuccess.summary.total_stock_units} total strips in stock).
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
