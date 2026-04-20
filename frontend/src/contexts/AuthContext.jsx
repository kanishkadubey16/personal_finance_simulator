import { createContext, useState, useEffect } from 'react';
import { fetchMe } from '../api';
import { Lock } from 'lucide-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const data = await fetchMe();
          if (data && !data.error) {
            setUser(data);
          } else {
            localStorage.removeItem('userInfo');
          }
        } catch (err) {
          localStorage.removeItem('userInfo');
        }
      }
      // Added a slight artificial delay so the user "feels" the security check
      setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-main)'
      }}>
        <div className="animate-pulse" style={{ textAlign: 'center' }}>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '50%', 
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            <Lock size={40} color="var(--accent-primary)" />
          </div>
          <h2 className="gradient-text">FinSight</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Securing your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
