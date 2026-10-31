import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import {
  CAMPUS_OVERVIEW,
  CAMPUS_CATEGORY_BREAKDOWN,
  CAMPUS_TIME_TRENDS,
  CAMPUS_EDITORIAL_INSIGHTS,
} from '../data/campusData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

const CampusInsights: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const tooltipStyle = {
    background: '#1C251F',
    border: '1px solid #303B33',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#F7F5EF',
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-2">
        <div className="inline-flex items-center gap-2 bg-[#F3D66B]/10 border border-[#F3D66B]/25 rounded-full px-3 py-1 mb-3">
          <span className="text-[10px] font-bold text-[#F3D66B] uppercase tracking-wider">⚠ Simulated Anonymous Aggregate Data</span>
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#F7F5EF]">Your Campus. Its Spending Story.</h1>
        <p className="text-[#A6B2A8] text-sm mt-1">
          See how students spend, compare trends and discover campus habits.
        </p>
      </div>

      {/* Privacy note */}
      <div className="bg-[#253129] border border-[#303B33] rounded-xl px-4 py-2.5 mb-6 flex items-center gap-3">
        <span className="text-base">🔒</span>
        <p className="text-xs text-[#A6B2A8]">
          All campus data shown below is <strong className="text-[#F7F5EF]">simulated and anonymised</strong>. No individual student spending is ever displayed or stored.
          {' '}<span className="text-[#A6B2A8]">Source: {CAMPUS_OVERVIEW.lastUpdated}</span>
        </p>
      </div>

      {/* Campus Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Avg Monthly Spend', value: formatCurrency(CAMPUS_OVERVIEW.averageMonthlySpend), color: '#38C98A' },
          { label: 'Avg Daily Spend', value: formatCurrency(CAMPUS_OVERVIEW.averageDailySpend), color: '#F3D66B' },
          { label: 'Students Sampled', value: `${CAMPUS_OVERVIEW.totalStudentsSampled.toLocaleString()}`, color: '#60A5FA' },
          { label: 'UPI Usage', value: `${CAMPUS_OVERVIEW.upiPaymentSharePercentage}%`, color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
            <p className="text-xs text-[#A6B2A8] mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-heading tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#A6B2A8] mt-1 italic">Demo data</p>
          </div>
        ))}
      </div>

      {/* Highlighted Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <p className="text-xs font-bold text-[#A6B2A8] uppercase tracking-wider mb-2">Top Spending Category</p>
          <p className="text-sm font-bold text-[#38C98A]">{CAMPUS_OVERVIEW.topCategory}</p>
          <p className="text-xs text-[#A6B2A8] mt-1">of average monthly spend</p>
        </div>
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <p className="text-xs font-bold text-[#A6B2A8] uppercase tracking-wider mb-2">Canteen vs Delivery</p>
          <p className="text-sm font-bold text-[#F3D66B]">{CAMPUS_OVERVIEW.canteenVsDeliveryRatio}</p>
          <p className="text-xs text-[#A6B2A8] mt-1">food spending split</p>
        </div>
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <p className="text-xs font-bold text-[#A6B2A8] uppercase tracking-wider mb-2">Weekend Spending Spike</p>
          <p className="text-sm font-bold text-[#F17E69]">+{CAMPUS_OVERVIEW.weekendSpikePercentage}%</p>
          <p className="text-xs text-[#A6B2A8] mt-1">vs weekday average</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Category Comparison */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">Category Spend Comparison</h2>
          <p className="text-xs text-[#A6B2A8] mb-3">Campus avg vs your spending (demo)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAMPUS_CATEGORY_BREAKDOWN} layout="vertical" margin={{ left: 60, right: 16, top: 4, bottom: 4 }}>
                <XAxis type="number" tick={{ fill: '#A6B2A8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fill: '#A6B2A8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="campusAvg" name="Campus Avg" fill="#38C98A" opacity={0.7} radius={[0, 3, 3, 0]} barSize={7} />
                <Bar dataKey="yourAvg" name="Your Spend" fill="#F3D66B" radius={[0, 3, 3, 0]} barSize={7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#38C98A] opacity-70" /><span className="text-[10px] text-[#A6B2A8]">Campus Avg (demo)</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F3D66B]" /><span className="text-[10px] text-[#A6B2A8]">Your Spend</span></div>
          </div>
        </div>

        {/* Time Trends */}
        <div className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-4">
          <h2 className="text-sm font-bold font-heading text-[#F7F5EF] mb-1">Day-of-Week Spending</h2>
          <p className="text-xs text-[#A6B2A8] mb-3">Campus avg spend by day (demo data)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAMPUS_TIME_TRENDS} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A6B2A8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="campusAvg" name="Campus Avg" fill="#38C98A" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {CAMPUS_TIME_TRENDS.map((d, i) => (
                    <Cell key={d.day} fill={d.day === 'Fri' || d.day === 'Sat' ? '#F17E69' : '#38C98A'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Editorial Insights */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-heading text-[#F7F5EF]">Campus Spending Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAMPUS_EDITORIAL_INSIGHTS.map(insight => (
            <div key={insight.id} className="bg-[#1C251F] border border-[#303B33] rounded-2xl p-5 hover:border-[#38C98A]/25 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-[#A6B2A8] font-medium mb-1">{insight.period}</p>
                  <h3 className="text-sm font-bold text-[#F7F5EF] leading-tight">{insight.title}</h3>
                </div>
                <div className="ml-3 shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      insight.trendPercentage > 0
                        ? 'bg-[#F17E69]/15 text-[#F17E69]'
                        : 'bg-[#38C98A]/15 text-[#38C98A]'
                    }`}
                  >
                    {insight.trendPercentage > 0 ? '+' : ''}{insight.trendPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className="text-[10px] text-[#A6B2A8]">Campus Avg</p>
                  <p className="text-base font-bold text-[#38C98A] tabular-nums font-heading">{formatCurrency(insight.averageStudentSpend)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#A6B2A8]">Median</p>
                  <p className="text-base font-bold text-[#F7F5EF] tabular-nums font-heading">{formatCurrency(insight.campusMedian)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#A6B2A8]">Sample</p>
                  <p className="text-base font-bold text-[#F7F5EF] font-heading">{insight.sampleSize.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-[#A6B2A8] leading-relaxed">{insight.narrative}</p>
              <div className="mt-3 pt-3 border-t border-[#303B33]">
                <span className="text-[10px] text-[#A6B2A8] italic">Source type: {insight.sourceType.replace(/_/g, ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusInsights;

