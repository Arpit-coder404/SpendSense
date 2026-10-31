import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_META } from '../utils/formatters';
import {
  TrendingUp, TrendingDown, Wallet, Users, Plus, ScissorsLineDashed, Camera, PieChart,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend,
} from 'recharts';
import { parseISO, format, eachDayOfInterval, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionForm from '../components/transactions/TransactionForm';
import { Transaction, Category } from '../types/finance';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const CHART_COLORS = Object.entries(CATEGORY_META).map(([, meta]) => meta.color);
const CATEGORIES: Category[] = ['Food','Transport','Shopping','Entertainment','Subscriptions','Utilities','Academics','Health','Other'];

const Dashboard: React.FC = () => {
  const {
    user,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalSpentThisMonth,
    totalIncomeThisMonth,
    dailyAverageThisMonth,
    remainingBudgetThisMonth,
    categorySpendingThisMonth,
    netGroupBalance,
    selectedMonth,
    selectedYear,
    groups,
  } = useFinance();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>(undefined);
  const [chartRange, setChartRange] = useState<'week' | 'month'>('month');

  // Spending area chart data
  const spendingChartData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTotal = transactions
        .filter(t => t.type === 'expense' && t.date === dayStr)
        .reduce((s, t) => s + t.amount, 0);
      return { day: format(day, 'd'), amount: dayTotal };
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Category pie data
  const pieData = useMemo(() => {
    return CATEGORIES
      .map(cat => ({
        name: cat,
        value: categorySpendingThisMonth[cat] || 0,
        color: CATEGORY_META[cat].color,
      }))
      .filter(d => d.value > 0);
  }, [categorySpendingThisMonth]);

  // Recent transactions (top 6)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [transactions]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    showToast('Transaction deleted', 'info');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const budgetPct = user.monthlyBudget > 0
    ? Math.min(100, (totalSpentThisMonth / user.monthlyBudget) * 100)
    : 0;

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-[#1C251F] border border-[#303B33] rounded-xl px-3 py-2 shadow-xl">
          <p className="text-xs text-[#A6B2A8]">Day {payload[0].payload.day}</p>
          <p className="text-sm font-bold text-[#38C98A] font-heading">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F7F5EF]">
          {greeting}, <span className="text-[#38C98A]">{user.name.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-[#A6B2A8] text-sm mt-1">
          Let's make today count — and stay on budget.
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Total Spent',
            value: formatCurrency(totalSpentThisMonth),
            sub: 'This month',
            color: '#F17E69',
            icon: TrendingDown,
          },
          {
            label: 'Daily Average',
            value: formatCurrency(dailyAverageThisMonth),
            sub: 'Per day',
            color: '#F3D66B',
            icon: TrendingUp,
          },
          {
            label: 'Budget Left',
            value: formatCurrency(remainingBudgetThisMonth),
            sub: `${budgetPct.toFixed(0)}% used`,
            color: '#38C98A',
            icon: Wallet,
          },
          {
            label: 'Group Balance',
            value: netGroupBalance.toReceive > 0
              ? `+${formatCurrency(netGroupBalance.toReceive)}`
              : formatCurrency(netGroupBalance.toPay),
            sub: netGroupBalance.toReceive > 0 ? 'To receive' : 'You owe',
            color: '#60A5FA',
            icon: Users,
          },
        ].map(card => (
          <div
            key={card.label}
            className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4 hover:border-[#38C98A]/25 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-[#A6B2A8] font-medium">{card.label}</p>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
              >
                <card.icon size={13} color={card.color} />
              </div>
            </div>
            <p
              className="text-xl font-bold tabular-nums font-heading"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-[11px] text-[#A6B2A8] mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Spending Trend */}
        <div className="lg:col-span-2 bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold font-heading text-[#F7F5EF]">Spending Trend</h2>
              <p className="text-xs text-[#A6B2A8]">Daily spending this month</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38C98A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38C98A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#A6B2A8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#38C98A"
                  strokeWidth={2}
                  fill="url(#spendGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#38C98A', stroke: '#111713', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">By Category</h2>
          <p className="text-xs text-[#A6B2A8] mb-3">Where your money goes</p>
          {pieData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), '']}
                    contentStyle={{
                      background: '#1C251F',
                      border: '1px solid #303B33',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F7F5EF',
                    }}
                  />
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', color: '#A6B2A8' }}
                    formatter={(value) => value}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center">
              <p className="text-xs text-[#A6B2A8]">No expenses this month yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-[#1C251F] border border-[#303B33] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#303B33]">
            <div>
              <h2 className="text-sm font-bold font-heading text-[#F7F5EF]">Recent Transactions</h2>
              <p className="text-xs text-[#A6B2A8]">Latest activity</p>
            </div>
            <button
              onClick={() => navigate('/app/transactions')}
              className="text-xs text-[#38C98A] hover:underline flex items-center gap-1"
            >
              See all <ArrowRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-[#303B33]/40">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-[#A6B2A8] text-center py-10">No transactions yet. Add one!</p>
            ) : (
              recentTransactions.map(tx => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  compact
                  onEdit={t => setEditingTx(t)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
            <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: Plus,
                  label: 'Add Expense',
                  color: '#38C98A',
                  action: () => setShowAddForm(true),
                },
                {
                  icon: ScissorsLineDashed,
                  label: 'Split Bill',
                  color: '#F3D66B',
                  action: () => navigate('/app/split-bills'),
                },
                {
                  icon: Camera,
                  label: 'Scan Receipt',
                  color: '#A78BFA',
                  action: () => navigate('/app/transactions?tab=scan'),
                },
                {
                  icon: PieChart,
                  label: 'Set Budget',
                  color: '#60A5FA',
                  action: () => navigate('/app/budgets'),
                },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#253129] border border-[#303B33] hover:border-opacity-60 transition-all group"
                  style={{ '--hover-color': action.color } as React.CSSProperties}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: `${action.color}15`,
                      border: `1px solid ${action.color}30`,
                    }}
                  >
                    <action.icon size={16} color={action.color} />
                  </div>
                  <span className="text-xs font-medium text-[#A6B2A8] group-hover:text-[#F7F5EF] transition-colors text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Quick View */}
          <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold font-heading text-[#F7F5EF]">Monthly Budget</h2>
              <span className="text-xs text-[#A6B2A8]">{budgetPct.toFixed(0)}% used</span>
            </div>
            <div className="h-2 bg-[#303B33] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${budgetPct}%`,
                  background: budgetPct >= 100 ? '#F17E69' : budgetPct >= 85 ? '#F3D66B' : '#38C98A',
                  boxShadow: budgetPct < 100 ? '0 0 8px rgba(56,201,138,0.4)' : 'none',
                }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#A6B2A8]">Spent: {formatCurrency(totalSpentThisMonth)}</span>
              <span className="text-xs text-[#38C98A] font-semibold">
                Left: {formatCurrency(remainingBudgetThisMonth)}
              </span>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;

