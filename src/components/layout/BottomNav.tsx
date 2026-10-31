import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  ScissorsLineDashed,
  Target,
  Users,
} from 'lucide-react';

const mobileNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/app/transactions', icon: ArrowLeftRight, label: 'Spending' },
  { to: '/app/split-bills', icon: ScissorsLineDashed, label: 'Split' },
  { to: '/app/budgets', icon: PieChart, label: 'Budgets' },
  { to: '/app/goals', icon: Target, label: 'Goals' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111713]/95 backdrop-blur-md border-t border-[#303B33]">
      <ul className="flex justify-around items-center h-16 px-2">
        {mobileNavItems.map(item => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 transition-colors ${
                  isActive ? 'text-[#38C98A]' : 'text-[#A6B2A8]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;

