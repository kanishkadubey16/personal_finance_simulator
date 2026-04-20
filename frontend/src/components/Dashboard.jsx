import { useEffect, useState } from 'react';
import { fetchProfile, fetchExpenses, addExpense, fetchGoals, addGoal, deleteGoal, updateGoal } from '../api';
import { Wallet, PiggyBank, Receipt, AlertTriangle, Plus, Target, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

  // Expense Form State
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Goal Form State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Editing State
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalTarget, setEditGoalTarget] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchProfile().then(setProfile).catch(console.error);
    fetchExpenses().then(setExpenses).catch(console.error);
    fetchGoals().then(setGoals).catch(console.error);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsAddingExp(true);
    try {
      const data = await addExpense({ amount: Number(expAmount), category: expCategory || 'Other', description: expDesc });
      if (data.error) throw new Error(data.error);
      toast.success('Expense added successfully!');
      setExpAmount('');
      setExpCategory('');
      setExpDesc('');
      loadData();
    } catch (err) {
      toast.error('Failed to add expense.');
    } finally {
      setIsAddingExp(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setIsAddingGoal(true);
    try {
      const data = await addGoal({ name: goalName, targetAmount: Number(goalTarget) });
      if (data.error) throw new Error(data.error);
      toast.success('Goal saved!');
      setGoalName('');
      setGoalTarget('');
      loadData();
    } catch (err) {
      toast.error('Failed to add goal.');
    } finally {
      setIsAddingGoal(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      const data = await deleteGoal(id);
      if (data.error) throw new Error(data.error);
      toast.success('Goal deleted!');
      loadData();
    } catch (err) {
      toast.error('Failed to delete goal.');
    }
  };

  const startEditingGoal = (goal) => {
    setEditingGoalId(goal._id);
    setEditGoalName(goal.name);
    setEditGoalTarget(goal.targetAmount);
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
  };

  const handleUpdateGoal = async (id) => {
    try {
      const data = await updateGoal(id, { name: editGoalName, targetAmount: Number(editGoalTarget) });
      if (data.error) throw new Error(data.error);
      toast.success('Goal updated!');
      setEditingGoalId(null);
      loadData();
    } catch (err) {
      toast.error('Failed to update goal.');
    }
  };

  if (!profile) return <p>Loading dashboard...</p>;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const isOverspending = totalExpenses > profile.baseMonthlyExpenses;
  const currentSavings = Number(profile.savings) || 0;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Financial Overview</h1>
      
      {isOverspending && (
        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--danger)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertTriangle color="var(--danger)" />
          <span><strong style={{color: 'var(--danger)'}}>Risk Alert:</strong> You are overspending this month. Total expenses (₹{totalExpenses}) exceed your estimated budget (₹{profile.baseMonthlyExpenses}).</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-cols-3">
        <div className="glass-panel flex-row">
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Wallet color="var(--accent-primary)" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Monthly Income</p>
            <h2 style={{ margin: 0 }}>₹{profile.income?.toLocaleString()}</h2>
          </div>
        </div>

        <div className="glass-panel flex-row">
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <PiggyBank color="var(--accent-secondary)" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Current Savings</p>
            <h2 style={{ margin: 0 }}>₹{currentSavings.toLocaleString()}</h2>
          </div>
        </div>

        <div className="glass-panel flex-row">
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Receipt color="var(--danger)" />
          </div>
          <div>
             <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Tracked Expenses</p>
             <h2 style={{ margin: 0 }}>₹{totalExpenses.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginTop: '2rem', gap: '2rem' }}>
        {/* Tracker Section */}
        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 className="flex-row" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><Plus size={20} color="var(--accent-primary)" /> Record Expense</h2>
            <form onSubmit={handleAddExpense} className="flex-row" style={{ flexWrap: 'wrap' }}>
              <input type="number" placeholder="₹ Amount" className="input-field" value={expAmount} onChange={e=>setExpAmount(e.target.value)} required style={{ marginBottom: 0, flex: '1 1 30%' }} />
              <input type="text" placeholder="Category (e.g. Sushi)" className="input-field" value={expCategory} onChange={e=>setExpCategory(e.target.value)} required style={{ marginBottom: 0, flex: '1 1 30%' }} />
              <input type="text" placeholder="Description" className="input-field" value={expDesc} onChange={e=>setExpDesc(e.target.value)} required style={{ marginBottom: 0, flex: '1 1 100%' }} />
              <button type="submit" className="btn" disabled={isAddingExp} style={{ width: '100%' }}>{isAddingExp ? '...' : 'Add Expense'}</button>
            </form>
          </div>

          <h2>Recent Expenses</h2>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            {expenses.length === 0 ? (
               <p style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>No expenses recorded yet.</p>
            ) : (
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Description</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map(e => (
                    <tr key={e._id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>{new Date(e.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        {e.description}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{e.category}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--danger)' }}>-₹{e.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
             <h2 className="flex-row" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><Target size={20} color="var(--accent-secondary)" /> Add Financial Goal</h2>
             <form onSubmit={handleAddGoal} className="flex-row">
               <input type="text" placeholder="Goal Name (e.g. Dream Car)" className="input-field" value={goalName} onChange={e=>setGoalName(e.target.value)} required style={{ marginBottom: 0, flex: 2 }} />
               <input type="number" placeholder="Target ₹" className="input-field" value={goalTarget} onChange={e=>setGoalTarget(e.target.value)} required style={{ marginBottom: 0, flex: 1 }} />
               <button type="submit" className="btn" disabled={isAddingGoal}>{isAddingGoal ? '...' : 'Save'}</button>
             </form>
          </div>

          <h2>Goal Tracker</h2>
          {goals.length === 0 ? (
            <p className="text-muted">You have no active goals.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {goals.map(goal => {
                const target = Number(goal.targetAmount) || 1;
                const isAchieved = currentSavings >= target;
                let progressPercent = isAchieved ? 100 : Math.round((currentSavings / target) * 100);
                progressPercent = Math.max(0, Math.min(100, progressPercent));
                const isEditing = editingGoalId === goal._id;
                
                return (
                  <div key={goal._id} className="glass-panel" style={{ padding: '1rem', position: 'relative' }}>
                    {isEditing ? (
                      <div className="flex-row" style={{ marginBottom: '1rem' }}>
                        <input type="text" className="input-field" value={editGoalName} onChange={e=>setEditGoalName(e.target.value)} style={{ marginBottom: 0, flex: 2 }}/>
                        <input type="number" className="input-field" value={editGoalTarget} onChange={e=>setEditGoalTarget(e.target.value)} style={{ marginBottom: 0, flex: 1 }}/>
                        <button className="btn" onClick={() => handleUpdateGoal(goal._id)} style={{ padding: '0.5rem 1rem' }}>Save</button>
                        <button className="btn btn-danger" onClick={cancelEdit} style={{ padding: '0.5rem 1rem' }}>X</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '500' }}>{goal.name}</span>
                          <div className="flex-row" style={{ gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', color: "var(--text-muted)", marginRight: '0.5rem' }}>
                              ₹{currentSavings.toLocaleString()} / ₹{target.toLocaleString()}
                            </span>
                            <button onClick={() => startEditingGoal(goal)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteGoal(goal._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${progressPercent}%`, 
                            background: isAchieved ? 'var(--success)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: isAchieved ? 'var(--success)' : 'var(--text-muted)', textAlign: 'right' }}>
                          {isAchieved ? 'Goal reached!' : `${progressPercent}% Achieved`}
                        </p>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
