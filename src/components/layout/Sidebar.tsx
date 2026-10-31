import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Users,
  ScissorsLineDashed,
  BarChart3,
  Globe,
  Target,
  User,
  Zap,
  LogOut,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/app/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/app/budgets', icon: PieChart, label: 'Budgets' },
  { to: '/app/split-bills', icon: ScissorsLineDashed, label: 'Split Bills' },
  { to: '/app/groups', icon: Users, label: 'Groups' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/campus', icon: Globe, label: 'Campus Pulse' },
  { to: '/app/goals', icon: Target, label: 'Goals' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

const Sidebar: React.FC = () => {
  const { user, notifications } = useFinance();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-[#111713] border-r border-[#303B33] h-screen sticky top-0 z-30">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b border-[#303B33] cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 rounded-lg bg-[#38C98A]/15 border border-[#38C98A]/30 flex items-center justify-center">
          <Zap size={15} color="#38C98A" strokeWidth={2.5} />
        </div>
        <span className="font-heading font-bold text-[15px] text-[#F7F5EF] tracking-tight">SpendSense</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#38C98A]/12 text-[#38C98A] border border-[#38C98A]/20'
                      : 'text-[#A6B2A8] hover:text-[#F7F5EF] hover:bg-[#253129]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                    {item.label === 'Home' && unreadCount > 0 && (
                      <span className="ml-auto text-[10px] bg-[#F17E69] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="border-t border-[#303B33] p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#253129] shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#F7F5EF] truncate">{user.name}</p>
            <p className="text-[10px] text-[#A6B2A8] truncate">{user.collegeYear}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-[#A6B2A8] hover:text-[#F17E69] transition-colors"
            title="Back to landing"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

