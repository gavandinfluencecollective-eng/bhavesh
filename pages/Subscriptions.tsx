import React, { useState } from 'react';
import { AppState, Subscription, Frequency, Category } from '../types';

interface SubscriptionsProps {
  data: AppState;
  onAddSub: (sub: Subscription) => void;
  onToggleSub: (id: string) => void;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ data, onAddSub, onToggleSub }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState<Partial<Subscription>>({
    name: '',
    amount: 0,
    frequency: Frequency.MONTHLY,
    category: Category.ENTERTAINMENT,
    nextDueDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSub.name && newSub.amount) {
      onAddSub({
        id: Date.now().toString(),
        name: newSub.name,
        amount: Number(newSub.amount),
        frequency: newSub.frequency as Frequency,
        category: newSub.category as Category,
        nextDueDate: new Date(newSub.nextDueDate!).toISOString(),
        isActive: true
      });
      setIsAdding(false);
      setNewSub({ name: '', amount: 0, frequency: Frequency.MONTHLY, category: Category.ENTERTAINMENT, nextDueDate: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg font-medium border border-brand-100"
        >
          {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Service Name</label>
              <input 
                type="text" 
                placeholder="Netflix, Gym, Hotstar..." 
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                value={newSub.name}
                onChange={e => setNewSub({...newSub, name: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                  value={newSub.amount || ''}
                  onChange={e => setNewSub({...newSub, amount: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Cycle</label>
                <select 
                  className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none"
                  value={newSub.frequency}
                  onChange={e => setNewSub({...newSub, frequency: e.target.value as Frequency})}
                >
                  <option value={Frequency.MONTHLY}>Monthly</option>
                  <option value={Frequency.YEARLY}>Yearly</option>
                </select>
              </div>
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Next Due Date</label>
              <input 
                type="date" 
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                value={newSub.nextDueDate}
                onChange={e => setNewSub({...newSub, nextDueDate: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold mt-2">
              Add Subscription
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {data.subscriptions.length === 0 && !isAdding && (
           <div className="text-center py-10 text-gray-400">
              <p>No subscriptions tracked yet.</p>
              <p className="text-xs mt-2">Add your OTT, Rent, or Gym.</p>
           </div>
        )}
        {data.subscriptions.map(sub => (
          <div key={sub.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${sub.isActive ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                 {sub.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">{sub.name}</h3>
                 <p className="text-xs text-gray-500">₹{sub.amount} / {sub.frequency.toLowerCase()}</p>
                 <p className="text-[10px] text-gray-400 mt-0.5">Due: {new Date(sub.nextDueDate).toLocaleDateString()}</p>
               </div>
            </div>
            <div className="flex flex-col items-end gap-2">
               <button 
                onClick={() => onToggleSub(sub.id)}
                className={`text-[10px] px-2 py-1 rounded-full font-medium ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
               >
                 {sub.isActive ? 'Active' : 'Paused'}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;