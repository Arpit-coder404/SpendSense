import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { SavingsGoal } from '../types/finance';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';
import { Plus, Pencil, Trash2, Target, Plus as PlusIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const GOAL_EMOJIS = ['🏖️','💻','🎧','✈️','🎸','🛡️','🎓','🚗','📷','🎮','🏋️','💊','🎵','🎪'];

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addGoalContribution } = useFinance();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [showContribute, setShowContribute] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [contributeNote, setContributeNote] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    savedAmount: '',
    targetDate: '',
    emoji: '🏖️',
    category: 'Travel',
  });

  const openCreate = () => {
    setEditingGoal(null);
    setFormData({ title: '', targetAmount: '', savedAmount: '0', targetDate: '', emoji: '🏖️', category: 'Travel' });
    setShowForm(true);
  };

  const openEdit = (g: SavingsGoal) => {
    setEditingGoal(g);
    setFormData({
      title: g.title,
      targetAmount: g.targetAmount.toString(),
      savedAmount: g.savedAmount.toString(),
      targetDate: g.targetDate,
      emoji: g.emoji,
      category: g.category,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const target = parseFloat(formData.targetAmount);
    if (!formData.title || !target) { showToast('Fill in all required fields', 'error'); return; }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: formData.title,
        targetAmount: target,
        savedAmount: parseFloat(formData.savedAmount) || editingGoal.savedAmount,
        targetDate: formData.targetDate,
        emoji: formData.emoji,
        category: formData.category,
      });
      showToast('Goal updated');
    } else {
      addGoal({
        title: formData.title,
        targetAmount: target,
        savedAmount: parseFloat(formData.savedAmount) || 0,
        targetDate: formData.targetDate,
        emoji: formData.emoji,
        category: formData.category,
      });
      showToast('Savings goal created! 🎯');
    }
    setShowForm(false);
  };

  const handleContribute = () => {
    const amount = parseFloat(contributeAmount);
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    if (!showContribute) return;

    const targetGoal = goals.find(g => g.id === showContribute);
    if (targetGoal && (targetGoal.savedAmount + amount >= targetGoal.targetAmount)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    addGoalContribution(showContribute, amount, contributeNote || undefined);
    showToast(`Added ${formatCurrency(amount)} to your goal!`);
    setShowContribute(null);
    setContributeAmount('');
    setContributeNote('');
  };

  const handleDelete = (id: string, title: string) => {
    deleteGoal(id);
    showToast(`"${title}" goal removed`, 'info');
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  const GoalCard = ({ goal }: { goal: SavingsGoal }) => {
    const pct = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
    const remaining = goal.targetAmount - goal.savedAmount;
    const daysLeft = goal.targetDate
      ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86400000))
      : null;

    return (
      <div className={`bg-[#1C251F] border rounded-2xl p-5 group transition-all ${goal.isCompleted ? 'border-[#38C98A]/30' : 'border-[#303B33] hover:border-[#38C98A]/20'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${goal.isCompleted ? 'bg-[#38C98A]/15 border border-[#38C98A]/30' : 'bg-[#253129] border border-[#303B33]'}`}>
              {goal.emoji}
            </div>
            <div>
              <p className="text-sm font-bold text-[#F7F5EF]">{goal.title}</p>
              <p className="text-xs text-[#A6B2A8]">{goal.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!goal.isCompleted && (
              <button
                onClick={() => { setShowContribute(goal.id); setContributeAmount(''); setContributeNote(''); }}
                className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#38C98A] hover:bg-[#38C98A]/10 transition-colors"
                title="Add contribution"
              >
                <PlusIcon size={12} />
              </button>
            )}
            <button
              onClick={() => openEdit(goal)}
              className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#38C98A] hover:bg-[#38C98A]/10 transition-colors"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => handleDelete(goal.id, goal.title)}
              className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#F17E69] hover:bg-[#F17E69]/10 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs text-[#A6B2A8]">Saved</p>
            <p className="text-xl font-bold font-heading text-[#38C98A] tabular-nums">{formatCurrency(goal.savedAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#A6B2A8]">Target</p>
            <p className="text-base font-bold font-heading text-[#F7F5EF] tabular-nums">{formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>

        <ProgressBar percentage={pct} height={7} />

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#A6B2A8]">{pct.toFixed(0)}% complete</span>
          {goal.isCompleted ? (
            <span className="text-xs text-[#38C98A] font-bold">🎉 Goal reached!</span>
          ) : (
            <div className="flex items-center gap-2">
              {remaining > 0 && (
                <span className="text-xs text-[#A6B2A8]">{formatCurrency(remaining)} to go</span>
              )}
              {daysLeft !== null && (
                <span className={`text-xs font-medium ${daysLeft < 14 ? 'text-[#F17E69]' : 'text-[#A6B2A8]'}`}>
                  · {daysLeft}d left
                </span>
              )}
            </div>
          )}
        </div>

        {/* Contributions mini-history */}
        {goal.contributions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#303B33]">
            <p className="text-[10px] text-[#A6B2A8] mb-1.5">Recent contributions</p>
            <div className="space-y-1">
              {goal.contributions.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-[10px] text-[#A6B2A8]">{c.note || 'Contribution'} · {c.date}</span>
                  <span className="text-[10px] font-semibold text-[#38C98A] tabular-nums">+{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Small Goals. Big Freedom.</h1>
          <p className="text-[#A6B2A8] text-sm mt-1">Save for the things that actually matter.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors shrink-0"
        >
          <Plus size={14} /> New Goal
        </button>
      </div>

      {/* Total saved */}
      {goals.length > 0 && (
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl px-5 py-4 mb-6 flex items-center gap-6">
          <div>
            <p className="text-xs text-[#A6B2A8]">Total Saved Across Goals</p>
            <p className="text-2xl font-bold font-heading text-[#38C98A] tabular-nums">
              {formatCurrency(goals.reduce((s, g) => s + g.savedAmount, 0))}
            </p>
          </div>
          <div className="w-px h-10 bg-[#303B33]" />
          <div>
            <p className="text-xs text-[#A6B2A8]">Active Goals</p>
            <p className="text-2xl font-bold font-heading text-[#F7F5EF]">{activeGoals.length}</p>
          </div>
          <div className="w-px h-10 bg-[#303B33]" />
          <div>
            <p className="text-xs text-[#A6B2A8]">Completed</p>
            <p className="text-2xl font-bold font-heading text-[#F3D66B]">{completedGoals.length}</p>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Target size={36} className="text-[#A6B2A8] mb-3" />
          <p className="text-base font-semibold text-[#F7F5EF] mb-1">No savings goals yet</p>
          <p className="text-sm text-[#A6B2A8] mb-4">Create your first goal and start saving</p>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold">
            Create Goal
          </button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <>
              <h2 className="text-xs font-bold font-heading text-[#A6B2A8] uppercase tracking-wider mb-3">Active Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </>
          )}
          {completedGoals.length > 0 && (
            <>
              <h2 className="text-xs font-bold font-heading text-[#A6B2A8] uppercase tracking-wider mb-3">Completed 🎉</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingGoal ? 'Edit Goal' : 'New Savings Goal'}
        subtitle="Set a target and track your progress"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Choose Emoji</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, emoji: e }))}
                  className={`w-9 h-9 rounded-xl text-lg border transition-all ${formData.emoji === e ? 'bg-[#38C98A]/15 border-[#38C98A]/40' : 'bg-[#253129] border-[#303B33]'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Goal Title</label>
            <input className={inputClass} placeholder="e.g. Goa Trip" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Target Amount (₹)</label>
              <input type="number" className={inputClass} placeholder="e.g. 12000" value={formData.targetAmount} onChange={e => setFormData(p => ({ ...p, targetAmount: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Already Saved (₹)</label>
              <input type="number" className={inputClass} placeholder="0" value={formData.savedAmount} onChange={e => setFormData(p => ({ ...p, savedAmount: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Target Date</label>
              <input type="date" className={inputClass} value={formData.targetDate} onChange={e => setFormData(p => ({ ...p, targetDate: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} placeholder="e.g. Travel" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors">{editingGoal ? 'Save Changes' : 'Create Goal'}</button>
          </div>
        </div>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        isOpen={!!showContribute}
        onClose={() => setShowContribute(null)}
        title="Add Contribution"
        subtitle="Add money to your savings goal"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input type="number" className={inputClass} placeholder="e.g. 500" value={contributeAmount} onChange={e => setContributeAmount(e.target.value)} autoFocus />
          </div>
          <div>
            <label className={labelClass}>Note (optional)</label>
            <input className={inputClass} placeholder="Where did this saving come from?" value={contributeNote} onChange={e => setContributeNote(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowContribute(null)} className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors">Cancel</button>
            <button onClick={handleContribute} className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors">Add Savings</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Goals;

