import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../../types/finance';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';

const CATEGORIES: Category[] = [
  'Food', 'Transport', 'Shopping', 'Entertainment',
  'Subscriptions', 'Utilities', 'Academics', 'Health', 'Other',
];
const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'NetBanking'] as const;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Partial<Transaction>;
  mode?: 'add' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'add',
}) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: 'Food' as Category,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'Cash' | 'NetBanking',
    note: '',
    merchant: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food',
        date: initialData.date || new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        note: initialData.note || '',
        merchant: initialData.merchant || '',
      });
    } else {
      setForm({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        note: '',
        merchant: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      note: form.note.trim() || undefined,
      merchant: form.merchant.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    showToast(
      mode === 'edit' ? 'Transaction updated successfully' : 'Transaction added successfully'
    );
    onClose();
  };

  const inputClass =
    'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      subtitle="Track every rupee — big or small."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2 bg-[#253129] rounded-xl p-1">
          {(['expense', 'income'] as TransactionType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(p => ({ ...p, type: t }))}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                form.type === t
                  ? t === 'expense'
                    ? 'bg-[#F17E69]/15 text-[#F17E69] border border-[#F17E69]/30'
                    : 'bg-[#38C98A]/15 text-[#38C98A] border border-[#38C98A]/30'
                  : 'text-[#A6B2A8] hover:text-[#F7F5EF]'
              }`}
            >
              {t === 'expense' ? '− Expense' : '+ Income'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={`${inputClass} ${errors.title ? 'border-[#F17E69]/50' : ''}`}
            placeholder="e.g. Canteen chai & bun maska"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          />
          {errors.title && <p className="text-xs text-[#F17E69] mt-1">{errors.title}</p>}
        </div>

        {/* Amount + Payment */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} ${errors.amount ? 'border-[#F17E69]/50' : ''}`}
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
            />
            {errors.amount && <p className="text-xs text-[#F17E69] mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className={labelClass}>Payment Method</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={form.paymentMethod}
              onChange={e =>
                setForm(p => ({
                  ...p,
                  paymentMethod: e.target.value as 'UPI' | 'Card' | 'Cash' | 'NetBanking',
                }))
              }
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(p => ({ ...p, category: cat }))}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left ${
                  form.category === cat
                    ? 'bg-[#38C98A]/15 border-[#38C98A]/40 text-[#38C98A]'
                    : 'border-[#303B33] text-[#A6B2A8] hover:border-[#303B33] hover:text-[#F7F5EF] bg-[#253129]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date + Merchant */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              className={`${inputClass} ${errors.date ? 'border-[#F17E69]/50' : ''}`}
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Merchant (optional)</label>
            <input
              className={inputClass}
              placeholder="e.g. Haldirams"
              value={form.merchant}
              onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))}
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className={labelClass}>Note (optional)</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="Any quick note about this expense..."
            value={form.note}
            onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors"
          >
            {mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;

