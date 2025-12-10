export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Frequency {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY'
}

export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Travel & Commute',
  RENT = 'Rent & Utilities',
  SHOPPING = 'Shopping',
  UPI = 'UPI & Transfers',
  ENTERTAINMENT = 'Entertainment',
  EDUCATION = 'Coaching & Books',
  HEALTH = 'Health & Fitness',
  INVESTMENT = 'Investment',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  POCKET_MONEY = 'Pocket Money',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO Date string
  note: string;
}

export interface Subscription {
  id: string;
  name: string; // e.g., Netflix, Gym
  amount: number;
  frequency: Frequency;
  nextDueDate: string; // ISO Date string
  category: string;
  isActive: boolean;
}

export interface Goal {
  id: string;
  name: string; // e.g., New iPhone
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface AppState {
  transactions: Transaction[];
  subscriptions: Subscription[];
  goals: Goal[];
}