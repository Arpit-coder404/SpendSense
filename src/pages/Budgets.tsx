import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_META } from '../utils/formatters';
import { Budget, Category } from '../types/finance';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import { Plus, Pencil, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CATEGORIES: Category[] = ['Food','Transport','Shopping','Entertainment','Subscriptions','Utilities','Academics','Health','Other'];

interface BudgetFormData {
  category: Category;
  limit: string;
}

const Budgets: React.FC = () => {
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    categorySpendingThisMonth,
    totalSpentThisMonth,
    user,
    selectedMonth,
    selectedYear,
  } = useFinance();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<BudgetFormData>({ category: 'Food', limit: '' });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const activeBudgets = useMemo(() => {
    return budgets.filter(b => b.month === selectedMonth && b.year === selectedYear);
  }, [budgets, selectedMonth, selectedYear]);

  const totalBudgeted = activeBudgets.reduce((s, b) => s + b.limit, 0);
  const totalUsed = totalSpentThisMonth;

  const openAdd = () => {
    setFormData({ category: 'Food', limit: '' });
    setEditingBudget(null);
    setShowForm(true);
  };

  const openEdit = (budget: Budget) => {
    setFormData({ category: budget.category, limit: budget.limit.toString() });
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleSave = () => {
    const limit = parseFloat(formData.limit);
    if (!limit || limit <= 0) { showToast('Enter a valid budget amount', 'error'); return; }

    if (editingBudget) {
      updateBudget(editingBudget.id, limit);
      showToast(`${formData.category} budget updated to ${formatCurrency(limit)}`);
    } else {
      addBudget({
        category: formData.category,
        limit,
        month: selectedMonth,
        year: selectedYear,
      });
      showToast(`${formData.category} budget set to ${formatCurrency(limit)}`);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string, cat: string) => {
    deleteBudget(id);
    showToast(`${cat} budget removed`, 'info');
  };

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Set Budgets. Not Boundaries.</h1>
          <p className="text-[#A6B2A8] text-sm mt-1">Plan smarter, spend better, and still enjoy the good stuff.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors shrink-0"
        >
          <Plus size={14} /> New Budget
        </button>
      </div>

      {/* Monthly Overview */}
      <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#A6B2A8] font-medium uppercase tracking-wider">
              {MONTHS[selectedMonth]} {selectedYear} — Total Budget
            </p>
            <p className="text-3xl font-bold font-heading text-[#F7F5EF] tabular-nums mt-1">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#A6B2A8]">Spent</p>
            <p className="text-xl font-bold tabular-nums font-heading text-[#F17E69]">{formatCurrency(totalUsed)}</p>
          </div>
        </div>
        <ProgressBar
          percentage={totalBudgeted > 0 ? (totalUsed / totalBudgeted) * 100 : 0}
          height={8}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[#A6B2A8]">
            {totalBudgeted > 0 ? `${((totalUsed / totalBudgeted) * 100).toFixed(0)}% used` : 'No budget set'}
          </span>
          <span className="text-xs text-[#38C98A] font-semibold">
            {formatCurrency(Math.max(0, totalBudgeted - totalUsed))} remaining
          </span>
        </div>
      </div>

      {/* Category Budgets */}
      {activeBudgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#253129] border border-[#303B33] flex items-center justify-center mb-4">
            <TrendingUp size={22} className="text-[#A6B2A8]" />
          </div>
          <h3 className="text-base font-semibold text-[#F7F5EF] mb-1">No budgets set yet</h3>
          <p className="text-sm text-[#A6B2A8] mb-4">Set category budgets to track your spending limits</p>
          <button onClick={openAdd} className="px-4 py-2 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold">
            Create First Budget
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeBudgets.map(budget => {
            const spent = categorySpendingThisMonth[budget.category] || 0;
            const pct = (spent / budget.limit) * 100;
            const remaining = budget.limit - spent;
            const meta = CATEGORY_META[budget.category];

            return (
              <div
                key={budget.id}
                className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4 hover:border-[#38C98A]/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: meta.bgColor, border: `1px solid ${meta.borderDark}` }}
                    >
                      <span style={{ color: meta.color, fontSize: '15px' }}>
                        {budget.category === 'Food' ? '🍽️' :
                          budget.category === 'Transport' ? '🚌' :
                          budget.category === 'Shopping' ? '🛍️' :
                          budget.category === 'Entertainment' ? '🎬' :
                          budget.category === 'Subscriptions' ? '⚡' :
                          budget.category === 'Utilities' ? '📡' :
                          budget.category === 'Academics' ? '📚' :
                          budget.category === 'Health' ? '❤️' : '📦'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F7F5EF]">{budget.category}</p>
                      <p className="text-xs text-[#A6B2A8]">
                        {formatCurrency(spent)} of {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pct >= 100 ? (
                      <span className="flex items-center gap-1 text-xs text-[#F17E69] font-semibold">
                        <AlertTriangle size={11} /> Over budget
                      </span>
                    ) : pct >= 85 ? (
                      <span className="text-xs text-[#F3D66B] font-semibold">{pct.toFixed(0)}% used</span>
                    ) : (
                      <span className="text-xs text-[#A6B2A8]">{pct.toFixed(0)}% used</span>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(budget)}
                        className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#38C98A] hover:bg-[#38C98A]/10 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id, budget.category)}
                        className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#F17E69] hover:bg-[#F17E69]/10 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <ProgressBar percentage={pct} height={6} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-[#A6B2A8]">Budget: {formatCurrency(budget.limit)}</span>
                  <span
                    className="text-xs font-semibold tabular-nums"
                    style={{ color: remaining >= 0 ? '#38C98A' : '#F17E69' }}
                  >
                    {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingBudget ? 'Edit Budget' : 'New Category Budget'}
        subtitle="Set a monthly spending limit for a category"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={formData.category}
              disabled={!!editingBudget}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value as Category }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Monthly Limit (₹)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              placeholder="e.g. 3000"
              value={formData.limit}
              onChange={e => setFormData(p => ({ ...p, limit: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors"
            >
              {editingBudget ? 'Save Changes' : 'Set Budget'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;

