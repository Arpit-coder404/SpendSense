import React from 'react';
import { Transaction } from '../../types/finance';
import CategoryBadge from '../common/CategoryBadge';
import { formatCurrency, formatFriendlyDate, formatShortDate } from '../../utils/formatters';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#253129]/50 transition-colors">
      <CategoryBadge category={transaction.category} size={compact ? 'sm' : 'md'} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#F7F5EF] truncate">{transaction.title}</p>
        {!compact && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[#A6B2A8]">{transaction.category}</span>
            {transaction.paymentMethod && (
              <>
                <span className="text-[#303B33]">·</span>
                <span className="text-xs text-[#A6B2A8]">{transaction.paymentMethod}</span>
              </>
            )}
            {transaction.merchant && (
              <>
                <span className="text-[#303B33]">·</span>
                <span className="text-xs text-[#A6B2A8] truncate">{transaction.merchant}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!compact && (
          <span className="text-xs text-[#A6B2A8]">{formatShortDate(transaction.date)}</span>
        )}
        <span
          className={`text-sm font-bold tabular-nums font-heading ${isIncome ? 'text-[#38C98A]' : 'text-[#F7F5EF]'}`}
        >
          {isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="p-1 rounded-lg text-[#A6B2A8] hover:text-[#38C98A] hover:bg-[#38C98A]/10 transition-colors"
                aria-label="Edit transaction"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-1 rounded-lg text-[#A6B2A8] hover:text-[#F17E69] hover:bg-[#F17E69]/10 transition-colors"
                aria-label="Delete transaction"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;

