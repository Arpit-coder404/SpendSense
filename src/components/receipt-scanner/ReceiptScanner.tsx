import React, { useState, useMemo } from 'react';
import { useRef, useCallback } from 'react';
import Modal from '../common/Modal';
import { Category, Transaction } from '../../types/finance';
import { Camera, Upload, X, RefreshCw, Check, ImageIcon } from 'lucide-react';

interface ReceiptScannerProps {
  onClose: () => void;
  onAddTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const DEMO_EXTRACTED = {
  title: 'Haldirams Snacks & Cold Drink',
  amount: '286',
  merchant: 'Haldirams — CP',
  date: new Date().toISOString().split('T')[0],
  category: 'Food' as Category,
  paymentMethod: 'UPI' as const,
  note: 'Extracted from receipt scan (demo)',
};

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onClose, onAddTransaction }) => {
  const [phase, setPhase] = useState<'upload' | 'scanning' | 'review'>('upload');
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ ...DEMO_EXTRACTED });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target?.result as string);
      setPhase('scanning');
      // Simulate scanning delay
      setTimeout(() => setPhase('review'), 2600);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const retake = () => {
    setPreview(null);
    setPhase('upload');
    setForm({ ...DEMO_EXTRACTED });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = () => {
    onAddTransaction({
      title: form.title,
      amount: parseFloat(form.amount) || 0,
      type: 'expense',
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      merchant: form.merchant,
      note: form.note,
      updatedAt: new Date().toISOString(),
    });
  };

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1C251F] border border-[#303B33] rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303B33]">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#F7F5EF]">Snap &amp; Track</h2>
            <p className="text-xs text-[#A6B2A8]">Capture a receipt and add it as a transaction</p>
          </div>
          <button onClick={onClose} className="text-[#A6B2A8] hover:text-[#F7F5EF] text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Phase: Upload */}
          {phase === 'upload' && (
            <div
              className="border-2 border-dashed border-[#303B33] hover:border-[#38C98A]/40 rounded-2xl p-10 text-center cursor-pointer transition-colors"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center mx-auto mb-4">
                <Camera size={24} color="#A78BFA" />
              </div>
              <p className="text-sm font-semibold text-[#F7F5EF] mb-1">Drop a receipt here</p>
              <p className="text-xs text-[#A6B2A8] mb-4">Or click to upload from your device</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-sm font-medium hover:bg-[#A78BFA]/25 transition-colors"
                >
                  <Upload size={13} /> Upload Image
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
              <p className="text-[10px] text-[#A6B2A8] mt-4">
                🔒 Images are not uploaded to any server. All processing is local and demo-only.
              </p>
            </div>
          )}

          {/* Phase: Scanning */}
          {phase === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              {preview && (
                <div className="w-32 h-40 rounded-xl overflow-hidden border border-[#303B33] opacity-60">
                  <img src={preview} alt="Receipt" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#38C98A] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-[#38C98A]">Analysing receipt...</p>
              </div>
              <p className="text-xs text-[#A6B2A8]">Extracting merchant, amount and date</p>
            </div>
          )}

          {/* Phase: Review */}
          {phase === 'review' && (
            <>
              <div className="bg-[#253129] border border-[#38C98A]/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-2">
                <Check size={14} color="#38C98A" />
                <span className="text-xs text-[#38C98A] font-medium">Demo extraction complete — please review and correct fields before saving.</span>
              </div>

              {preview && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-20 rounded-xl overflow-hidden border border-[#303B33] shrink-0">
                    <img src={preview} alt="Receipt" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={retake}
                    className="flex items-center gap-2 text-xs text-[#A6B2A8] hover:text-[#F7F5EF] transition-colors"
                  >
                    <RefreshCw size={12} /> Retake / Remove
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Merchant / Title</label>
                  <input className={inputClass} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Amount (₹)</label>
                    <input type="number" className={inputClass} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" className={inputClass} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select className={`${inputClass} cursor-pointer`} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}>
                      {(['Food','Transport','Shopping','Entertainment','Subscriptions','Utilities','Academics','Health','Other'] as Category[]).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Payment</label>
                    <select className={`${inputClass} cursor-pointer`} value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value as any }))}>
                      {['UPI','Card','Cash','NetBanking'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <input className={inputClass} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors">
                  Add to Transactions
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;

