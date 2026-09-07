import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Calendar, MessageSquare, Sparkles, ShieldCheck, HeartHandshake, Award, Clock, MapPin, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { settings, services, gallery, openBookingModal, buildWhatsAppLink } = useSalon();

  const popularServices = services.slice(0, 6);
  const previewGallery = gallery.slice(0, 6);

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(20,20,20,0.7) 0%, rgba(20,20,20,0.4) 100%), url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(197, 160, 89, 0.25)',
                backdropFilter: 'blur(8px)',
                color: '#E8D5C4',
                border: '1px solid var(--accent-gold)',
                padding: '6px 16px',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}
            >
              <Sparkles size={16} /> Premium Unisex Salon & Spa
            </span>

            <h1
              style={{
                fontSize: '3.6rem',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '20px',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Your Beauty.<br />
              Your Style.<br />
              <span className="text-gold">Your Confidence.</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#E0E0E0',
                lineHeight: 1.6,
                marginBottom: '36px',
                fontWeight: 300
              }}
            >
              Welcome to {settings.salonName}. Step into an oasis of luxury, precision hairstyling, revitalizing skincare, and bespoke grooming for men and women.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button className="btn-primary" onClick={() => openBookingModal()} style={{ fontSize: '1rem', padding: '16px 32px' }}>
                <Calendar size={20} /> Book Appointment
              </button>
              
              <a
                href={buildWhatsAppLink("Hello! I would like to book an appointment via WhatsApp.")}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: '1rem', padding: '16px 32px' }}
              >
                <MessageSquare size={20} /> Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO BANNER */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--accent-nude)', padding: '30px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', boxShadow: 'var(--shadow-sm)' }}>
                <Clock size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Opening Hours</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Mon - Sun: {settings.openingHours} - {settings.closingHours}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', boxShadow: 'var(--shadow-sm)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Location</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                  {settings.address}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', boxShadow: 'var(--shadow-sm)' }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>WhatsApp Direct</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {settings.whatsapp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MALE & FEMALE SERVICES HIGHLIGHTS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Tailored Styling</span>
            <h2 className="section-title">Male & Female Beauty Excellence</h2>
            <p className="section-desc">
              Whether you require precision beard sculpting, keratin transformations, anti-aging facials, or couture bridal makeovers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Gentlemen */}
            <div
              className="salon-card"
              style={{
                position: 'relative',
                height: '380px',
                backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px'
              }}
            >
              <span className="badge badge-gender" style={{ width: 'fit-content', marginBottom: '12px' }}>Grooming & Hair</span>
              <h3 style={{ color: '#FFF', fontSize: '1.8rem', marginBottom: '10px' }}>Gentlemen's Studio</h3>
              <p style={{ fontSize: '0.92rem', color: '#DDD', marginBottom: '20px' }}>
                Hot towel razor shaves, fade cuts, beard sculpting, head massage & scalp energizing treatments.
              </p>
              <Link to="/services?gender=Male" className="btn-outline-gold" style={{ width: 'fit-content' }}>
                Explore Male Services <ArrowRight size={16} />
              </Link>
            </div>

            {/* Ladies */}
            <div
              className="salon-card"
              style={{
                position: 'relative',
                height: '380px',
                backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px'
              }}
            >
              <span className="badge badge-gender" style={{ width: 'fit-content', marginBottom: '12px' }}>Beauty & Skincare</span>
              <h3 style={{ color: '#FFF', fontSize: '1.8rem', marginBottom: '10px' }}>Ladies' Luxury Lounge</h3>
              <p style={{ fontSize: '0.92rem', color: '#DDD', marginBottom: '20px' }}>
                Keratin straightening, gold facials, spa manicures, HD bridal couture & party makeup rituals.
              </p>
              <Link to="/services?gender=Female" className="btn-outline-gold" style={{ width: 'fit-content' }}>
                Explore Female Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="section-padding" style={{ background: '#F9F6F0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Signature Offerings</span>
            <h2 className="section-title">Popular Salon Services</h2>
            <p className="section-desc">Handcrafted beauty rituals designed to revitalize your look and glow.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {popularServices.map((srv) => (
              <div key={srv._id || srv.name} className="salon-card">
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={srv.image}
                    alt={srv.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                    <span style={{ background: 'var(--accent-gold)', color: '#FFF', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {srv.category}
                    </span>
                    <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#FFF', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {srv.gender}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{srv.name}</h3>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-bronze)' }}>₹{srv.price}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
                    {srv.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--accent-nude)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>⏱ {srv.duration} mins</span>
                    <button className="btn-primary btn-sm" onClick={() => openBookingModal(srv)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/services" className="btn-secondary" style={{ padding: '14px 36px' }}>
              View All Salon Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Excellence & Trust</span>
            <h2 className="section-title">Why Choose Luxe & Aura?</h2>
            <p className="section-desc">We elevate traditional parlor care into an unforgettable luxury experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#FFF', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>100% Hygiene & Safety</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Sterilized tools, disposable capes, single-use kit packets, and ultra-sanitized salon workstations.
              </p>
            </div>

            <div style={{ background: '#FFF', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Master Stylists</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Certified aesthetic experts trained in global haircut trends, keratin science, and skin therapy.
              </p>
            </div>

            <div style={{ background: '#FFF', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Organic & Premium Products</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                We use top tier dermatologically tested products free from harsh parabens and synthetic sulfates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Visual Experience</span>
            <h2 className="section-title">Salon Gallery</h2>
            <p className="section-desc">A glimpse into our luxurious interiors and recent client styling results.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {previewGallery.map((item) => (
              <div
                key={item._id || item.title}
                style={{
                  height: '260px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: '#FFF'
                  }}
                >
                  <h4 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0 }}>{item.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/gallery" className="btn-secondary">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Client Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
                "The keratin treatment was life changing! My hair has never felt so manageable and shiny. The staff is extremely polite and hygienic."
              </p>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Sneha Kapoor</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Regular Customer</span>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
                "Best beard grooming and razor lining service in town. Hot towel shave experience feels like a 5-star hotel luxury spa!"
              </p>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Vikramaditya Roy</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Grooming Enthusiast</span>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '28px', borderRadius: '16px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px', fontStyle: 'italic' }}>
                "Booked the HD Bridal Couture makeup package for my wedding day. The makeup stayed flawless all night long. Highly recommended!"
              </p>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Meera Deshmukh</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bride</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & CTA SECTION */}
      <section style={{ background: 'var(--text-primary)', color: '#FFF', padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', fontWeight: 700 }}>
              Visit Our Salon
            </span>
            <h2 style={{ color: '#FFF', fontSize: '2.4rem', margin: '16px 0 20px 0' }}>
              Ready for Your Transformation?
            </h2>
            <p style={{ color: '#BBB', lineHeight: '1.6', marginBottom: '28px', fontSize: '1rem' }}>
              Book an appointment online in seconds or chat with our front desk directly via WhatsApp. Walk-ins also welcome subject to slot availability!
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button className="btn-primary" onClick={() => openBookingModal()}>
                <Calendar size={18} /> Schedule Appointment
              </button>
              <a
                href={buildWhatsAppLink("Hello! I want to check today's appointment availability.")}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <MessageSquare size={18} /> WhatsApp Desk
              </a>
            </div>
          </div>

          <div style={{ background: '#222', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid #333' }}>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.4rem', marginBottom: '20px' }}>Contact & Hours</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: '#DDD', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>{settings.address}</span>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <Clock size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>Open Daily: {settings.openingHours} - {settings.closingHours}</span>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <CheckCircle size={20} style={{ color: '#25D366', flexShrink: 0 }} />
                <span>Weekly Closed Day: {settings.holidays?.join(', ')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
