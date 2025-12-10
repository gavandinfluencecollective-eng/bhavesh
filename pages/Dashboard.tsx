import React, { useMemo } from 'react';
import { AppState, TransactionType } from '../types';

interface DashboardProps {
  data: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter transactions for current month
  const monthlyTransactions = useMemo(() => {
    return data.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [data.transactions, currentMonth, currentYear]);

  const totalIncome = monthlyTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const activeSubscriptions = data.subscriptions.filter(s => s.isActive);
  const monthlySubCost = activeSubscriptions.reduce((acc, curr) => {
    // Basic calculation: if yearly, divide by 12
    return acc + (curr.frequency === 'YEARLY' ? curr.amount / 12 : curr.amount);
  }, 0);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Namaste! 🙏</h1>
        <p className="text-gray-500">Here's your money summary for {new Date().toLocaleString('default', { month: 'long' })}.</p>
      </header>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-900 rounded-2xl p-6 text-white shadow-xl mb-6">
        <p className="text-brand-100 text-sm font-medium mb-1">Available Balance (Est.)</p>
        <h2 className="text-4xl font-bold mb-6">{formatINR(balance)}</h2>
        
        <div className="flex justify-between items-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-1 text-brand-100 text-xs mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Income
            </div>
            <p className="font-semibold">{formatINR(totalIncome)}</p>
          </div>
          <div className="w-px h-8 bg-brand-100/20"></div>
          <div className="text-right">
             <div className="flex items-center gap-1 justify-end text-brand-100 text-xs mb-1">
              Expense
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
            </div>
            <p className="font-semibold">{formatINR(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Subscription Alert */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Subscription Impact</h3>
          <p className="text-xs text-gray-600 mt-1">
            You are committing approx <strong>{formatINR(monthlySubCost)}/mo</strong> to {activeSubscriptions.length} active subscriptions.
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        </div>

        <div className="space-y-3">
          {monthlyTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-300">
              No transactions yet. <br/> Tap "+" to add one!
            </div>
          ) : (
            monthlyTransactions.slice().reverse().slice(0, 5).map((t) => (
              <div key={t.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === TransactionType.INCOME ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.type === TransactionType.INCOME ? '💰' : '💸'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.category}</p>
                    <p className="text-xs text-gray-500">{t.note || t.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatINR(t.amount)}
                  </p>
                  <p className="text-[10px] text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;