import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { Group, GroupMember } from '../types/finance';
import Modal from '../components/common/Modal';
import { Plus, Users, Pencil, Trash2, ChevronRight, UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const GROUP_EMOJIS = ['☕','🏠','🌴','🚗','🍕','🎮','✈️','🎓','🏋️','🎵','🎬','🍺'];

const Groups: React.FC = () => {
  const { groups, groupExpenses, members, addGroup, updateGroup, deleteGroup, user, recordSettlement, settlements } = useFinance();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewingGroupId, setViewingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupEmoji, setGroupEmoji] = useState('☕');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([user.id]);

  const getMemberName = (id: string) => {
    if (id === user.id) return 'You';
    return members.find(m => m.id === id)?.name || id;
  };

  const openCreate = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupDesc('');
    setGroupEmoji('☕');
    setSelectedMemberIds([user.id]);
    setShowForm(true);
  };

  const openEdit = (g: Group) => {
    setEditingGroup(g);
    setGroupName(g.name);
    setGroupDesc(g.description);
    setGroupEmoji(g.emoji);
    setSelectedMemberIds(g.members.map(m => m.id));
    setShowForm(true);
  };

  const handleSave = () => {
    if (!groupName.trim()) { showToast('Enter a group name', 'error'); return; }
    const groupMembers: GroupMember[] = selectedMemberIds.map(id => {
      const m = members.find(mem => mem.id === id);
      return m || { id, name: id, avatar: '' };
    });

    if (editingGroup) {
      updateGroup(editingGroup.id, { name: groupName, description: groupDesc, emoji: groupEmoji, members: groupMembers });
      showToast('Group updated');
    } else {
      addGroup({ name: groupName, description: groupDesc, emoji: groupEmoji, members: groupMembers });
      showToast('Group created!');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    deleteGroup(id);
    showToast(`"${name}" group deleted`, 'info');
    if (viewingGroupId === id) setViewingGroupId(null);
  };

  // Group stats
  const getGroupStats = (groupId: string) => {
    const exps = groupExpenses.filter(e => e.groupId === groupId);
    const totalShared = exps.reduce((s, e) => s + e.totalAmount, 0);
    const unsettledCount = exps.reduce(
      (s, e) => s + e.participants.filter(p => !p.isPaid && p.userId !== e.paidBy).length,
      0
    );
    return { totalShared, unsettledCount };
  };

  // Group balance per user pair in a group
  const getGroupBalances = (groupId: string) => {
    const exps = groupExpenses.filter(e => e.groupId === groupId);
    const balances: Record<string, Record<string, number>> = {};

    exps.forEach(exp => {
      exp.participants.forEach(p => {
        if (p.userId !== exp.paidBy && !p.isPaid) {
          if (!balances[p.userId]) balances[p.userId] = {};
          balances[p.userId][exp.paidBy] = (balances[p.userId][exp.paidBy] || 0) + p.shareAmount;
        }
      });
    });
    return balances;
  };

  const viewingGroup = viewingGroupId ? groups.find(g => g.id === viewingGroupId) : null;
  const viewingExps = viewingGroupId ? groupExpenses.filter(e => e.groupId === viewingGroupId) : [];

  const inputClass = 'w-full bg-[#253129] border border-[#303B33] rounded-xl px-3 py-2.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/60 transition-colors';
  const labelClass = 'text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-1 block';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Your Groups</h1>
          <p className="text-[#A6B2A8] text-sm mt-1">Track shared expenses, settle up, and stay even.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors shrink-0"
        >
          <Plus size={14} /> New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={36} className="text-[#A6B2A8] mb-3" />
          <p className="text-base font-semibold text-[#F7F5EF] mb-1">No groups yet</p>
          <p className="text-sm text-[#A6B2A8] mb-4">Create a group to start splitting shared expenses</p>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold">
            Create Group
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => {
            const stats = getGroupStats(group.id);
            return (
              <div
                key={group.id}
                className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4 hover:border-[#38C98A]/25 transition-colors cursor-pointer group"
                onClick={() => setViewingGroupId(group.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#253129] border border-[#303B33] flex items-center justify-center text-xl">
                      {group.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F7F5EF]">{group.name}</p>
                      <p className="text-xs text-[#A6B2A8] mt-0.5">{group.members.length} members · {group.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums text-[#F7F5EF] font-heading">{formatCurrency(stats.totalShared)}</p>
                      {stats.unsettledCount > 0 && (
                        <p className="text-xs text-[#F3D66B]">{stats.unsettledCount} unsettled</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(group); }}
                        className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#38C98A] hover:bg-[#38C98A]/10 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(group.id, group.name); }}
                        className="p-1.5 rounded-lg text-[#A6B2A8] hover:text-[#F17E69] hover:bg-[#F17E69]/10 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <ChevronRight size={14} className="text-[#A6B2A8]" />
                  </div>
                </div>
                {/* Member Avatars */}
                <div className="flex items-center gap-1 mt-3">
                  {group.members.slice(0, 5).map((m, i) => (
                    <div
                      key={m.id}
                      className="w-6 h-6 rounded-full overflow-hidden border border-[#1C251F] bg-[#253129]"
                      style={{ marginLeft: i > 0 ? '-6px' : 0 }}
                      title={getMemberName(m.id)}
                    >
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <span className="text-[10px] text-[#A6B2A8] ml-2">+{group.members.length - 5} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Group Detail Modal */}
      {viewingGroup && (
        <Modal
          isOpen={!!viewingGroup}
          onClose={() => setViewingGroupId(null)}
          title={`${viewingGroup.emoji} ${viewingGroup.name}`}
          subtitle={viewingGroup.description}
          size="lg"
        >
          <div className="space-y-4">
            {/* Members */}
            <div>
              <p className="text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-2">Members ({viewingGroup.members.length})</p>
              <div className="flex flex-wrap gap-2">
                {viewingGroup.members.map(m => (
                  <div key={m.id} className="flex items-center gap-2 bg-[#253129] border border-[#303B33] rounded-xl px-3 py-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-[#303B33]">
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-[#F7F5EF]">{getMemberName(m.id)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Balances */}
            {(() => {
              const balances = getGroupBalances(viewingGroup.id);
              const entries = Object.entries(balances).flatMap(([from, toMap]) =>
                Object.entries(toMap).map(([to, amount]) => ({ from, to, amount }))
              );
              if (entries.length === 0) return (
                <div className="bg-[#253129] rounded-xl px-4 py-3 text-center">
                  <p className="text-sm text-[#38C98A] font-medium">✓ All settled up!</p>
                </div>
              );
              return (
                <div>
                  <p className="text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-2">Outstanding Balances</p>
                  <div className="space-y-2">
                    {entries.map((e, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#253129] border border-[#F3D66B]/15 rounded-xl px-4 py-2">
                        <p className="text-xs text-[#F7F5EF]">
                          <span className="text-[#F17E69] font-semibold">{getMemberName(e.from)}</span>
                          {' '}owes{' '}
                          <span className="text-[#38C98A] font-semibold">{getMemberName(e.to)}</span>
                        </p>
                        <span className="text-sm font-bold text-[#F3D66B] tabular-nums">{formatCurrency(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Recent Expenses */}
            <div>
              <p className="text-xs font-semibold text-[#A6B2A8] uppercase tracking-wider mb-2">Shared Expenses ({viewingExps.length})</p>
              {viewingExps.length === 0 ? (
                <p className="text-xs text-[#A6B2A8] text-center py-4">No expenses added yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {viewingExps.map(exp => (
                    <div key={exp.id} className="flex items-center justify-between bg-[#253129] rounded-xl px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-[#F7F5EF]">{exp.title}</p>
                        <p className="text-[10px] text-[#A6B2A8]">Paid by {getMemberName(exp.paidBy)} · {exp.date}</p>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-[#F7F5EF]">{formatCurrency(exp.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Group Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingGroup ? 'Edit Group' : 'Create Group'}
        subtitle="Organise shared expenses together"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Emoji</label>
            <div className="flex flex-wrap gap-2">
              {GROUP_EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setGroupEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg border transition-all ${
                    groupEmoji === e
                      ? 'bg-[#38C98A]/15 border-[#38C98A]/40'
                      : 'bg-[#253129] border-[#303B33] hover:border-[#303B33]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Group Name</label>
            <input className={inputClass} placeholder="e.g. Canteen Crew" value={groupName} onChange={e => setGroupName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <input className={inputClass} placeholder="What is this group for?" value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Members</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map(m => {
                const isSelected = selectedMemberIds.includes(m.id);
                const isMe = m.id === user.id;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 bg-[#253129] rounded-xl px-3 py-2 cursor-pointer hover:bg-[#253129]/80"
                    onClick={() => {
                      if (isMe) return;
                      setSelectedMemberIds(prev =>
                        prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                      );
                    }}
                  >
                    <input type="checkbox" checked={isSelected} readOnly disabled={isMe} className="accent-[#38C98A]" />
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-[#303B33]">
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-[#F7F5EF]">{isMe ? `${m.name} (You)` : m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-[#303B33] text-sm font-semibold text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#38C98A] text-[#111713] text-sm font-bold hover:bg-[#2FB278] transition-colors">
              {editingGroup ? 'Save Changes' : 'Create Group'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;

