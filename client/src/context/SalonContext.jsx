import React, { createContext, useState, useEffect, useContext } from 'react';

const SalonContext = createContext();

export const API_BASE_URL = 'http://localhost:5000/api';

export const SalonProvider = ({ children }) => {
  const [settings, setSettings] = useState({
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
  });

  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState(localStorage.getItem('salon_admin_token') || '');
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('salon_admin_user') || 'null'));

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch Public Salon Data
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Could not load settings from server, using default.', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services?all=true`);
      const data = await res.json();
      if (data.success && data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.warn('Could not load services from server.', err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery`);
      const data = await res.json();
      if (data.success && data.gallery) {
        setGallery(data.gallery);
      }
    } catch (err) {
      console.warn('Could not load gallery from server.', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchServices(), fetchGallery()]);
      setLoading(false);
    };
    initData();
  }, []);

  // Admin Login Handler
  const loginAdmin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('salon_admin_token', data.token);
        localStorage.setItem('salon_admin_user', JSON.stringify(data.admin));
        showToast(`Welcome back, ${data.admin.name}!`);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('salon_admin_token');
    localStorage.removeItem('salon_admin_user');
    showToast('Logged out successfully.', 'info');
  };

  // Open & Close Booking Modal
  const openBookingModal = (service = null) => {
    setSelectedBookingService(service);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedBookingService(null);
  };

  // WhatsApp Helper function
  const buildWhatsAppLink = (messageText) => {
    const cleanNum = (settings.whatsapp || '919876543210').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  };

  return (
    <SalonContext.Provider
      value={{
        settings,
        setSettings,
        services,
        gallery,
        loading,
        adminToken,
        adminUser,
        isLoggedIn: !!adminToken,
        loginAdmin,
        logoutAdmin,
        toast,
        showToast,
        isBookingOpen,
        selectedBookingService,
        openBookingModal,
        closeBookingModal,
        fetchServices,
        fetchGallery,
        fetchSettings,
        buildWhatsAppLink
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => useContext(SalonContext);
