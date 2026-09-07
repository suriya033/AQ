import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const { loginAdmin, isLoggedIn, showToast } = useSalon();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid credentials.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@beautysalon.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--accent-nude)',
          padding: '40px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-bronze) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Admin Portal Login
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Sign in to manage salon bookings, services, and settings
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="admin@beautysalon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Hint */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EEE', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Testing credentials:
          </span>
          <button
            onClick={fillDemoAdmin}
            style={{
              fontSize: '0.82rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              background: 'var(--accent-gold-light)',
              border: '1px dashed var(--accent-gold)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            ✨ Click to Auto-fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
