import { useState } from 'react';
import { fetchAdvice } from '../api';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

export default function AIAdvisor() {
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdvice();
      if (data.error) throw new Error(data.error);
      setAdvice(data.advice || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="flex-row">
        <Sparkles color="var(--accent-secondary)" />
        AI Financial Advisor
      </h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Get personalized, intelligent financial advice based on your current profile, goals, and spending habits.
      </p>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <Bot size={48} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>Analyze My Finances</h2>
        <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
          Our AI engine will review your income, expenses, and savings to provide you with 3 actionable tips to improve your financial health.
        </p>

        <button 
          className="btn" 
          onClick={handleGetAdvice} 
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Analyzing Data...</>
          ) : (
            <><Sparkles size={20} /> Give Me Advice</>
          )}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
          Error: {error}
        </div>
      )}

      {advice.length > 0 && (
        <div className="animate-fade-in" style={{ marginTop: '3rem' }}>
          <h2>Your Recommendations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {advice.map((tip, index) => (
              <div key={index} className="glass-panel flex-row" style={{ alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ paddingTop: '5px' }}>
                  <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
