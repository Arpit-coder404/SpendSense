import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatFriendlyDate, CATEGORY_META } from '../utils/formatters';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionForm from '../components/transactions/TransactionForm';
import { Transaction, Category } from '../types/finance';
import { Plus, Search, Filter, Camera, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { useSearchParams } from 'react-router-dom';
import ReceiptScanner from '../components/receipt-scanner/ReceiptScanner';

const CATEGORIES: Category[] = ['Food','Transport','Shopping','Entertainment','Subscriptions','Utilities','Academics','Health','Other'];

const Transactions: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>(undefined);
  const [showScanner, setShowScanner] = useState(searchParams.get('tab') === 'scan');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.merchant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.note || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, searchQuery, filterType, filterCategory]);

  // Group by date label
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(tx => {
      const label = formatFriendlyDate(tx.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    showToast('Transaction deleted', 'info');
  };

  const totalFiltered = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Your Money, Your Story.</h1>
        <p className="text-[#A6B2A8] text-sm mt-1">Every little expense adds up. Understand where it goes.</p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-[#1C251F] border border-[#303B33] rounded-xl px-3 py-2.5">
          <Search size={14} className="text-[#A6B2A8] shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#A6B2A8] hover:text-[#F7F5EF]">
              <X size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilters || filterType !== 'all' || filterCategory !== 'all'
              ? 'bg-[#38C98A]/15 border-[#38C98A]/40 text-[#38C98A]'
              : 'bg-[#1C251F] border-[#303B33] text-[#A6B2A8] hover:text-[#F7F5EF]'
          }`}
        >
          <Filter size={14} />
          Filters
        </button>

        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/10 text-[#A78BFA] text-sm font-medium hover:bg-[#A78BFA]/15 transition-colors"
        >
          <Camera size={14} />
          Snap Receipt
        </button>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-2">Type</p>
              <div className="flex gap-2">
                {(['all', 'expense', 'income'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === type
                        ? 'bg-[#38C98A]/15 text-[#38C98A] border border-[#38C98A]/30'
                        : 'bg-[#253129] text-[#A6B2A8] border border-[#303B33] hover:text-[#F7F5EF]'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === 'all'
                      ? 'bg-[#38C98A]/15 text-[#38C98A] border border-[#38C98A]/30'
                      : 'bg-[#253129] text-[#A6B2A8] border border-[#303B33] hover:text-[#F7F5EF]'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterCategory === cat
                        ? 'border text-xs font-semibold'
                        : 'bg-[#253129] text-[#A6B2A8] border border-[#303B33] hover:text-[#F7F5EF]'
                    }`}
                    style={filterCategory === cat ? {
                      background: `${CATEGORY_META[cat].bgColor}`,
                      color: CATEGORY_META[cat].color,
                      borderColor: CATEGORY_META[cat].borderDark,
                    } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary bar */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 mb-3 bg-[#1C251F] border border-[#303B33] rounded-xl">
          <span className="text-xs text-[#A6B2A8]">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-bold text-[#F17E69] font-heading tabular-nums">
            {formatCurrency(totalFiltered)} spent
          </span>
        </div>
      )}

      {/* Grouped Transactions */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-[#253129] border border-[#303B33] flex items-center justify-center mb-4">
            <Search size={22} className="text-[#A6B2A8]" />
          </div>
          <h3 className="text-base font-semibold text-[#F7F5EF] mb-1">No transactions found</h3>
          <p className="text-sm text-[#A6B2A8]">Try adjusting your search or filters</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold font-heading text-[#A6B2A8] uppercase tracking-wider">{date}</span>
              <div className="flex-1 h-px bg-[#303B33]" />
              <span className="text-xs text-[#A6B2A8] tabular-nums">
                {formatCurrency(txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
              </span>
            </div>
            <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl overflow-hidden divide-y divide-[#303B33]/50">
              {txs.map(tx => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={t => setEditingTx(t)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modals */}
      <TransactionForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={(data) => addTransaction(data)}
        mode="add"
      />
      <TransactionForm
        isOpen={!!editingTx}
        onClose={() => setEditingTx(undefined)}
        onSave={(data) => { if (editingTx) updateTransaction(editingTx.id, data); }}
        initialData={editingTx}
        mode="edit"
      />
      {showScanner && (
        <ReceiptScanner
          onClose={() => setShowScanner(false)}
          onAddTransaction={(data) => {
            addTransaction(data);
            setShowScanner(false);
            showToast('Receipt scanned and transaction added!');
          }}
        />
      )}
    </div>
  );
};

export default Transactions;

