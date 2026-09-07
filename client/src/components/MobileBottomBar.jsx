import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Phone, MessageSquare, Calendar } from 'lucide-react';

const MobileBottomBar = () => {
  const { settings, openBookingModal, buildWhatsAppLink } = useSalon();

  return (
    <div
      className="mobile-bottom-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 990,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--accent-nude)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        padding: '10px 16px',
        display: 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <a
        href={`tel:${settings.phone}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: '#F5F5F5',
          color: 'var(--text-primary)',
          fontSize: '0.75rem',
          fontWeight: 600,
          textDecoration: 'none'
        }}
      >
        <Phone size={18} style={{ color: 'var(--accent-gold)' }} />
        <span>Call Salon</span>
      </a>

      <a
        href={buildWhatsAppLink("Hello! I would like to book an appointment.")}
        target="_blank"
        rel="noreferrer"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
          fontSize: '0.75rem',
          fontWeight: 600,
          textDecoration: 'none'
        }}
      >
        <MessageSquare size={18} style={{ color: '#25D366' }} />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={() => openBookingModal()}
        style={{
          flex: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '12px 14px',
          borderRadius: '25px',
          background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-hover) 100%)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: 'var(--shadow-gold)'
        }}
      >
        <Calendar size={16} /> Book Now
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-bar {
            display: flex !important;
          }
          body {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileBottomBar;
