import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSalon } from '../context/SalonContext';
import { Search, Clock, Calendar, Filter, Sparkles } from 'lucide-react';

const Services = () => {
  const { services, openBookingModal } = useSalon();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL query parameters (e.g. /services?cat=Hair or /services?gender=Male)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    const genParam = params.get('gender');

    if (catParam) setActiveCategory(catParam);
    if (genParam) setActiveGender(genParam);
  }, [location.search]);

  const categories = ['All', 'Hair', 'Skin', 'Grooming', 'Beauty'];
  const genders = ['All', 'Unisex', 'Male', 'Female'];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = activeCategory === 'All' || srv.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesGender = activeGender === 'All' || srv.gender === 'Unisex' || srv.gender.toLowerCase() === activeGender.toLowerCase();
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesGender && matchesSearch;
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <section style={{ background: 'var(--bg-secondary)', padding: '70px 0 50px 0', borderBottom: '1px solid var(--accent-nude)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">Comprehensive Care</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Services & Pricing Menu</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Browse our full catalog of hair treatments, facial therapies, beard art, and bridal transformations.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '520px', margin: '30px auto 0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search services (e.g. Keratin, Gold Facial, Fade Cut)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '48px',
                borderRadius: '50px',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '1rem'
              }}
            />
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section style={{ padding: '24px 0', background: '#FFFFFF', borderBottom: '1px solid #EEE' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: activeCategory === cat ? 'none' : '1px solid var(--accent-nude)',
                  background: activeCategory === cat ? 'var(--accent-gold)' : 'transparent',
                  color: activeCategory === cat ? '#FFFFFF' : 'var(--text-primary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Gender:</span>
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  border: activeGender === g ? '1px solid var(--accent-bronze)' : '1px solid #E0E0E0',
                  background: activeGender === g ? 'var(--accent-gold-light)' : '#F9F9F9',
                  color: activeGender === g ? 'var(--accent-bronze)' : '#666'
                }}
              >
                {g}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* SERVICE CARDS GRID */}
      <section className="section-padding">
        <div className="container">
          {filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No services found matching your filters.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveGender('All');
                  setSearchQuery('');
                }}
                style={{ marginTop: '16px' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {filteredServices.map((srv) => (
                <div key={srv._id || srv.name} className="salon-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '230px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={srv.image}
                      alt={srv.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: 'var(--accent-gold)', color: '#FFF', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {srv.category}
                      </span>
                      <span style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', color: '#FFF', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {srv.gender}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{srv.name}</h3>
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-bronze)' }}>₹{srv.price}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                        {srv.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--accent-nude)', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={15} /> {srv.duration} mins
                      </span>
                      <button className="btn-primary btn-sm" onClick={() => openBookingModal(srv)}>
                        <Calendar size={15} /> Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
