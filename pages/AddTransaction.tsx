import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction, TransactionType, Category } from '../types';

interface AddTransactionProps {
  onAdd: (t: Transaction) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
      note
    });

    navigate('/');
  };

  const categories = Object.values(Category);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New</h1>
        <button onClick={() => navigate('/')} className="text-gray-400 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        <button 
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
          onClick={() => setType(TransactionType.EXPENSE)}
        >
          Expense
        </button>
        <button 
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.INCOME ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
          onClick={() => setType(TransactionType.INCOME)}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-8 py-3 text-3xl font-bold border-b border-gray-200 focus:outline-none focus:border-brand-500 bg-transparent"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${category === cat ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-500 mb-2">Note (Optional)</label>
           <input 
             type="text"
             value={note}
             onChange={(e) => setNote(e.target.value)}
             placeholder="What was this for?"
             className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500 bg-transparent"
           />
        </div>

        <button 
          type="submit" 
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg mt-4 ${type === TransactionType.EXPENSE ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          Save {type === TransactionType.EXPENSE ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;