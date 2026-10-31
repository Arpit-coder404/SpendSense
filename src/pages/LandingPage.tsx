import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, TrendingUp, Users, Target, Camera, PieChart,
  ArrowRight, Menu, X, Check, Star, ArrowDown,
  DollarSign, BarChart3, ScissorsLineDashed, Globe,
} from 'lucide-react';

const NAV_ITEMS = ['Features', 'How It Works', 'Campus Insights', 'For Groups', 'About'];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const goToApp = () => navigate('/app');

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#F5F0E5', fontFamily: '"DM Sans", sans-serif' }}
    >
      {/* =================== NAVIGATION =================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#F5F0E5]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 rounded-lg bg-[#111713] flex items-center justify-center">
              <Zap size={15} color="#38C98A" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-[15px] text-[#111713] tracking-tight">SpendSense</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-[#636D65] hover:text-[#111713] transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={goToApp}
              className="text-sm font-semibold text-[#636D65] hover:text-[#111713] transition-colors"
            >
              Log In
            </button>
            <button
              onClick={goToApp}
              className="px-5 py-2.5 rounded-xl bg-[#111713] text-[#F5F0E5] text-sm font-bold hover:bg-[#253129] transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} color="#111713" /> : <Menu size={20} color="#111713" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFEFA] border-t border-[#E7E0D5] px-6 py-4 space-y-3">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-sm font-medium text-[#636D65]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button onClick={goToApp} className="block w-full text-left text-sm font-semibold text-[#636D65]">Log In</button>
            <button
              onClick={goToApp}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111713] text-[#F5F0E5] text-sm font-bold"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* =================== HERO =================== */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#111713] text-[#38C98A] text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <Zap size={11} />
              Student-first personal finance
            </div>

            <h1
              className="font-heading font-black text-[#111713] leading-[0.9] mb-4"
              style={{ fontSize: 'clamp(52px, 8vw, 84px)' }}
            >
              SAME MONEY.{' '}
              <span
                className="font-handwriting"
                style={{ color: '#38C98A', fontSize: '1.05em', lineHeight: 1.1 }}
              >
                MORE FREEDOM.
              </span>
            </h1>

            <p className="text-[#636D65] text-lg leading-relaxed mb-8 max-w-md">
              Track your expenses, split bills, and build better financial habits — designed for campus life.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={goToApp}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#111713] text-[#F5F0E5] font-bold text-base hover:bg-[#253129] transition-colors"
              >
                Start Tracking <ArrowRight size={16} />
              </button>
              <button
                onClick={goToApp}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-transparent border-2 border-[#E7E0D5] text-[#111713] font-bold text-base hover:border-[#111713] transition-colors"
              >
                See Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: '📊', text: 'Track Expenses' },
                { icon: '✂️', text: 'Split Bills' },
                { icon: '🎯', text: 'Set Budgets' },
                { icon: '🌐', text: 'Campus Insights' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-xs font-semibold text-[#636D65]">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scrapbook Composition */}
          <div className="relative h-[500px] md:h-[580px]">
            {/* Main Photo */}
            <div
              className="absolute top-0 right-0 w-[75%] h-[68%] rounded-3xl overflow-hidden shadow-xl"
              style={{ transform: 'rotate(1.5deg)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                alt="Student studying in café"
                className="w-full h-full object-cover"
              />
              {/* Photo overlay label */}
              <div className="absolute bottom-3 right-3 bg-[#111713]/80 text-[#38C98A] text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                📚 Study Life
              </div>
            </div>

            {/* Receipt card */}
            <div
              className="absolute bottom-24 left-0 w-44 bg-[#FFFEFA] rounded-2xl shadow-xl p-3"
              style={{ transform: 'rotate(-3deg)' }}
            >
              <div className="border-b border-dashed border-[#E7E0D5] pb-2 mb-2">
                <p className="text-[9px] font-bold text-[#636D65] uppercase tracking-wider">Blue Tokai Café</p>
                <p className="text-[10px] text-[#111713] mt-0.5">Cold Brew × 2</p>
                <p className="text-[10px] text-[#111713]">Croissant × 1</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#636D65]">Total</span>
                <span className="text-sm font-black text-[#111713] font-heading">₹320</span>
              </div>
              <div className="mt-1.5 text-center">
                <span className="text-[9px] text-[#38C98A] font-bold">✓ Tracked in SpendSense</span>
              </div>
            </div>

            {/* Yellow sticky note */}
            <div
              className="absolute top-4 left-6 w-40 bg-[#F3D66B] p-3 shadow-lg rounded-sm"
              style={{ transform: 'rotate(-4deg)' }}
            >
              <p className="font-handwriting text-[#111713] text-sm leading-snug">
                Chai. Food. Trips. Assignments.
                <br />
                And still some savings? 🙌
              </p>
            </div>

            {/* Spending card */}
            <div
              className="absolute bottom-6 right-4 w-48 bg-[#111713] rounded-2xl p-3 shadow-2xl"
              style={{ transform: 'rotate(2deg)' }}
            >
              <p className="text-[10px] text-[#A6B2A8] uppercase tracking-wider mb-1">October Budget</p>
              <p className="text-xl font-black text-[#38C98A] font-heading tabular-nums">₹9,425</p>
              <p className="text-[10px] text-[#A6B2A8] mt-0.5">of ₹15,000 spent</p>
              <div className="mt-2 h-1.5 bg-[#303B33] rounded-full overflow-hidden">
                <div className="h-full w-[63%] bg-[#38C98A] rounded-full" />
              </div>
            </div>

            {/* Small sticky note 2 */}
            <div
              className="absolute top-48 left-10 w-36 bg-[#FFFEFA] border border-[#E7E0D5] p-2.5 shadow rounded-xl"
              style={{ transform: 'rotate(2.5deg)' }}
            >
              <p className="font-handwriting text-[#636D65] text-xs leading-snug">
                Better financial habits.<br />Better college life. ✨
              </p>
            </div>

            {/* Hand-drawn arrow SVG */}
            <svg
              className="absolute"
              style={{ top: '38%', left: '26%', width: 60, height: 40, opacity: 0.4 }}
              viewBox="0 0 60 40"
              fill="none"
            >
              <path d="M5 35 Q30 5 55 20" stroke="#38C98A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M50 12 L55 20 L46 21" stroke="#38C98A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </section>

      {/* =================== FEATURES =================== */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#38C98A] uppercase tracking-widest mb-3">What SpendSense does</p>
          <h2 className="font-heading font-black text-[#111713] text-4xl md:text-5xl leading-tight">
            Built for real student life.
          </h2>
          <p className="text-[#636D65] mt-4 max-w-xl mx-auto text-base">
            Not a banking app. Not a spreadsheet. Something actually useful for how you live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingUp,
              color: '#38C98A',
              title: 'Daily Expense Tracking',
              desc: 'Log chai, auto rides, assignment printouts — every rupee. Group by day, week, or month.',
              note: 'Most used feature',
            },
            {
              icon: ScissorsLineDashed,
              color: '#F3D66B',
              title: 'Bill Splitting',
              desc: 'Split dinner, movies, or hostel Wi-Fi equally, by custom amount, or by percentage.',
              note: 'No more awkward maths',
            },
            {
              icon: PieChart,
              color: '#60A5FA',
              title: 'Budget Planning',
              desc: 'Set per-category budgets and get alerts before you overspend on food, shopping, or entertainment.',
              note: 'Visual budget bars',
            },
            {
              icon: Globe,
              color: '#A78BFA',
              title: 'Campus Money Pulse',
              desc: 'See anonymised aggregate spending trends from your campus. Benchmark without comparing individuals.',
              note: '🔒 Always anonymous',
            },
            {
              icon: Target,
              color: '#F17E69',
              title: 'Savings Goals',
              desc: 'Set goals for Goa trips, earbuds, or a MacBook. Track contributions and celebrate milestones.',
              note: 'One goal at a time',
            },
            {
              icon: Camera,
              color: '#38C98A',
              title: 'Snap & Track Receipts',
              desc: 'Photograph your bills and let SpendSense pre-fill the details. Edit, confirm, and done.',
              note: 'Local processing only',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="bg-[#FFFEFA] border border-[#E7E0D5] rounded-3xl p-6 hover:shadow-md transition-shadow group"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${feature.color}18`, border: `1.5px solid ${feature.color}30` }}
              >
                <feature.icon size={20} color={feature.color} />
              </div>
              <h3 className="font-heading font-bold text-[#111713] text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-[#636D65] leading-relaxed mb-3">{feature.desc}</p>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                {feature.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section id="how-it-works" className="py-20 px-6 bg-[#111713]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#38C98A] uppercase tracking-widest mb-3">Simple by design</p>
            <h2 className="font-heading font-black text-[#F7F5EF] text-4xl md:text-5xl leading-tight">
              How SpendSense works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: '📱',
                title: 'Log your expenses',
                desc: 'Add expenses manually in seconds, or snap a receipt photo and let SpendSense pre-fill the details.',
              },
              {
                step: '02',
                icon: '📊',
                title: 'Understand your spending',
                desc: 'See your spending by category, day, week, and month. Spot habits. Compare against your budget.',
              },
              {
                step: '03',
                icon: '🎯',
                title: 'Make smarter decisions',
                desc: 'Set budgets, track savings goals, and split group bills — all in one place. Your campus, your way.',
              },
            ].map((step, i) => (
              <div key={step.step} className="bg-[#1C251F] border border-[#303B33] rounded-3xl p-6">
                <div className="text-4xl mb-4">{step.icon}</div>
                <p className="text-[#38C98A] font-heading font-black text-sm mb-2">{step.step}</p>
                <h3 className="text-[#F7F5EF] font-heading font-bold text-base mb-2">{step.title}</h3>
                <p className="text-[#A6B2A8] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== CAMPUS INSIGHTS PREVIEW =================== */}
      <section id="campus-insights" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-[#38C98A] uppercase tracking-widest mb-4">Signature feature</p>
            <h2 className="font-heading font-black text-[#111713] text-4xl md:text-5xl leading-tight mb-5">
              Campus Money Pulse
            </h2>
            <p className="text-[#636D65] text-base leading-relaxed mb-6">
              See anonymised spending trends from your campus community. Find out how your peers spend on food, transport, and entertainment — without ever revealing individual data.
            </p>
            <div className="space-y-3 mb-8">
              {[
                '🔒 Always fully anonymous — no individual data displayed',
                '📈 Category breakdowns, day-of-week patterns, and monthly trends',
                '📊 Compare your spending style against campus averages',
                '🏷️ All data clearly labelled as aggregate or simulated',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <Check size={14} className="text-[#38C98A] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#636D65]">{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={goToApp}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#111713] text-[#F5F0E5] font-bold text-sm"
            >
              View Campus Pulse <ArrowRight size={14} />
            </button>
          </div>

          {/* Preview card */}
          <div className="bg-[#111713] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#A6B2A8] uppercase tracking-wider">Campus Avg · October</p>
                <p className="text-2xl font-black font-heading text-[#38C98A]">₹9,420</p>
              </div>
              <div className="bg-[#F3D66B]/10 border border-[#F3D66B]/20 rounded-xl px-3 py-1">
                <p className="text-[9px] text-[#F3D66B] font-bold uppercase">Demo Data</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { cat: 'Food & Cafes', pct: 44, color: '#38C98A' },
                { cat: 'Shopping', pct: 18, color: '#F17E69' },
                { cat: 'Transport', pct: 13, color: '#F3D66B' },
                { cat: 'Entertainment', pct: 10, color: '#A78BFA' },
                { cat: 'Subscriptions', pct: 5, color: '#60A5FA' },
              ].map(c => (
                <div key={c.cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#A6B2A8]">{c.cat}</span>
                    <span className="text-xs font-bold" style={{ color: c.color }}>{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#303B33] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.pct * 2.2}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#A6B2A8] mt-3 italic">Based on 1,420 anonymised student data points (simulated)</p>
          </div>
        </div>
      </section>

      {/* =================== GROUPS =================== */}
      <section id="for-groups" className="py-20 px-6 bg-[#FFFEFA]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold text-[#38C98A] uppercase tracking-widest mb-4">For your squad</p>
          <h2 className="font-heading font-black text-[#111713] text-4xl md:text-5xl leading-tight mb-5">
            Spend together.<br />Settle up cleanly.
          </h2>
          <p className="text-[#636D65] max-w-xl mx-auto text-base mb-10">
            No more "who paid what" confusion. SpendSense tracks group bills, splits them your way, and keeps everyone square.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Canteen Crew ☕', desc: 'Chai, rolls & study snacks' },
              { name: 'Hostel Roomies 🏠', desc: 'Wi-Fi, groceries & utilities' },
              { name: 'Goa Trip 🌴', desc: 'Villa, scooters & beach food' },
              { name: 'Weekend Squad 🎮', desc: 'Movies, cafes & gaming' },
            ].map(g => (
              <div
                key={g.name}
                className="bg-[#F5F0E5] border border-[#E7E0D5] rounded-2xl px-5 py-4 text-left hover:border-[#111713]/20 transition-colors cursor-pointer"
                onClick={goToApp}
              >
                <p className="font-heading font-bold text-[#111713] text-sm">{g.name}</p>
                <p className="text-xs text-[#636D65] mt-0.5">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FINAL CTA =================== */}
      <section className="py-20 px-6 bg-[#111713]">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-heading font-black text-[#F7F5EF] leading-tight mb-4"
            style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            Your money is yours.{' '}
            <span className="text-[#38C98A] font-handwriting" style={{ fontSize: '1.1em' }}>
              Understand it.
            </span>
          </h2>
          <p className="text-[#A6B2A8] text-base mb-8 max-w-md mx-auto leading-relaxed">
            Spend smarter. Split easier. Live better. Start tracking for free — no signup required for the demo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={goToApp}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#38C98A] text-[#111713] font-bold text-base hover:bg-[#2FB278] transition-colors"
            >
              Start Tracking <ArrowRight size={16} />
            </button>
            <button
              onClick={goToApp}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-[#303B33] text-[#F7F5EF] font-bold text-base hover:border-[#38C98A]/40 transition-colors"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="bg-[#0D1210] border-t border-[#1C251F] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1C251F] border border-[#303B33] flex items-center justify-center">
              <Zap size={13} color="#38C98A" />
            </div>
            <span className="font-heading font-bold text-sm text-[#F7F5EF]">SpendSense</span>
          </div>
          <p className="text-xs text-[#A6B2A8]">
            Same Money. More Freedom. — A student finance prototype. All data stored locally. No accounts. No servers.
          </p>
          <p className="text-xs text-[#A6B2A8]">
            Built with ❤️ for campus life.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

