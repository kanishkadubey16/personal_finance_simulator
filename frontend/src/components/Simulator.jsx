import { useEffect, useState } from 'react';
import { fetchSimulation, fetchProfile } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sliders } from 'lucide-react';

export default function Simulator() {
  const [profile, setProfile] = useState(null);
  const [simData, setSimData] = useState(null);
  const [addedSavings, setAddedSavings] = useState(0);

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
    loadSimulation();
  }, []);

  const loadSimulation = (savingsInc = 0) => {
    fetchSimulation({ addedSavings: savingsInc })
      .then(setSimData)
      .catch(console.error);
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setAddedSavings(val);
    loadSimulation(val);
  };

  if (!profile || !simData) return <p>Loading...</p>;

  // Prepare chart data
  const chartData = [
    { name: 'Now', Savings: simData.currentSavings },
    ...simData.projections.map(p => ({
      name: `${p.months} Mo`,
      Savings: p.totalSavings
    }))
  ];

  return (
    <div>
      <h1 className="flex-row">
        <Sliders color="var(--accent-primary)" />
        Financial Simulator
      </h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Adjust your monthly savings and see what happens to your money over time.</p>

      <div className="grid-cols-2">
         {/* Controls */}
         <div className="glass-panel">
            <h2>What-If Scenarios</h2>
            
            <div style={{ margin: '2rem 0' }}>
              <label className="flex-between" style={{ marginBottom: '1rem' }}>
                <span>Increase Monthly Savings</span>
                <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>+₹{addedSavings}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="1000"
                value={addedSavings} 
                onChange={handleSliderChange}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
               <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Projected Net Savings (Monthly)</p>
               <h3>₹{simData.monthlyNet.toLocaleString()}</h3>
            </div>
         </div>

         {/* Chart */}
         <div className="glass-panel" style={{ minHeight: '300px' }}>
            <h2>Savings Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                   contentStyle={{ background: 'var(--bg-darker)', border: '1px solid var(--glass-border)' }}
                   itemStyle={{ color: 'var(--accent-primary)' }}
                />
                <Line type="monotone" dataKey="Savings" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
