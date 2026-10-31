import React from 'react';
import {
  UtensilsCrossed,
  Bus,
  ShoppingBag,
  Film,
  Zap,
  Wifi,
  BookOpen,
  HeartPulse,
  MoreHorizontal,
  TrendingUp,
  Coffee,
  Car,
  Smartphone,
  Music,
} from 'lucide-react';
import { Category } from '../../types/finance';
import { CATEGORY_META } from '../../utils/formatters';

const iconComponents: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Bus,
  ShoppingBag,
  Film,
  Zap,
  Wifi,
  BookOpen,
  HeartPulse,
  MoreHorizontal,
  TrendingUp,
  Coffee,
  Car,
  Smartphone,
  Music,
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  dark?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showLabel = false,
  dark = true,
}) => {
  const meta = CATEGORY_META[category];
  const Icon = iconComponents[meta.iconName] || MoreHorizontal;

  const sizeStyles = {
    sm: { icon: 'w-7 h-7', iconSize: 13, text: 'text-xs' },
    md: { icon: 'w-9 h-9', iconSize: 16, text: 'text-sm' },
    lg: { icon: 'w-11 h-11', iconSize: 20, text: 'text-sm' },
  };

  const s = sizeStyles[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.icon} rounded-xl flex items-center justify-center shrink-0`}
        style={{
          background: dark ? meta.bgColor : meta.lightBg,
          border: `1px solid ${meta.borderDark}`,
        }}
      >
        <Icon size={s.iconSize} color={meta.color} strokeWidth={2} />
      </div>
      {showLabel && (
        <span className={`${s.text} font-medium`} style={{ color: dark ? '#F7F5EF' : '#222723' }}>
          {category}
        </span>
      )}
    </div>
  );
};

export default CategoryBadge;

