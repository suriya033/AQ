import React from 'react';
import { useSalon } from '../context/SalonContext';
import { ShieldCheck, Award, Heart, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

const AboutUs = () => {
  const { settings, openBookingModal } = useSalon();

  const stylists = [
    {
      name: 'Julian Vance',
      role: 'Master Creative Director & Hair Specialist',
      experience: '12+ Years Experience',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Aisha Kapoor',
      role: 'Senior Aesthetician & Skin Therapist',
      experience: '9+ Years Experience',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Rayan D’Souza',
      role: 'Gentlemen’s Grooming & Beard Sculpting Expert',
      experience: '8+ Years Experience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <section style={{ background: 'var(--bg-secondary)', padding: '70px 0', borderBottom: '1px solid var(--accent-nude)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">Discover Our Legacy</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>About {settings.salonName}</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            A premier sanctuary designed to deliver world-class unisex haircutting, skin therapy, beard art, and bridal rituals.
          </p>
        </div>
      </section>

      {/* STORY & PHILOSOPHY */}
      <section className="section-padding">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <span className="section-subtitle">Our Philosophy</span>
            <h2 className="section-title" style={{ fontSize: '2.4rem' }}>Redefining Salon Care into Luxury Art</h2>
            <p className="section-desc" style={{ marginBottom: '20px' }}>
              Founded with a vision to break away from generic templates, {settings.salonName} blends contemporary hair aesthetics with clinical-grade skin treatments in a soothing, opulent atmosphere.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Every client receives a personalized 1-on-1 consultation to understand their hair texture, skin sensitivity, and lifestyle goals before any treatment begins.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-gold)' }} /> Personalized Hair & Scalp Diagnostics
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-gold)' }} /> 100% Ammonia-free & Organic Formulations
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-gold)' }} /> Separate Gentlemen & Ladies Comfort Zones
              </li>
            </ul>

            <button className="btn-primary" onClick={() => openBookingModal()}>
              <Calendar size={18} /> Book Your Visit
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
              alt="Salon Interior"
              style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* STYLISTS TEAM */}
      <section className="section-padding" style={{ background: '#F9F6F0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Meet Our Masters</span>
            <h2 className="section-title">Certified Stylists & Aestheticians</h2>
            <p className="section-desc">Our passionate team brings decades of global expertise to every chair.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {stylists.map((st) => (
              <div key={st.name} className="salon-card" style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px auto', border: '3px solid var(--accent-gold)' }}>
                  <img src={st.image} alt={st.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{st.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '8px' }}>{st.role}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.experience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HYGIENE & SAFETY PROTOCOLS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Sanitation Standards</span>
            <h2 className="section-title">Hygiene & Safety Commitment</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '28px', border: '1px solid var(--accent-nude)', borderRadius: '16px', background: '#FFF' }}>
              <ShieldCheck size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Autoclave Sterilization</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                All scissors, combs, and metal grooming blades undergo hospital-grade medical autoclave sterilization after every single use.
              </p>
            </div>

            <div style={{ padding: '28px', border: '1px solid var(--accent-nude)', borderRadius: '16px', background: '#FFF' }}>
              <Sparkles size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Single-Use Kits</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Single-use facial sponges, disposable towels, sanitized razor blades, and sealed manicure kits ensure zero cross-contamination.
              </p>
            </div>

            <div style={{ padding: '28px', border: '1px solid var(--accent-nude)', borderRadius: '16px', background: '#FFF' }}>
              <Heart size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Client Comfort First</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Ergonomic reclining wash chairs, ambient lighting, herbal teas, and individual private styling rooms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
