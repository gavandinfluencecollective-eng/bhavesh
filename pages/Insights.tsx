import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AppState, TransactionType } from '../types';
import { generateFinancialInsights } from '../services/geminiService';

interface InsightsProps {
  data: AppState;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Insights: React.FC<InsightsProps> = ({ data }) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Group Expenses by Category
  const chartData = useMemo(() => {
    const expenses = data.transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(t => {
      if (categoryMap[t.category]) {
        categoryMap[t.category] += t.amount;
      } else {
        categoryMap[t.category] = t.amount;
      }
    });

    return Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));
  }, [data.transactions]);

  const fetchInsights = async () => {
    setLoadingAi(true);
    const text = await generateFinancialInsights(data);
    setAiInsight(text);
    setLoadingAi(false);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Spending Insights</h1>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 text-center">Where your money went</h3>
        <div className="h-64 w-full">
           {chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-gray-400 text-sm">No expense data yet</div>
           )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              {entry.name}
            </div>
          ))}
        </div>
      </div>

      {/* AI Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
             <span className="text-xl">🤖</span>
             <h3 className="font-bold text-indigo-900">AI Financial Coach</h3>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={loadingAi}
            className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-indigo-100 disabled:opacity-50"
          >
            {loadingAi ? 'Thinking...' : 'Analyze Now'}
          </button>
        </div>
        
        <div className="min-h-[100px] text-sm text-indigo-800 leading-relaxed whitespace-pre-line">
          {aiInsight ? (
            aiInsight
          ) : (
            <p className="opacity-60 italic">Tap "Analyze Now" to get personalized tips based on your spending habits.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;