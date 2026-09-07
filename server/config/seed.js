const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Gallery = require('../models/Gallery');
const SalonSettings = require('../models/SalonSettings');
const { isInMemoryDB, getMemoryStore, saveMemoryStore } = require('./db');

const initialServices = [
  // HAIR SERVICES
  {
    name: 'Precision Haircut & Styling',
    category: 'Hair',
    gender: 'Unisex',
    description: 'Bespoke hair design tailored to your face shape, including consultation, luxurious wash, and blow-dry finish.',
    price: 650,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Royal Keratin Treatment',
    category: 'Hair',
    gender: 'Unisex',
    description: 'Transform frizzy, unmanageable hair into silky smooth, radiant locks for up to 4 months.',
    price: 3500,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Argan Oil Deep Hair Spa',
    category: 'Hair',
    gender: 'Unisex',
    description: 'Intense moisture restoration treatment with scalp massage and steam therapy for dry or damaged hair.',
    price: 1200,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Balayage & Global Hair Color',
    category: 'Hair',
    gender: 'Unisex',
    description: 'Hand-painted dimensional color highlights using ammonia-free organic hair colors.',
    price: 2800,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Smoothening & Straightening',
    category: 'Hair',
    gender: 'Female',
    description: 'Permanent sleek straight treatment enriched with protein nourishment for glossy locks.',
    price: 4200,
    duration: 150,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    status: true
  },

  // SKIN SERVICES
  {
    name: 'Gold Radiance Facial',
    category: 'Skin',
    gender: 'Unisex',
    description: 'Luxury 24K gold foil facial that restores youthful glow, eliminates toxins, and rejuvenates skin cell structure.',
    price: 1800,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Hydra-Infusion CleanUp',
    category: 'Skin',
    gender: 'Unisex',
    description: 'Deep pore extraction, ultrasonic exfoliation, and hyaluronate hydration therapy for glowing clear skin.',
    price: 950,
    duration: 40,
    image: 'https://images.unsplash.com/photo-1512290900673-70024721cf3f?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Insta-Glow Anti-Tan & Bleach',
    category: 'Skin',
    gender: 'Unisex',
    description: 'Herbal anti-tan treatment enriched with papaya enzymes to brighten sun-damaged skin.',
    price: 750,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    status: true
  },

  // GROOMING SERVICES
  {
    name: 'Signature Beard Sculpting & Trim',
    category: 'Grooming',
    gender: 'Male',
    description: 'Precision hot towel beard shaping, razor lining, and nourishing beard oil conditioning massage.',
    price: 450,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Classic Hot Towel Shave',
    category: 'Grooming',
    gender: 'Male',
    description: 'Traditional straight razor shave with aromatherapy hot towels and calming after-shave balm.',
    price: 350,
    duration: 25,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Aromatherapy Head & Shoulder Massage',
    category: 'Grooming',
    gender: 'Unisex',
    description: 'Stress-busting pressure point massage with customized essential oils to release muscle tension.',
    price: 800,
    duration: 40,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    status: true
  },

  // BEAUTY SERVICES
  {
    name: 'HD Bridal Couture Makeup',
    category: 'Beauty',
    gender: 'Female',
    description: 'High-definition airbrush bridal makeup, lash extensions, hair styling, and saree/dupatta drape styling.',
    price: 12000,
    duration: 180,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Glamour Party Makeup',
    category: 'Beauty',
    gender: 'Female',
    description: 'Sophisticated event makeup highlighting features with premium cosmetics, glitter eyes, and blowdry.',
    price: 2500,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Deluxe Spa Manicure & Pedicure',
    category: 'Beauty',
    gender: 'Unisex',
    description: 'Complete nail shaping, cuticle care, sea salt scrub, paraffin wax dip, and foot massage.',
    price: 1400,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    status: true
  },
  {
    name: 'Organic Full Body Waxing',
    category: 'Beauty',
    gender: 'Female',
    description: 'Gentle chocolate wax treatment for smooth hair-free skin with minimal discomfort.',
    price: 1600,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    status: true
  }
];

const initialGallery = [
  {
    title: 'Modern Salon Ambience',
    category: 'Interior',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Hairstyling Station',
    category: 'Hair',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Gentlemen Beard Grooming',
    category: 'Grooming',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Luxury Facial & Spa Room',
    category: 'Skin',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Bridal Makeover Suite',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Nail Care Lounge',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
  }
];

const initialSettings = {
  salonName: 'Luxe & Aura Unisex Beauty Salon',
  tagline: 'Your Beauty. Your Style. Your Confidence.',
  logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'appointments@luxeaurasalon.com',
  address: 'Suite 402, Royal Plaza, MG Road, Indiranagar, Bengaluru, Karnataka 560038',
  openingHours: '09:00 AM',
  closingHours: '09:00 PM',
  holidays: ['Monday'],
  socialLinks: {
    instagram: 'https://instagram.com/luxeaurasalon',
    facebook: 'https://facebook.com/luxeaurasalon',
    twitter: 'https://twitter.com/luxeaurasalon'
  },
  mapLocation: 'https://maps.google.com/?q=Indiranagar+Bengaluru'
};

const initialAppointments = [
  {
    appointmentId: 'APPT-1001',
    customerName: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav@example.com',
    gender: 'Male',
    service: 'Precision Haircut & Styling',
    serviceId: 'srv-1',
    date: '2026-09-07',
    time: '11:00 AM',
    notes: 'Prefers fade cut on sides.',
    status: 'Confirmed',
    createdAt: new Date('2026-09-06T10:00:00Z')
  },
  {
    appointmentId: 'APPT-1002',
    customerName: 'Priya Verma',
    phone: '9812345678',
    email: 'priya@example.com',
    gender: 'Female',
    service: 'Gold Radiance Facial',
    serviceId: 'srv-6',
    date: '2026-09-07',
    time: '02:00 PM',
    notes: 'Sensitive skin consultation required.',
    status: 'Pending',
    createdAt: new Date('2026-09-07T08:30:00Z')
  },
  {
    appointmentId: 'APPT-1003',
    customerName: 'Rohan Mehta',
    phone: '9765432109',
    email: 'rohan@example.com',
    gender: 'Male',
    service: 'Signature Beard Sculpting & Trim',
    serviceId: 'srv-9',
    date: '2026-09-08',
    time: '05:00 PM',
    notes: 'First time visiting.',
    status: 'Confirmed',
    createdAt: new Date('2026-09-06T14:20:00Z')
  },
  {
    appointmentId: 'APPT-1004',
    customerName: 'Ananya Iyer',
    phone: '9988776655',
    email: 'ananya@example.com',
    gender: 'Female',
    service: 'Royal Keratin Treatment',
    serviceId: 'srv-2',
    date: '2026-09-05',
    time: '10:00 AM',
    notes: 'Finished smoothly.',
    status: 'Completed',
    createdAt: new Date('2026-09-04T12:00:00Z')
  }
];

const seedData = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  if (isInMemoryDB()) {
    const store = getMemoryStore();
    if (!store.admins || store.admins.length === 0) {
      store.admins = [{
        _id: 'admin-1',
        name: 'Master Admin',
        email: 'admin@beautysalon.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      }];
    }
    if (!store.settings) {
      store.settings = { _id: 'setting-1', ...initialSettings };
    }
    if (!store.services || store.services.length === 0) {
      store.services = initialServices.map((s, idx) => ({
        _id: `srv-${idx + 1}`,
        ...s,
        createdAt: new Date()
      }));
    }
    if (!store.gallery || store.gallery.length === 0) {
      store.gallery = initialGallery.map((g, idx) => ({
        _id: `gal-${idx + 1}`,
        ...g,
        createdAt: new Date()
      }));
    }
    if (!store.appointments || store.appointments.length === 0) {
      store.appointments = initialAppointments.map(a => ({
        _id: `appt-${a.appointmentId}`,
        ...a
      }));
    }
    if (!store.customers || store.customers.length === 0) {
      store.customers = [
        { _id: 'cust-1', name: 'Aarav Sharma', phone: '9876543210', email: 'aarav@example.com', gender: 'Male', totalAppointments: 2, lastVisit: '2026-09-07', createdAt: new Date() },
        { _id: 'cust-2', name: 'Priya Verma', phone: '9812345678', email: 'priya@example.com', gender: 'Female', totalAppointments: 1, lastVisit: '2026-09-07', createdAt: new Date() },
        { _id: 'cust-3', name: 'Rohan Mehta', phone: '9765432109', email: 'rohan@example.com', gender: 'Male', totalAppointments: 1, lastVisit: '2026-09-08', createdAt: new Date() },
        { _id: 'cust-4', name: 'Ananya Iyer', phone: '9988776655', email: 'ananya@example.com', gender: 'Female', totalAppointments: 3, lastVisit: '2026-09-05', createdAt: new Date() }
      ];
    }
    saveMemoryStore();
    console.log('InMemory Seed data initialized successfully.');
    return;
  }

  // Real MongoDB Mongoose Seeding
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'Master Admin',
        email: 'admin@beautysalon.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Seeded default Admin: admin@beautysalon.com / admin123');
    }

    const settingsCount = await SalonSettings.countDocuments();
    if (settingsCount === 0) {
      await SalonSettings.create(initialSettings);
      console.log('Seeded Salon Settings.');
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(initialServices);
      console.log('Seeded Initial Salon Services.');
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany(initialGallery);
      console.log('Seeded Initial Gallery items.');
    }

    const apptCount = await Appointment.countDocuments();
    if (apptCount === 0) {
      await Appointment.insertMany(initialAppointments);
      console.log('Seeded Initial Appointments.');
    }

    const custCount = await Customer.countDocuments();
    if (custCount === 0) {
      await Customer.insertMany([
        { name: 'Aarav Sharma', phone: '9876543210', email: 'aarav@example.com', gender: 'Male', totalAppointments: 2, lastVisit: '2026-09-07' },
        { name: 'Priya Verma', phone: '9812345678', email: 'priya@example.com', gender: 'Female', totalAppointments: 1, lastVisit: '2026-09-07' },
        { name: 'Rohan Mehta', phone: '9765432109', email: 'rohan@example.com', gender: 'Male', totalAppointments: 1, lastVisit: '2026-09-08' },
        { name: 'Ananya Iyer', phone: '9988776655', email: 'ananya@example.com', gender: 'Female', totalAppointments: 3, lastVisit: '2026-09-05' }
      ]);
      console.log('Seeded Initial Customers.');
    }
  } catch (err) {
    console.error('Error during Mongoose data seeding:', err);
  }
};

module.exports = { seedData };
