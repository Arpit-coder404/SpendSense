import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_META } from '../utils/formatters';
import { Category } from '../types/finance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend, CartesianGrid,
} from 'recharts';
import { format, parseISO, eachMonthOfInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const CATEGORIES: Category[] = ['Food','Transport','Shopping','Entertainment','Subscriptions','Utilities','Academics','Health','Other'];

const Analytics: React.FC = () => {
  const { transactions, budgets, selectedMonth, selectedYear } = useFinance();
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  const periodMonths = period === '3m' ? 3 : period === '6m' ? 6 : 12;

  // Monthly spend by month (last N months)
  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(selectedYear, selectedMonth), periodMonths - 1),
      end: new Date(selectedYear, selectedMonth),
    });
    return months.map(month => {
      const total = transactions
        .filter(t => {
          const d = parseISO(t.date);
          return t.type === 'expense' && d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
        })
        .reduce((s, t) => s + t.amount, 0);
      const income = transactions
        .filter(t => {
          const d = parseISO(t.date);
          return t.type === 'income' && d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
        })
        .reduce((s, t) => s + t.amount, 0);
      return { month: format(month, 'MMM yy'), spent: total, income };
    });
  }, [transactions, selectedMonth, selectedYear, periodMonths]);

  // Category spending for active month
  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const spent = transactions
        .filter(t => {
          const d = parseISO(t.date);
          return t.type === 'expense' && t.category === cat &&
            d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        })
        .reduce((s, t) => s + t.amount, 0);
      const budget = budgets.find(b => b.category === cat && b.month === selectedMonth && b.year === selectedYear);
      return { category: cat, spent, budget: budget?.limit || 0, color: CATEGORY_META[cat].color };
    }).filter(d => d.spent > 0 || d.budget > 0).sort((a, b) => b.spent - a.spent);
  }, [transactions, budgets, selectedMonth, selectedYear]);

  // Weekday vs weekend
  const dayPatterns = useMemo(() => {
    const counts: Record<string, { total: number; count: number }> = {
      Mon: { total: 0, count: 0 }, Tue: { total: 0, count: 0 }, Wed: { total: 0, count: 0 },
      Thu: { total: 0, count: 0 }, Fri: { total: 0, count: 0 }, Sat: { total: 0, count: 0 }, Sun: { total: 0, count: 0 },
    };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = parseISO(t.date);
      const day = dayNames[d.getDay()];
      counts[day].total += t.amount;
      counts[day].count += 1;
    });
    return Object.entries(counts).map(([day, { total, count }]) => ({
      day,
      avg: count > 0 ? Math.round(total / count) : 0,
      total: Math.round(total),
    }));
  }, [transactions]);

  // Total for active month
  const totalMonth = useMemo(() =>
    transactions.filter(t => {
      const d = parseISO(t.date);
      return t.type === 'expense' && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    }).reduce((s, t) => s + t.amount, 0),
    [transactions, selectedMonth, selectedYear]
  );

  // Insights
  const insights = useMemo(() => {
    const list: string[] = [];
    const sorted = [...categoryData].sort((a, b) => b.spent - a.spent);
    if (sorted[0]?.spent > 0) {
      list.push(`${sorted[0].category} is your highest spending category this month at ${formatCurrency(sorted[0].spent)}.`);
    }
    const weekendDays = dayPatterns.filter(d => d.day === 'Sat' || d.day === 'Sun');
    const weekdayDays = dayPatterns.filter(d => !['Sat', 'Sun'].includes(d.day));
    const weekendAvg = weekendDays.reduce((s, d) => s + d.avg, 0) / 2;
    const weekdayAvg = weekdayDays.reduce((s, d) => s + d.avg, 0) / 5;
    if (weekendAvg > weekdayAvg && weekdayAvg > 0) {
      list.push(`Your weekend spending (avg ${formatCurrency(weekendAvg)}/day) is higher than weekday average (${formatCurrency(weekdayAvg)}/day).`);
    }
    const overBudget = categoryData.filter(c => c.budget > 0 && c.spent > c.budget * 0.85);
    overBudget.forEach(c => {
      list.push(`You are ${c.spent >= c.budget ? 'over' : 'close to'} your ${c.category} budget.`);
    });
    if (monthlyData.length >= 2) {
      const curr = monthlyData[monthlyData.length - 1].spent;
      const prev = monthlyData[monthlyData.length - 2].spent;
      if (prev > 0 && Math.abs(curr - prev) / prev > 0.05) {
        const pct = Math.abs(((curr - prev) / prev) * 100).toFixed(0);
        list.push(`You spent ${pct}% ${curr > prev ? 'more' : 'less'} this month compared to last month.`);
      }
    }
    return list;
  }, [categoryData, dayPatterns, monthlyData]);

  const tooltipStyle = {
    background: '#1C251F',
    border: '1px solid #303B33',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#F7F5EF',
  };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Turn Expenses into Insights.</h1>
        <p className="text-[#A6B2A8] text-sm mt-1">See where your money goes, spot patterns and make smarter decisions.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: `Total — ${MONTHS[selectedMonth]}`, value: formatCurrency(totalMonth), color: '#F17E69' },
          { label: 'Daily Avg', value: formatCurrency(Math.round(totalMonth / 31)), color: '#F3D66B' },
          { label: 'Categories Used', value: `${categoryData.filter(c => c.spent > 0).length}`, color: '#38C98A' },
          { label: 'Transactions', value: `${transactions.filter(t => { const d = parseISO(t.date); return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear; }).length}`, color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
            <p className="text-xs text-[#A6B2A8] mb-1">{s.label}</p>
            <p className="text-2xl font-bold tabular-nums font-heading" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Monthly Comparison */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold font-heading text-[#F7F5EF]">Monthly Spending</h2>
              <p className="text-xs text-[#A6B2A8]">Spending trend over time</p>
            </div>
            <div className="flex gap-1">
              {(['3m', '6m', '12m'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-2 py-0.5 text-[10px] font-semibold rounded-lg border transition-all ${period === p ? 'bg-[#38C98A]/15 text-[#38C98A] border-[#38C98A]/30' : 'text-[#A6B2A8] border-[#303B33] hover:text-[#F7F5EF]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="spent" fill="#38C98A" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">Category Breakdown</h2>
          <p className="text-xs text-[#A6B2A8] mb-4">This month's spending by category</p>
          <div className="space-y-3">
            {categoryData.slice(0, 6).map(cat => {
              const maxSpent = categoryData[0]?.spent || 1;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#F7F5EF]">{cat.category}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: cat.color }}>{formatCurrency(cat.spent)}</span>
                  </div>
                  <div className="h-1.5 bg-[#303B33] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(cat.spent / maxSpent) * 100}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day of Week */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">Spending by Day</h2>
          <p className="text-xs text-[#A6B2A8] mb-3">Average spend per transaction, by day of week</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayPatterns} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), 'Avg per tx']} />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {dayPatterns.map((entry, i) => (
                    <Cell
                      key={entry.day}
                      fill={entry.day === 'Sat' || entry.day === 'Sun' ? '#F17E69' : '#38C98A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#38C98A]" />
              <span className="text-[10px] text-[#A6B2A8]">Weekday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#F17E69]" />
              <span className="text-[10px] text-[#A6B2A8]">Weekend</span>
            </div>
          </div>
        </div>

        {/* Income vs Spending */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">Income vs Spending</h2>
          <p className="text-xs text-[#A6B2A8] mb-3">Monthly comparison</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), '']} />
                <Line type="monotone" dataKey="income" stroke="#38C98A" strokeWidth={2} dot={false} name="Income" />
                <Line type="monotone" dataKey="spent" stroke="#F17E69" strokeWidth={2} dot={false} name="Spent" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#A6B2A8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-3">
            💡 Financial Insights
          </h2>
          <p className="text-[10px] text-[#A6B2A8] mb-3 italic">
            Rule-based insights from your actual spending data. Not AI-generated.
          </p>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#253129] border border-[#303B33] rounded-xl px-4 py-3">
                <span className="text-[#38C98A] text-sm shrink-0 mt-0.5">→</span>
                <p className="text-sm text-[#F7F5EF]">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

