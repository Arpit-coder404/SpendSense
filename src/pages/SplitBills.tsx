import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_META } from '../utils/formatters';
import { Group, GroupExpense, SplitMethod, Category, ParticipantShare } from '../types/finance';
import Modal from '../components/common/Modal';
import { Plus, ScissorsLineDashed, Check, X, ChevronRight, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SplitBills: React.FC = () => {
  const { groups, groupExpenses, members, addGroupExpense, updateGroupExpense, recordSettlement, user, deleteGroupExpense } = useFinance();
  const { showToast } = useToast();

  const [showSplitForm, setShowSplitForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [viewingExpenseId, setViewingExpenseId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [note, setNote] = useState('');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([user.id]);
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [paidBy, setPaidBy] = useState<string>(user.id);

  const activeGroup = groups.find(g => g.id === selectedGroupId);

  const openSplitForm = () => {
    const firstGroup = groups[0];
    if (!firstGroup) { showToast('Create a group first', 'error'); return; }
    setSelectedGroupId(firstGroup.id);
    setSelectedParticipantIds(firstGroup.members.map(m => m.id));
    setPaidBy(user.id);
    setTitle('');
    setTotalAmount('');
    setSplitMethod('equal');
    setNote('');
    setCustomShares({});
    setShowSplitForm(true);
  };

  // Calculate participants shares
  const computedShares = useMemo<ParticipantShare[]>(() => {
    if (!selectedParticipantIds.length || !totalAmount) return [];
    const total = parseFloat(totalAmount) || 0;

    if (splitMethod === 'equal') {
      const share = total / selectedParticipantIds.length;
      return selectedParticipantIds.map(id => ({
        userId: id,
        shareAmount: Math.round(share * 100) / 100,
        isPaid: id === paidBy,
      }));
    }

    if (splitMethod === 'percentage') {
      return selectedParticipantIds.map(id => {
        const pct = parseFloat(customShares[id] || '0');
        return {
          userId: id,
          shareAmount: Math.round((total * pct / 100) * 100) / 100,
          percentage: pct,
          isPaid: id === paidBy,
        };
      });
    }

    // custom
    return selectedParticipantIds.map(id => ({
      userId: id,
      shareAmount: parseFloat(customShares[id] || '0') || 0,
      isPaid: id === paidBy,
    }));
  }, [selectedParticipantIds, totalAmount, splitMethod, customShares, paidBy]);

  const sharesTotal = computedShares.reduce((s, p) => s + p.shareAmount, 0);
  const isValid = title && totalAmount && Math.abs(sharesTotal - parseFloat(totalAmount || '0')) < 0.5;

  const handleCreateSplit = () => {
    if (!isValid || !selectedGroupId) return;
    addGroupExpense({
      groupId: selectedGroupId,
      title,
      totalAmount: parseFloat(totalAmount),
      paidBy,
      participants: computedShares,
      splitMethod,
      date,
      note: note || undefined,
    });
    showToast('Bill split created!');
    setShowSplitForm(false);
  };

  const getMemberName = (id: string) => {
    if (id === user.id) return 'You';
    return members.find(m => m.id === id)?.name || id;
  };
  const getMemberAvatar = (id: string) => {
    return members.find(m => m.id === id)?.avatar;
  };

  // Group by group
  const expensesByGroup = useMemo(() => {
    const byGroup: Record<string, GroupExpense[]> = {};
    groupExpenses.forEach(exp => {
      if (!byGroup[exp.groupId]) byGroup[exp.groupId] = [];
      byGroup[exp.groupId].push(exp);
    });
    return byGroup;
  }, [groupExpenses]);

  const viewingExpense = viewingExpenseId ? groupExpenses.find(e => e.id === viewingExpenseId) : null;

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Split Bills. Split Stress.</h1>
          <p className="text-[#A6B2A8] text-sm mt-1">Good memories shouldn't come with awkward calculations.</p>
        </div>
        <button
          onClick={openSplitForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors shrink-0"
        >
          <Plus size={14} /> New Split
        </button>
      </div>

      {/* Balance Summary */}
      {(() => {
        const { toReceive, toPay } = { toReceive: 0, toPay: 0 };
        let receive = 0, pay = 0;
        groupExpenses.forEach(exp => {
          if (exp.paidBy === user.id) {
            exp.participants.forEach(p => { if (p.userId !== user.id && !p.isPaid) receive += p.shareAmount; });
          } else {
            const my = exp.participants.find(p => p.userId === user.id);
            if (my && !my.isPaid) pay += my.shareAmount;
          }
        });
        return (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1C251F] border border-[#38C98A]/20 rounded-2xl p-4">
              <p className="text-xs text-[#A6B2A8] mb-1">You'll receive</p>
              <p className="text-xl font-bold font-heading text-[#38C98A] tabular-nums">{formatCurrency(receive)}</p>
            </div>
            <div className="bg-[#1C251F] border border-[#F17E69]/20 rounded-2xl p-4">
              <p className="text-xs text-[#A6B2A8] mb-1">You owe</p>
              <p className="text-xl font-bold font-heading text-[#F17E69] tabular-nums">{formatCurrency(pay)}</p>
            </div>
          </div>
        );
      })()}

      {/* Group Expense Lists */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ScissorsLineDashed size={36} className="text-[#A6B2A8] mb-3" />
          <p className="text-base font-semibold text-[#F7F5EF] mb-1">No splits yet</p>
          <p className="text-sm text-[#A6B2A8]">Create a group then split a bill</p>
        </div>
      ) : (
        groups.map(group => {
          const exps = expensesByGroup[group.id] || [];
          if (!exps.length) return null;
          return (
            <div key={group.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{group.emoji}</span>
                <span className="text-sm font-bold font-heading text-[#F7F5EF]">{group.name}</span>
                <span className="text-xs text-[#A6B2A8]">· {exps.length} split{exps.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">
                {exps.map(exp => {
                  const myShare = exp.participants.find(p => p.userId === user.id);
                  const unsettled = exp.participants.filter(p => !p.isPaid && p.userId !== exp.paidBy);
                  return (
                    <div
                      key={exp.id}
                      className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4 cursor-pointer hover:border-[#38C98A]/25 transition-colors"
                      onClick={() => setViewingExpenseId(exp.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#F7F5EF]">{exp.title}</p>
                          <p className="text-xs text-[#A6B2A8] mt-0.5">
                            Paid by {getMemberName(exp.paidBy)} · {exp.splitMethod} split · {exp.date}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-base font-bold font-heading text-[#F7F5EF] tabular-nums">{formatCurrency(exp.totalAmount)}</p>
                          {myShare && (
                            <p className={`text-xs font-medium ${myShare.isPaid ? 'text-[#38C98A]' : 'text-[#F3D66B]'}`}>
                              Your share: {formatCurrency(myShare.shareAmount)} {myShare.isPaid ? '✓' : '⏳'}
                            </p>
                          )}
                        </div>
                      </div>
                      {unsettled.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {unsettled.map(p => (
                            <span key={p.userId} className="text-[10px] bg-[#F3D66B]/10 border border-[#F3D66B]/20 text-[#F3D66B] px-2 py-0.5 rounded-full">
                              {getMemberName(p.userId)}: {formatCurrency(p.shareAmount)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Expense Detail Modal */}
      {viewingExpense && (
        <Modal
          isOpen={!!viewingExpense}
          onClose={() => setViewingExpenseId(null)}
          title={viewingExpense.title}
          subtitle={`Total: ${formatCurrency(viewingExpense.totalAmount)} · ${viewingExpense.splitMethod} split`}
          size="md"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {viewingExpense.participants.map(p => (
                <div key={p.userId} className="flex items-center justify-between bg-[#253129] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#303B33] shrink-0">
                      {getMemberAvatar(p.userId) && (
                        <img src={getMemberAvatar(p.userId)} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F7F5EF]">{getMemberName(p.userId)}</p>
                      {p.percentage && <p className="text-xs text-[#A6B2A8]">{p.percentage}%</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums text-[#F7F5EF]">{formatCurrency(p.shareAmount)}</span>
                    {p.isPaid ? (
                      <span className="flex items-center gap-1 text-xs text-[#38C98A] font-semibold bg-[#38C98A]/10 border border-[#38C98A]/20 px-2 py-0.5 rounded-full">
                        <Check size={10} /> Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          // Mark as paid — record settlement
                          if (p.userId !== viewingExpense.paidBy) {
                            recordSettlement({
                              groupId: viewingExpense.groupId,
                              expenseId: viewingExpense.id,
                              fromUserId: p.userId,
                              toUserId: viewingExpense.paidBy,
                              amount: p.shareAmount,
                              status: 'completed',
                              date: new Date().toISOString().split('T')[0],
                            });
                            showToast(`Marked ${getMemberName(p.userId)}'s share as settled`);
                          }
                        }}
                        className="text-xs text-[#F3D66B] border border-[#F3D66B]/30 bg-[#F3D66B]/10 px-2 py-0.5 rounded-full hover:bg-[#F3D66B]/20 transition-colors font-semibold"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {viewingExpense.note && (
              <div className="bg-[#253129] border border-[#303B33] rounded-xl px-4 py-2">
                <p className="text-xs text-[#A6B2A8]">📝 {viewingExpense.note}</p>
              </div>
            )}
            <button
              onClick={() => {
                deleteGroupExpense(viewingExpense.id);
                setViewingExpenseId(null);
                showToast('Split deleted', 'info');
              }}
              className="w-full py-2.5 rounded-xl border border-[#F17E69]/30 text-[#F17E69] text-sm font-semibold hover:bg-[#F17E69]/10 transition-colors"
            >
              Delete this split
            </button>
          </div>
        </Modal>
      )}

      {/* Create Split Modal */}
      <Modal
        isOpen={showSplitForm}
        onClose={() => setShowSplitForm(false)}
        title="Split a Bill"
        subtitle="Divide expenses fairly among your group"
        size="lg"
      >
        <div className="space-y-4">
          {/* Group */}
          <div>
            <label className={labelClass}>Group</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={selectedGroupId}
              onChange={e => {
                setSelectedGroupId(e.target.value);
                const g = groups.find(gr => gr.id === e.target.value);
                if (g) setSelectedParticipantIds(g.members.map(m => m.id));
              }}
            >
              {groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
            </select>
          </div>

          {/* Title + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Bill Title</label>
              <input className={inputClass} placeholder="e.g. Pizza Night" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Total Amount (₹)</label>
              <input type="number" className={inputClass} placeholder="0" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
            </div>
          </div>

          {/* Split Method */}
          <div>
            <label className={labelClass}>Split Method</label>
            <div className="flex gap-2">
              {(['equal', 'custom', 'percentage'] as SplitMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSplitMethod(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    splitMethod === m
                      ? 'bg-[#38C98A]/15 text-[#38C98A] border-[#38C98A]/30'
                      : 'bg-[#253129] text-[#A6B2A8] border-[#303B33] hover:text-[#F7F5EF]'
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Paid By */}
          {activeGroup && (
            <div>
              <label className={labelClass}>Paid By</label>
              <div className="flex flex-wrap gap-2">
                {activeGroup.members.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaidBy(m.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      paidBy === m.id
                        ? 'bg-[#38C98A]/15 text-[#38C98A] border-[#38C98A]/30'
                        : 'bg-[#253129] text-[#A6B2A8] border-[#303B33] hover:text-[#F7F5EF]'
                    }`}
                  >
                    {m.id === user.id ? 'You' : m.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          {activeGroup && (
            <div>
              <label className={labelClass}>Participants</label>
              <div className="space-y-2">
                {activeGroup.members.map(m => {
                  const isSelected = selectedParticipantIds.includes(m.id);
                  return (
                    <div key={m.id} className="flex items-center gap-3 bg-[#253129] rounded-xl px-3 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedParticipantIds(prev =>
                            prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                          );
                        }}
                        className="accent-[#38C98A]"
                      />
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#303B33] shrink-0">
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-sm text-[#F7F5EF]">{m.id === user.id ? 'You' : m.name}</span>
                      {isSelected && (splitMethod === 'custom' || splitMethod === 'percentage') && (
                        <input
                          type="number"
                          className="w-20 bg-[#1C251F] border border-[#303B33] rounded-lg px-2 py-1 text-xs text-[#F7F5EF] text-right focus:outline-none focus:border-[#38C98A]/50"
                          placeholder={splitMethod === 'percentage' ? '%' : '₹'}
                          value={customShares[m.id] || ''}
                          onChange={e => setCustomShares(prev => ({ ...prev, [m.id]: e.target.value }))}
                        />
                      )}
                      {isSelected && splitMethod === 'equal' && totalAmount && (
                        <span className="text-xs text-[#38C98A] font-semibold tabular-nums">
                          {formatCurrency(parseFloat(totalAmount) / selectedParticipantIds.length)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {(splitMethod === 'custom' || splitMethod === 'percentage') && totalAmount && (
                <p className={`text-xs mt-2 ${Math.abs(sharesTotal - parseFloat(totalAmount)) < 0.5 ? 'text-[#38C98A]' : 'text-[#F17E69]'}`}>
                  {splitMethod === 'custom'
                    ? `Allocated: ${formatCurrency(sharesTotal)} / ${formatCurrency(parseFloat(totalAmount))}`
                    : `Total: ${computedShares.reduce((s, p) => s + (p.percentage || 0), 0).toFixed(0)}%`}
                </p>
              )}
            </div>
          )}

          {/* Date + Note */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Note (optional)</label>
              <input className={inputClass} placeholder="What was this for?" value={note} onChange={e => setNote(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowSplitForm(false)} className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors">
              Cancel
            </button>
            <button
              onClick={handleCreateSplit}
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Split
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SplitBills;

