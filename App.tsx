import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import AddTransaction from './pages/AddTransaction';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import { loadState, saveState } from './services/storageService';
import { AppState, Transaction, Subscription, Goal } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(loadState());

  // Save to local storage whenever data changes
  useEffect(() => {
    saveState(data);
  }, [data]);

  const addTransaction = (transaction: Transaction) => {
    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, transaction]
    }));
  };

  const addSubscription = (sub: Subscription) => {
    setData(prev => ({
      ...prev,
      subscriptions: [...prev.subscriptions, sub]
    }));
  };

  const toggleSubscription = (id: string) => {
    setData(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.map(s => 
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    }));
  };

  const addGoal = (goal: Goal) => {
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));
  };

  const updateGoal = (updatedGoal: Goal) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard data={data} />} />
          <Route path="/subscriptions" element={
            <Subscriptions 
              data={data} 
              onAddSub={addSubscription} 
              onToggleSub={toggleSubscription} 
            />
          } />
          <Route path="/add" element={<AddTransaction onAdd={addTransaction} />} />
          <Route path="/goals" element={
            <Goals 
              data={data} 
              onAddGoal={addGoal} 
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
            />
          } />
          <Route path="/insights" element={<Insights data={data} />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;