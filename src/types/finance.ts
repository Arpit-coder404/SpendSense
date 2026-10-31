export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Subscriptions'
  | 'Utilities'
  | 'Entertainment'
  | 'Academics'
  | 'Health'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: string;
  monthlyBudget: number;
  campus: string;
  collegeYear: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO date YYYY-MM-DD
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
  note?: string;
  merchant?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: number; // 0-11
  year: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  emoji: string;
  members: GroupMember[];
  createdAt: string;
}

export type SplitMethod = 'equal' | 'custom' | 'percentage';

export interface ParticipantShare {
  userId: string;
  shareAmount: number;
  percentage?: number;
  isPaid: boolean;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  title: string;
  totalAmount: number;
  paidBy: string; // userId
  participants: ParticipantShare[];
  splitMethod: SplitMethod;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  expenseId?: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: 'completed' | 'pending';
  date: string;
  note?: string;
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  emoji: string;
  category: string;
  contributions: GoalContribution[];
  createdAt: string;
  isCompleted?: boolean;
}

export interface CampusInsight {
  id: string;
  title: string;
  category: Category;
  period: string;
  averageStudentSpend: number;
  campusMedian: number;
  studentSharePercentage: number;
  trendPercentage: number;
  sampleSize: number;
  narrative: string;
  sourceType: 'simulated_campus_aggregate';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'budget_warning' | 'settlement' | 'goal_reached' | 'info';
  timestamp: string;
  read: boolean;
  link?: string;
}

