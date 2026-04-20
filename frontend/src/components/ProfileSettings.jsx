import { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../api';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const [income, setIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [baseMonthlyExpenses, setBaseMonthlyExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      if (!data.error) {
        setIncome(data.income || 0);
        setSavings(data.savings || 0);
        setInvestments(data.investments || 0);
        setBaseMonthlyExpenses(data.baseMonthlyExpenses || 0);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ income, savings, investments, baseMonthlyExpenses });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
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
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Savings Balance (₹)</label>
            <input
              type="number"
              className="input-field"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Investments (₹)</label>
            <input
              type="number"
              className="input-field"
              value={investments}
              onChange={(e) => setInvestments(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Monthly Budget (₹)</label>
            <input
              type="number"
              className="input-field"
              value={baseMonthlyExpenses}
              onChange={(e) => setBaseMonthlyExpenses(Number(e.target.value))}
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
