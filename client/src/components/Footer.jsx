import React from 'react';
import { Link } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, MessageSquare } from 'lucide-react';

const Footer = () => {
  const { settings, buildWhatsAppLink } = useSalon();

  return (
    <footer style={{ background: '#111111', color: '#B0B0B0', paddingTop: '70px', paddingBottom: '30px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          {/* Column 1: Salon Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF'
                }}
              >
                <Scissors size={20} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>{settings.salonName}</h3>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '24px', color: '#999999' }}>
              Experience state-of-the-art unisex hair design, rejuvenating facial therapies, precision beard sculpting, and bridal makeover rituals crafted by industry leading stylists.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '20px', position: 'relative' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ hover: { color: 'var(--accent-gold)' } }}>Home</Link></li>
              <li><Link to="/about">About Salon & Experts</Link></li>
              <li><Link to="/services">Services & Pricing</Link></li>
              <li><Link to="/gallery">Photo Gallery</Link></li>
              <li><Link to="/admin/login">Admin Dashboard Access</Link></li>
            </ul>
          </div>

          {/* Column 3: Service Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '20px' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/services?cat=Hair">Hair Styling & Keratin</Link></li>
              <li><Link to="/services?cat=Skin">Facials & Skincare</Link></li>
              <li><Link to="/services?cat=Grooming">Beard Sculpting & Shave</Link></li>
              <li><Link to="/services?cat=Beauty">Bridal & Party Makeup</Link></li>
              <li><Link to="/services?cat=Beauty">Spa Manicure & Pedicure</Link></li>
            </ul>
          </div>

          {/* Column 4: Salon Contact & Opening Hours */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '20px' }}>
              Visit & Contact Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.address}</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MessageSquare size={18} style={{ color: '#25D366', flexShrink: 0 }} />
                <a href={buildWhatsAppLink("Hello! I would like to inquire about your services.")} target="_blank" rel="noreferrer">
                  WhatsApp: {settings.whatsapp}
                </a>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>{settings.openingHours} - {settings.closingHours} ({settings.holidays?.join(', ')} Closed)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #222', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#777' }}>
          <p>© {new Date().getFullYear()} {settings.salonName}. All rights reserved.</p>
          <p>Crafted for Unisex Beauty Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
