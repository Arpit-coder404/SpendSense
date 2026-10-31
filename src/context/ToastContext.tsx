import React, { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const iconMap: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };
  const colorMap: Record<ToastType, string> = {
    success: 'bg-[#1C251F] border-[#38C98A]/40 text-[#38C98A]',
    error: 'bg-[#1C251F] border-[#F17E69]/40 text-[#F17E69]',
    info: 'bg-[#1C251F] border-[#60A5FA]/40 text-[#60A5FA]',
    warning: 'bg-[#1C251F] border-[#F3D66B]/40 text-[#F3D66B]',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium pointer-events-auto transition-all duration-300 ${colorMap[toast.type]}`}
            style={{ minWidth: '280px', maxWidth: '380px' }}
          >
            <span className="text-base font-bold shrink-0">{iconMap[toast.type]}</span>
            <span className="text-[#F7F5EF] font-normal">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

