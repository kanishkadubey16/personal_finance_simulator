import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Sparkles, LogOut } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const getStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: location.pathname === path ? 'var(--accent-primary)' : 'var(--text-main)',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? '600' : '400',
    transition: 'color 0.3s ease'
  });

  return (
    <nav className="glass-panel flex-between" style={{ padding: '1rem 2rem' }}>
      <h2 className="gradient-text" style={{ margin: 0 }}>FinSight</h2>
      <div className="flex-row" style={{ gap: '2rem' }}>
        {user ? (
          <>
            <Link to="/" style={getStyle('/')}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/simulator" style={getStyle('/simulator')}>
              <TrendingUp size={18} />
              Simulator
            </Link>
            <Link to="/advisor" style={getStyle('/advisor')}>
              <Sparkles size={18} />
              AI Advisor
            </Link>
            <Link to="/settings" style={getStyle('/settings')}>
              Settings
            </Link>
            <button 
              onClick={logout} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--danger)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={getStyle('/login')}>Login</Link>
            <Link to="/signup" className="btn" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
