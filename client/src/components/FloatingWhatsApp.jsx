import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const FloatingWhatsApp = () => {
  const { settings, buildWhatsAppLink } = useSalon();
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const finalMsg = userMsg.trim()
      ? `Hello ${settings.salonName}, ${userMsg}`
      : `Hello ${settings.salonName}, I would like to inquire about appointment availability.`;
    
    window.open(buildWhatsAppLink(finalMsg), '_blank');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '90px', right: '24px', zIndex: 995 }}>
      {/* Quick Chat Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
            border: '1px solid var(--accent-nude)',
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease'
          }}
        >
          {/* Popup Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)',
              color: '#FFFFFF',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FFF', padding: '2px' }}>
                <img
                  src={settings.logo || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80'}
                  alt="Salon Logo"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h4 style={{ color: '#FFF', fontSize: '0.95rem', margin: 0 }}>{settings.salonName}</h4>
                <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>Typically replies instantly</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#FFF', opacity: 0.8 }} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Chat Content Body */}
          <div style={{ padding: '18px', background: '#E5DDD5', minHeight: '130px' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '0.88rem',
                color: '#111',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '88%'
              }}
            >
              <p style={{ margin: 0, fontWeight: 500 }}>
                Hi there! 👋 How can we assist you with your salon session or booking today?
              </p>
              <span style={{ fontSize: '0.68rem', color: '#888', display: 'block', marginTop: '6px', textAlign: 'right' }}>
                Just now
              </span>
            </div>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} style={{ padding: '12px', display: 'flex', gap: '8px', background: '#F0F0F0' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '20px',
                border: '1px solid #DDD',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#25D366',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="Send message via WhatsApp"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className="pulse-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          border: 'none',
          cursor: 'pointer',
          transition: 'var(--transition-normal)'
        }}
        aria-label="Open WhatsApp Chat"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
