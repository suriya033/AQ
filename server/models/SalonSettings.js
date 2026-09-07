const mongoose = require('mongoose');

const salonSettingsSchema = new mongoose.Schema({
  salonName: { type: String, default: 'Luxe & Aura Unisex Beauty Salon' },
  tagline: { type: String, default: 'Your Beauty. Your Style. Your Confidence.' },
  logo: { type: String, default: '' },
  phone: { type: String, default: '+91 98765 43210' },
  whatsapp: { type: String, default: '919876543210' },
  email: { type: String, default: 'contact@luxeaurasalon.com' },
  address: { type: String, default: 'Suite 402, Royal Plaza, MG Road, Indiranagar, Bengaluru, Karnataka 560038' },
  openingHours: { type: String, default: '09:00 AM' },
  closingHours: { type: String, default: '09:00 PM' },
  holidays: { type: [String], default: ['Monday'] },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/luxeaurasalon' },
    facebook: { type: String, default: 'https://facebook.com/luxeaurasalon' },
    twitter: { type: String, default: 'https://twitter.com/luxeaurasalon' }
  },
  mapLocation: { type: String, default: 'https://maps.google.com' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SalonSettings', salonSettingsSchema);
