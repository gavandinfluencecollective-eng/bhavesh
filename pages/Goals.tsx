import React, { useState } from 'react';
import { AppState, Goal } from '../types';

interface GoalsProps {
  data: AppState;
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ data, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');

  const resetForm = () => {
    setName('');
    setTarget('');
    setCurrent('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (goal: Goal) => {
    setName(goal.name);
    setTarget(goal.targetAmount.toString());
    setCurrent(goal.currentAmount.toString());
    setEditingId(goal.id);
    setShowForm(true);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleForm = () => {
    if (showForm) {
      resetForm();
    } else {
      setShowForm(true);
    }
  };

  const handleDelete = () => {
    if (editingId && window.confirm('Are you sure you want to delete this goal?')) {
      onDeleteGoal(editingId);
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && target) {
      if (editingId) {
        // Edit Mode
        const existingGoal = data.goals.find(g => g.id === editingId);
        if (existingGoal) {
          onUpdateGoal({
            ...existingGoal,
            name,
            targetAmount: Number(target),
            currentAmount: Number(current) || 0,
          });
        }
      } else {
        // Add Mode
        onAddGoal({
          id: Date.now().toString(),
          name,
          targetAmount: Number(target),
          currentAmount: Number(current) || 0,
          deadline: new Date(Date.now() + 86400000 * 90).toISOString() // Default 3 months
        });
      }
      resetForm();
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
        <button 
          onClick={toggleForm}
          className={`text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl shadow-md transition-colors ${showForm ? 'bg-gray-400' : 'bg-brand-500'}`}
        >
          {showForm ? '×' : '+'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-500">{editingId ? 'Edit Goal' : 'New Goal'}</h3>
          </div>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Goal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. New Phone" 
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                  value={name} onChange={e => setName(e.target.value)} required
                />
             </div>
            <div className="flex gap-4">
               <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Target Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="20000" 
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                    value={target} onChange={e => setTarget(e.target.value)} required
                  />
               </div>
               <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Already Saved (₹)</label>
                  <input 
                    type="number" 
                    placeholder="5000" 
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-brand-500"
                    value={current} onChange={e => setCurrent(e.target.value)} 
                  />
               </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-brand-600 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-brand-700">
                {editingId ? 'Update Goal' : 'Create Goal'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-lg font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {data.goals.length === 0 && !showForm && (
          <div className="text-center py-10 text-gray-400">
            <p>No goals set yet.</p>
            <p className="text-xs mt-2">Saving for a bike? A trip?</p>
          </div>
        )}

        {data.goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div 
              key={goal.id} 
              onClick={() => handleEditClick(goal)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{goal.name}</h3>
                  <p className="text-xs text-gray-500">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-brand-600">{progress}%</p>
                   <p className="text-[10px] text-gray-400">₹{goal.currentAmount} saved</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Goals;