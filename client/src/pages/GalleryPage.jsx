import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, ZoomIn, Sparkles } from 'lucide-react';

const GalleryPage = () => {
  const { gallery } = useSalon();
  const [activeCat, setActiveCat] = useState('All');
  const [activeModalImage, setActiveModalImage] = useState(null);

  const categories = ['All', 'Interior', 'Hair', 'Skin', 'Grooming', 'Beauty'];

  const filteredGallery = gallery.filter(
    (item) => activeCat === 'All' || item.category.toLowerCase() === activeCat.toLowerCase()
  );

  return (
    <div>
      {/* PAGE HEADER */}
      <section style={{ background: 'var(--bg-secondary)', padding: '70px 0 50px 0', borderBottom: '1px solid var(--accent-nude)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">Aesthetic Gallery</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Salon Showcase</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Explore our interior ambience, client transformations, and luxury spa setups.
          </p>

          {/* Category Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '30px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '8px 22px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: activeCat === cat ? 'none' : '1px solid var(--accent-nude)',
                  background: activeCat === cat ? 'var(--accent-gold)' : '#FFFFFF',
                  color: activeCat === cat ? '#FFFFFF' : 'var(--text-primary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredGallery.map((item) => (
              <div
                key={item._id || item.title}
                onClick={() => setActiveModalImage(item)}
                style={{
                  height: '280px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="salon-card"
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
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: '#FFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#FFF', fontSize: '1.15rem', margin: 0 }}>{item.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{item.category}</span>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ZoomIn size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeModalImage && (
        <div className="modal-overlay" onClick={() => setActiveModalImage(null)}>
          <div
            style={{
              maxWidth: '850px',
              width: '100%',
              background: '#000',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalImage(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: '#FFF', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '8px', zIndex: 10 }}
            >
              <X size={24} />
            </button>
            <img
              src={activeModalImage.image}
              alt={activeModalImage.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
            <div style={{ padding: '20px', background: '#111', color: '#FFF' }}>
              <h3 style={{ color: '#FFF', margin: '0 0 4px 0' }}>{activeModalImage.title}</h3>
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>{activeModalImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
