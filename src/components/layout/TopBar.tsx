import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TopBar: React.FC = () => {
  const {
    user,
    notifications,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useFinance();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/app/transactions?search=${encodeURIComponent(searchVal.trim())}`);
      setShowSearch(false);
      setSearchVal('');
    }
  };

  const iconColor = (type: string) => {
    const m: Record<string, string> = {
      budget_warning: '#F3D66B',
      settlement: '#38C98A',
      goal_reached: '#A78BFA',
      info: '#60A5FA',
    };
    return m[type] || '#A6B2A8';
  };

  return (
    <header className="h-14 shrink-0 border-b border-[#303B33] bg-[#111713] flex items-center px-4 md:px-6 gap-3 z-20">
      {/* Month Navigator */}
      <div className="flex items-center gap-1.5 bg-[#1C251F] border border-[#303B33] rounded-xl px-3 py-1.5">
        <button
          onClick={prevMonth}
          className="text-[#A6B2A8] hover:text-[#F7F5EF] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-semibold text-[#F7F5EF] tabular-nums min-w-[96px] text-center font-heading">
          {MONTHS[selectedMonth]} {selectedYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-[#A6B2A8] hover:text-[#F7F5EF] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex-1" />

      {/* Search */}
      {showSearch ? (
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            ref={searchRef}
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search transactions..."
            className="bg-[#1C251F] border border-[#303B33] rounded-xl px-3 py-1.5 text-sm text-[#F7F5EF] placeholder-[#A6B2A8] focus:outline-none focus:border-[#38C98A]/50 w-48"
          />
          <button
            type="button"
            onClick={() => { setShowSearch(false); setSearchVal(''); }}
            className="text-[#A6B2A8] hover:text-[#F7F5EF]"
          >
            <X size={16} />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowSearch(true)}
          className="w-8 h-8 rounded-xl bg-[#1C251F] border border-[#303B33] flex items-center justify-center text-[#A6B2A8] hover:text-[#F7F5EF] hover:border-[#38C98A]/30 transition-all"
          aria-label="Search"
        >
          <Search size={15} />
        </button>
      )}

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifs(v => !v)}
          className="w-8 h-8 rounded-xl bg-[#1C251F] border border-[#303B33] flex items-center justify-center text-[#A6B2A8] hover:text-[#F7F5EF] hover:border-[#38C98A]/30 transition-all relative"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#F17E69] rounded-full text-[8px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-10 w-80 bg-[#1C251F] border border-[#303B33] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#303B33]">
              <span className="text-sm font-bold font-heading text-[#F7F5EF]">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-[#38C98A] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-[#A6B2A8] text-center py-6">No notifications</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-[#303B33]/50 cursor-pointer hover:bg-[#253129] transition-colors ${!n.read ? 'bg-[#253129]/40' : ''}`}
                    onClick={() => { markNotificationAsRead(n.id); setShowNotifs(false); }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: n.read ? '#303B33' : iconColor(n.type) }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#F7F5EF]">{n.title}</p>
                        <p className="text-xs text-[#A6B2A8] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full overflow-hidden border border-[#303B33] cursor-pointer hover:border-[#38C98A]/40 transition-colors"
        onClick={() => navigate('/app/profile')}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
};

export default TopBar;

