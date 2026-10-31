import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Transaction, 
  Budget, 
  Group, 
  GroupExpense, 
  Settlement, 
  SavingsGoal, 
  AppNotification, 
  Category,
  GroupMember
} from '../types/finance';
import { 
  INITIAL_USER, 
  INITIAL_MEMBERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_GROUPS, 
  INITIAL_GROUP_EXPENSES, 
  INITIAL_SETTLEMENTS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_NOTIFICATIONS 
} from '../data/demoData';
import { parseISO, isSameMonth } from 'date-fns';

interface FinanceContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  members: GroupMember[];
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, limit: number) => void;
  deleteBudget: (id: string) => void;
  
  // Groups & Splits
  groups: Group[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Group;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  
  groupExpenses: GroupExpense[];
  addGroupExpense: (expense: Omit<GroupExpense, 'id' | 'createdAt'>) => GroupExpense;
  updateGroupExpense: (id: string, updates: Partial<GroupExpense>) => void;
  deleteGroupExpense: (id: string) => void;
  
  settlements: Settlement[];
  recordSettlement: (settlement: Omit<Settlement, 'id'>) => void;
  
  // Savings Goals
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions'>) => SavingsGoal;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (goalId: string, amount: number, note?: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  
  // Active viewing period
  selectedMonth: number; // 0-11
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  
  // Computed Financial Metrics
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
  dailyAverageThisMonth: number;
  remainingBudgetThisMonth: number;
  categorySpendingThisMonth: Record<Category, number>;
  netGroupBalance: { toReceive: number; toPay: number };
  
  // Reset
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  USER: 'spendsense_user_v1',
  MEMBERS: 'spendsense_members_v1',
  TRANSACTIONS: 'spendsense_transactions_v1',
  BUDGETS: 'spendsense_budgets_v1',
  GROUPS: 'spendsense_groups_v1',
  GROUP_EXPENSES: 'spendsense_group_expenses_v1',
  SETTLEMENTS: 'spendsense_settlements_v1',
  GOALS: 'spendsense_goals_v1',
  NOTIFICATIONS: 'spendsense_notifications_v1',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Selected period (Defaults to October 2026 based on demo context)
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 9 = October (0-indexed)
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Load state from LocalStorage or initialize with seeded demo data
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [members, setMembers] = useState<GroupMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [groupExpenses, setGroupExpenses] = useState<GroupExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUP_EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_GROUP_EXPENSES;
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUP_EXPENSES, JSON.stringify(groupExpenses));
  }, [groupExpenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);

    // Check budget alert
    if (newTx.type === 'expense') {
      const budget = budgets.find(b => b.category === newTx.category);
      if (budget) {
        const currentSpent = transactions
          .filter(t => t.type === 'expense' && t.category === newTx.category)
          .reduce((sum, t) => sum + t.amount, 0) + newTx.amount;
        
        const ratio = currentSpent / budget.limit;
        if (ratio >= 1.0) {
          addNotification({
            title: `Exceeded ${budget.category} Budget!`,
            message: `You've spent ₹${currentSpent.toLocaleString('en-IN')} of your ₹${budget.limit.toLocaleString('en-IN')} limit.`,
            type: 'budget_warning',
            link: '/app/budgets',
          });
        } else if (ratio >= 0.85) {
          addNotification({
            title: `${budget.category} Budget Warning`,
            message: `You've used ${Math.round(ratio * 100)}% of your ${budget.category} budget limit.`,
            type: 'budget_warning',
            link: '/app/budgets',
          });
        }
      }
    }

    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `b_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), newBudget]);
  };

  const updateBudget = (id: string, limit: number) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, limit } : b)));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const addGroup = (group: Omit<Group, 'id' | 'createdAt'>): Group => {
    const newGroup: Group = {
      ...group,
      id: `grp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => [newGroup, ...prev]);
    return newGroup;
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    setGroups(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setGroupExpenses(prev => prev.filter(e => e.groupId !== id));
    setSettlements(prev => prev.filter(s => s.groupId !== id));
  };

  const addGroupExpense = (expense: Omit<GroupExpense, 'id' | 'createdAt'>): GroupExpense => {
    const newExpense: GroupExpense = {
      ...expense,
      id: `gexp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGroupExpenses(prev => [newExpense, ...prev]);

    // If user paid, create a matching personal expense transaction if desired
    if (expense.paidBy === user.id) {
      addTransaction({
        title: `${expense.title} (Group Split)`,
        amount: expense.totalAmount,
        type: 'expense',
        category: 'Food',
        date: expense.date,
        paymentMethod: 'UPI',
        note: `Paid full bill for group. Friends share to be settled.`,
      });
    }

    return newExpense;
  };

  const updateGroupExpense = (id: string, updates: Partial<GroupExpense>) => {
    setGroupExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteGroupExpense = (id: string) => {
    setGroupExpenses(prev => prev.filter(e => e.id !== id));
  };

  const recordSettlement = (settlement: Omit<Settlement, 'id'>) => {
    const newSettlement: Settlement = {
      ...settlement,
      id: `set_${Date.now()}`,
    };
    setSettlements(prev => [newSettlement, ...prev]);

    // Mark relevant participant share as paid if matching expense
    if (settlement.expenseId) {
      setGroupExpenses(prev =>
        prev.map(exp => {
          if (exp.id === settlement.expenseId) {
            return {
              ...exp,
              participants: exp.participants.map(p =>
                p.userId === settlement.fromUserId ? { ...p, isPaid: true } : p
              ),
            };
          }
          return exp;
        })
      );
    }

    addNotification({
      title: 'Settlement Recorded',
      message: `Recorded settlement of ₹${settlement.amount.toLocaleString('en-IN')}. Balances updated.`,
      type: 'settlement',
      link: '/app/split-bills',
    });
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'contributions'>): SavingsGoal => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      contributions: [],
      createdAt: new Date().toISOString(),
      isCompleted: goal.savedAmount >= goal.targetAmount,
    };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          updated.isCompleted = updated.savedAmount >= updated.targetAmount;
          return updated;
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addGoalContribution = (goalId: string, amount: number, note?: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const newContribution = {
            id: `c_${Date.now()}`,
            amount,
            date: new Date().toISOString().split('T')[0],
            note: note || 'Contribution',
          };
          const newSaved = g.savedAmount + amount;
          const isCompleted = newSaved >= g.targetAmount;

          if (isCompleted && !g.isCompleted) {
            addNotification({
              title: `Goal Achieved: ${g.title}! 🎉`,
              message: `You've reached your target of ₹${g.targetAmount.toLocaleString('en-IN')}!`,
              type: 'goal_reached',
              link: '/app/goals',
            });
          }

          return {
            ...g,
            savedAmount: newSaved,
            isCompleted,
            contributions: [newContribution, ...g.contributions],
          };
        }
        return g;
      })
    );
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGroups(INITIAL_GROUPS);
    setGroupExpenses(INITIAL_GROUP_EXPENSES);
    setSettlements(INITIAL_SETTLEMENTS);
    setGoals(INITIAL_SAVINGS_GOALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedMonth(9);
    setSelectedYear(2026);
  };

  // Computations for the active month/year
  const activeMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      try {
        const d = parseISO(t.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      } catch {
        return false;
      }
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalSpentThisMonth = useMemo(() => {
    return activeMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [activeMonthTransactions]);

  const totalIncomeThisMonth = useMemo(() => {
    return activeMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [activeMonthTransactions]);

  const dailyAverageThisMonth = useMemo(() => {
    // Unique spending days or current day of month
    const daysInMonth = 31;
    return totalSpentThisMonth > 0 ? Math.round(totalSpentThisMonth / daysInMonth) : 0;
  }, [totalSpentThisMonth]);

  const remainingBudgetThisMonth = useMemo(() => {
    return Math.max(0, user.monthlyBudget - totalSpentThisMonth);
  }, [user.monthlyBudget, totalSpentThisMonth]);

  const categorySpendingThisMonth = useMemo(() => {
    const mapping: Record<Category, number> = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Subscriptions: 0,
      Utilities: 0,
      Entertainment: 0,
      Academics: 0,
      Health: 0,
      Other: 0,
    };
    activeMonthTransactions.forEach(t => {
      if (t.type === 'expense') {
        mapping[t.category] = (mapping[t.category] || 0) + t.amount;
      }
    });
    return mapping;
  }, [activeMonthTransactions]);

  // Net Group Balances for the logged-in user
  const netGroupBalance = useMemo(() => {
    let toReceive = 0;
    let toPay = 0;

    groupExpenses.forEach(exp => {
      if (exp.paidBy === user.id) {
        // User paid: other participants who haven't paid owe user
        exp.participants.forEach(p => {
          if (p.userId !== user.id && !p.isPaid) {
            toReceive += p.shareAmount;
          }
        });
      } else {
        // Someone else paid: if user is a participant and haven't paid, user owes
        const myShare = exp.participants.find(p => p.userId === user.id);
        if (myShare && !myShare.isPaid) {
          toPay += myShare.shareAmount;
        }
      }
    });

    return { toReceive, toPay };
  }, [groupExpenses, user.id]);

  return (
    <FinanceContext.Provider
      value={{
        user,
        updateUser,
        members,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        groups,
        addGroup,
        updateGroup,
        deleteGroup,
        groupExpenses,
        addGroupExpense,
        updateGroupExpense,
        deleteGroupExpense,
        settlements,
        recordSettlement,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addGoalContribution,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        totalSpentThisMonth,
        totalIncomeThisMonth,
        dailyAverageThisMonth,
        remainingBudgetThisMonth,
        categorySpendingThisMonth,
        netGroupBalance,
        resetToDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

