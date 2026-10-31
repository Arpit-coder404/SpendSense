import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Category } from '../types/finance';

/**
 * Formats a number as Indian Rupee currency (e.g., ₹3,420 or ₹1,25,000)
 */
export function formatCurrency(amount: number, options?: { showDecimals?: boolean; currencySymbol?: string }): string {
  const showDecimals = options?.showDecimals ?? false;
  const symbol = options?.currencySymbol ?? '₹';

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${symbol}${formatter.format(amount)}`;
}

/**
 * Human-friendly date representation for grouped lists
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'd MMM, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'd MMM');
  } catch {
    return dateStr;
  }
}

/**
 * Category styling metadata: icons, background colors, and border colors
 */
export const CATEGORY_META: Record<Category, {
  color: string;
  bgColor: string;
  lightBg: string;
  borderDark: string;
  iconName: string;
}> = {
  Food: {
    color: '#38C98A',
    bgColor: 'rgba(56, 201, 138, 0.15)',
    lightBg: '#E9F9F1',
    borderDark: 'rgba(56, 201, 138, 0.3)',
    iconName: 'UtensilsCrossed',
  },
  Transport: {
    color: '#F3D66B',
    bgColor: 'rgba(243, 214, 107, 0.15)',
    lightBg: '#FDF9E7',
    borderDark: 'rgba(243, 214, 107, 0.3)',
    iconName: 'Bus',
  },
  Shopping: {
    color: '#F17E69',
    bgColor: 'rgba(241, 126, 105, 0.15)',
    lightBg: '#FDF0ED',
    borderDark: 'rgba(241, 126, 105, 0.3)',
    iconName: 'ShoppingBag',
  },
  Entertainment: {
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.15)',
    lightBg: '#F5F2FE',
    borderDark: 'rgba(167, 139, 250, 0.3)',
    iconName: 'Film',
  },
  Subscriptions: {
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.15)',
    lightBg: '#EFF6FF',
    borderDark: 'rgba(96, 165, 250, 0.3)',
    iconName: 'Zap',
  },
  Utilities: {
    color: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    lightBg: '#ECFDF5',
    borderDark: 'rgba(52, 211, 153, 0.3)',
    iconName: 'Wifi',
  },
  Academics: {
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    lightBg: '#FEF9E7',
    borderDark: 'rgba(251, 191, 36, 0.3)',
    iconName: 'BookOpen',
  },
  Health: {
    color: '#F43F5E',
    bgColor: 'rgba(244, 63, 94, 0.15)',
    lightBg: '#FFF1F2',
    borderDark: 'rgba(244, 63, 94, 0.3)',
    iconName: 'HeartPulse',
  },
  Other: {
    color: '#9CA3AF',
    bgColor: 'rgba(156, 163, 175, 0.15)',
    lightBg: '#F3F4F6',
    borderDark: 'rgba(156, 163, 175, 0.3)',
    iconName: 'MoreHorizontal',
  },
};

