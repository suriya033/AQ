import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import { Scissors, Calendar, Menu, X, ShieldCheck, Phone, MessageSquare, Sparkles, Clock, Lock } from 'lucide-react';

const Header = () => {
  const { settings, openBookingModal, isLoggedIn, adminUser, buildWhatsAppLink } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled status for elevation shadow & padding
      setScrolled(currentScrollY > 20);

      // Hide header when scrolling down past 70px, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(253, 251, 247, 0.97)' : 'rgba(253, 251, 247, 0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(197, 160, 89, 0.25)' : '1px solid rgba(232, 213, 196, 0.4)',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)'
      }}
    >
      {/* Top Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #141414 0%, #222222 100%)',
          color: '#E8D5C4',
          fontSize: '0.78rem',
          padding: '6px 0',
          borderBottom: '1px solid rgba(197, 160, 89, 0.2)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              <Sparkles size={13} /> Luxe Unisex Salon & Spa
            </span>
            <span style={{ color: '#444' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#BBB' }}>
              <Clock size={12} style={{ color: 'var(--accent-gold)' }} />
              Open Daily: {settings.openingHours} - {settings.closingHours}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <a
              href={`tel:${settings.phone}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#E8D5C4', transition: 'color 0.2s ease' }}
              className="topbar-link"
            >
              <Phone size={12} style={{ color: 'var(--accent-gold)' }} /> {settings.phone}
            </a>

            <a
              href={buildWhatsAppLink("Hello! I have an inquiry regarding your salon services.")}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366',
                padding: '2px 10px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageSquare size={12} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: scrolled ? '72px' : '82px',
          transition: 'height 0.3s ease'
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C5A059 0%, #9E7938 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.6)'
            }}
          >
            <Scissors size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
              {settings.salonName}
            </h1>
            <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', fontWeight: 600, margin: '2px 0 0 0' }}>
              {settings.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
          <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
            Services
          </Link>
          <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>
            Gallery
          </Link>

          {isLoggedIn ? (
            <Link
              to="/admin/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent-gold-light)',
                color: 'var(--accent-bronze)',
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid rgba(197, 160, 89, 0.4)',
                textDecoration: 'none'
              }}
            >
              <ShieldCheck size={15} /> Admin Portal ({adminUser?.name || 'Admin'})
            </Link>
          ) : (
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'background 0.2s ease'
              }}
              className="admin-login-link"
            >
              <Lock size={13} /> Admin
            </Link>
          )}

          <button
            className="btn-primary"
            onClick={() => openBookingModal()}
            style={{
              padding: '10px 22px',
              fontSize: '0.88rem',
              borderRadius: '50px',
              boxShadow: 'var(--shadow-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={17} /> Book Appointment
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-nude)',
            borderRadius: '8px',
            padding: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderBottom: '1px solid var(--accent-nude)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: isActive('/') ? 700 : 500, color: isActive('/') ? 'var(--accent-gold)' : 'var(--text-primary)', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: isActive('/about') ? 700 : 500, color: isActive('/about') ? 'var(--accent-gold)' : 'var(--text-primary)', textDecoration: 'none' }}>
            About Us
          </Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: isActive('/services') ? 700 : 500, color: isActive('/services') ? 'var(--accent-gold)' : 'var(--text-primary)', textDecoration: 'none' }}>
            Services
          </Link>
          <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: isActive('/gallery') ? 700 : 500, color: isActive('/gallery') ? 'var(--accent-gold)' : 'var(--text-primary)', textDecoration: 'none' }}>
            Gallery
          </Link>
          
          {isLoggedIn ? (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-gold)', textDecoration: 'none' }}>
              Admin Dashboard ({adminUser?.name || 'Admin'})
            </Link>
          ) : (
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Admin Login
            </Link>
          )}

          <div style={{ paddingTop: '16px', borderTop: '1px solid #EEE' }}>
            <button
              className="btn-primary"
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '50px' }}
            >
              <Calendar size={18} /> Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* Styled CSS for Nav links */}
      <style>{`
        .nav-link {
          font-size: 0.93rem;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          position: relative;
          padding: 6px 0;
          transition: color 0.25s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-bronze));
          transition: width 0.25s ease;
          border-radius: 2px;
        }

        .nav-link:hover {
          color: var(--accent-gold);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active {
          color: var(--accent-gold);
          font-weight: 700;
        }

        .nav-link.active::after {
          width: 100%;
        }

        .topbar-link:hover {
          color: var(--accent-gold) !important;
        }

        .admin-login-link:hover {
          background: rgba(0,0,0,0.04) !important;
          color: var(--accent-gold) !important;
        }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
