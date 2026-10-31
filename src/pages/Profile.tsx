import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import { Trash2, RefreshCw, Bell, Shield, User, Palette, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser, resetToDemoData } = useFinance();
  const { showToast } = useToast();

  const [showResetModal, setShowResetModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editBudget, setEditBudget] = useState(user.monthlyBudget.toString());
  const [editCampus, setEditCampus] = useState(user.campus);
  const [editYear, setEditYear] = useState(user.collegeYear);

  const handleSaveProfile = () => {
    const budget = parseFloat(editBudget);
    if (!editName.trim()) { showToast('Name cannot be empty', 'error'); return; }
    if (!budget || budget <= 0) { showToast('Enter a valid monthly budget', 'error'); return; }
    updateUser({ name: editName, email: editEmail, monthlyBudget: budget, campus: editCampus, collegeYear: editYear });
    showToast('Profile saved successfully');
  };

  const handleReset = () => {
    resetToDemoData();
    setShowResetModal(false);
    showToast('Demo data restored', 'info');
  };

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Profile & Settings</h1>
        <p className="text-[#A6B2A8] text-sm mt-1">Manage your account preferences.</p>
      </div>

      {/* Avatar + Name */}
      <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#38C98A]/30 shrink-0">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#F7F5EF]">{user.name}</h2>
          <p className="text-sm text-[#A6B2A8]">{user.collegeYear}</p>
          <p className="text-xs text-[#A6B2A8] mt-0.5">{user.campus}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={14} className="text-[#38C98A]" />
          <h3 className="text-sm font-bold text-[#F7F5EF]">Personal Details</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Display Name</label>
            <input className={inputClass} value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={editEmail} onChange={e => setEditEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Campus / College</label>
            <input className={inputClass} value={editCampus} onChange={e => setEditCampus(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>College Year / Programme</label>
            <input className={inputClass} value={editYear} onChange={e => setEditYear(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={14} className="text-[#38C98A]" />
          <h3 className="text-sm font-bold text-[#F7F5EF]">Preferences</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Monthly Budget (₹)</label>
            <input type="number" className={inputClass} value={editBudget} onChange={e => setEditBudget(e.target.value)} placeholder="e.g. 15000" />
            <p className="text-xs text-[#A6B2A8] mt-1">This is your total monthly spending limit for the budget progress bar.</p>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <div className="flex items-center gap-3 bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5">
              <span className="text-lg">🇮🇳</span>
              <span className="text-sm text-[#F7F5EF]">Indian Rupee (₹ INR)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSaveProfile}
        className="w-full py-3 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors mb-4"
      >
        Save Profile
      </button>

      {/* Privacy */}
      <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-[#38C98A]" />
          <h3 className="text-sm font-bold text-[#F7F5EF]">Privacy & Data</h3>
        </div>
        <div className="space-y-3 text-xs text-[#A6B2A8] leading-relaxed">
          <p>🔒 All your data is stored <strong className="text-[#F7F5EF]">locally in your browser</strong> using LocalStorage. Nothing is uploaded to any server.</p>
          <p>📊 Campus Insights use simulated, anonymised aggregate data — no individual spending is ever displayed.</p>
          <p>📷 Receipt images are processed entirely in your browser. They are not uploaded to any external service.</p>
          <p>🧹 Clearing browser data or using the reset button below will delete all your SpendSense data.</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1C251F] border border-[#F17E69]/20 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-[#F17E69] mb-3">⚠ Danger Zone</h3>
        <p className="text-xs text-[#A6B2A8] mb-4">
          Resetting demo data will replace all current transactions, budgets, groups, and goals with the original demo dataset. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F17E69]/30 text-[#F17E69] text-sm font-semibold hover:bg-[#F17E69]/10 transition-colors"
        >
          <RefreshCw size={13} /> Reset to Demo Data
        </button>
      </div>

      {/* Reset Confirm Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset to Demo Data?"
        subtitle="This will overwrite all your current data."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#A6B2A8] leading-relaxed">
            All transactions, budgets, groups, goals and notifications will be replaced with the original demo dataset. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-[#F17E69] text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Yes, Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

