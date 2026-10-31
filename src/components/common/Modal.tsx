import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      {/* Panel */}
      <div
        className={`relative w-full ${sizeMap[size]} rounded-2xl border border-[#303B33] bg-[#1C251F] shadow-2xl overflow-hidden`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {title && (
          <div className="px-6 pt-6 pb-4 border-b border-[#303B33]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-[#F7F5EF]">{title}</h2>
                {subtitle && <p className="text-sm text-[#A6B2A8] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-[#A6B2A8] hover:text-[#F7F5EF] transition-colors text-xl leading-none mt-0.5 shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

