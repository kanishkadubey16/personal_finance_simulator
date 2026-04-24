import { useState, useEffect, useContext } from 'react';
import { fetchProfile, updateProfile } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [investments, setInvestments] = useState('');
  const [baseMonthlyExpenses, setBaseMonthlyExpenses] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { handleAuthError } = useContext(AuthContext);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      if (!data.error) {
        // We initialize with the values from DB, but allow them to be empty if they don't exist
        setIncome(data.income || '');
        setSavings(data.savings || '');
        setInvestments(data.investments || '');
        setBaseMonthlyExpenses(data.baseMonthlyExpenses || '');
      }
    } catch (err) {
      toast.error('Failed to load profile');
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert to Number on submission
      await updateProfile({ 
        income: Number(income), 
        savings: Number(savings), 
        investments: Number(investments), 
        baseMonthlyExpenses: Number(baseMonthlyExpenses) 
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
      handleAuthError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Profile Settings</h1>
      <div className="glass-panel">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Monthly Income (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 50000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Savings Balance (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 100000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Investments (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 25000"
              value={investments}
              onChange={(e) => setInvestments(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Monthly Budget (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 30000"
              value={baseMonthlyExpenses}
              onChange={(e) => setBaseMonthlyExpenses(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
