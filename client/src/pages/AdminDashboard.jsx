import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalon, API_BASE_URL } from '../context/SalonContext';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MessageSquare,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  RefreshCw,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const {
    adminToken,
    adminUser,
    isLoggedIn,
    logoutAdmin,
    settings,
    fetchSettings,
    fetchServices,
    fetchGallery,
    showToast,
    buildWhatsAppLink
  } = useSalon();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Protect Admin route
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  // Dashboard Stats State
  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalAppointments: 0,
    totalCustomers: 0,
    totalServices: 0,
    topServices: [],
    recentAppointments: []
  });

  // Appointments State
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [apptSearch, setApptSearch] = useState('');
  const [apptStatusFilter, setApptStatusFilter] = useState('All');
  const [apptDateFilter, setApptDateFilter] = useState('');
  const [selectedApptDetail, setSelectedApptDetail] = useState(null);

  // Services State
  const [servicesList, setServicesList] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Hair',
    gender: 'Unisex',
    description: '',
    price: '',
    duration: '',
    image: '',
    status: true
  });

  // Gallery State
  const [galleryList, setGalleryList] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'General',
    image: ''
  });

  // Customers State
  const [customersList, setCustomersList] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState(null);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch Dashboard Stats
  const loadDashboardStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Error loading dashboard stats:', err);
    }
  };

  // Fetch Appointments List
  const loadAppointments = async () => {
    try {
      let url = `${API_BASE_URL}/appointments?status=${apptStatusFilter}`;
      if (apptDateFilter) url += `&date=${apptDateFilter}`;
      if (apptSearch) url += `&search=${encodeURIComponent(apptSearch)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointmentsList(data.appointments);
      }
    } catch (err) {
      console.warn('Error loading appointments:', err);
    }
  };

  // Fetch Services for Admin
  const loadAdminServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services?all=true`);
      const data = await res.json();
      if (data.success) {
        setServicesList(data.services);
      }
    } catch (err) {
      console.warn('Error loading services:', err);
    }
  };

  // Fetch Gallery for Admin
  const loadAdminGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery`);
      const data = await res.json();
      if (data.success) {
        setGalleryList(data.gallery);
      }
    } catch (err) {
      console.warn('Error loading gallery:', err);
    }
  };

  // Fetch Customers List
  const loadCustomers = async () => {
    try {
      let url = `${API_BASE_URL}/customers`;
      if (customerSearch) url += `?search=${encodeURIComponent(customerSearch)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomersList(data.customers);
      }
    } catch (err) {
      console.warn('Error loading customers:', err);
    }
  };

  // Trigger Data Refresh on Tab Change
  useEffect(() => {
    if (adminToken) {
      if (activeTab === 'dashboard') loadDashboardStats();
      if (activeTab === 'appointments') loadAppointments();
      if (activeTab === 'services') loadAdminServices();
      if (activeTab === 'gallery') loadAdminGallery();
      if (activeTab === 'customers') loadCustomers();
      if (activeTab === 'settings') setSettingsForm({ ...settings });
    }
  }, [activeTab, adminToken, apptStatusFilter, apptDateFilter]);

  // Appointment Status Update Action
  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Appointment status updated to ${newStatus}`);
        loadAppointments();
        loadDashboardStats();
      } else {
        showToast(data.message || 'Status update failed', 'error');
      }
    } catch (err) {
      showToast('Server error updating appointment', 'error');
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Appointment deleted successfully');
        loadAppointments();
        loadDashboardStats();
      }
    } catch (err) {
      showToast('Failed to delete appointment', 'error');
    }
  };

  // Service Form Submission (Create or Edit)
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingService;
      const url = isEdit ? `${API_BASE_URL}/services/${editingService._id}` : `${API_BASE_URL}/services`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(serviceForm)
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Service updated successfully' : 'New service created successfully');
        setShowServiceModal(false);
        setEditingService(null);
        loadAdminServices();
        fetchServices();
      } else {
        showToast(data.message || 'Error saving service', 'error');
      }
    } catch (err) {
      showToast('Failed to save service', 'error');
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Service deleted successfully');
        loadAdminServices();
        fetchServices();
      }
    } catch (err) {
      showToast('Failed to delete service', 'error');
    }
  };

  // Image Upload Handler (Cloudinary API integration with local fallback)
  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image uploaded successfully');
        if (formType === 'service') {
          setServiceForm({ ...serviceForm, image: data.imageUrl });
        } else if (formType === 'gallery') {
          setGalleryForm({ ...galleryForm, image: data.imageUrl });
        }
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Error uploading image file', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Gallery Add Handler
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(galleryForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Gallery image added successfully');
        setShowGalleryModal(false);
        setGalleryForm({ title: '', category: 'General', image: '' });
        loadAdminGallery();
        fetchGallery();
      } else {
        showToast(data.message || 'Error adding gallery image', 'error');
      }
    } catch (err) {
      showToast('Server error adding image', 'error');
    }
  };

  // Delete Gallery Image
  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Gallery item removed');
        loadAdminGallery();
        fetchGallery();
      }
    } catch (err) {
      showToast('Failed to delete gallery item', 'error');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Salon settings updated successfully!');
        fetchSettings();
      } else {
        showToast(data.message || 'Settings update failed', 'error');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    }
  };

  // Send WhatsApp Notification to Customer
  const sendWhatsAppNotification = (appt) => {
    const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
    const message = `Hello ${appt.customerName},

This is an update regarding your appointment at ${settings.salonName}.

Appointment ID: ${appt.appointmentId}
Service: ${appt.service}
Date: ${appt.date}
Time: ${appt.time}
Status: ${appt.status}

Thank you for choosing ${settings.salonName}!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F5F7' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-dark)',
          color: '#FFFFFF',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px 8px', borderBottom: '1px solid #333' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scissors size={20} color="#FFF" />
            </div>
            <div>
              <h3 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0 }}>Salon Admin</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>Dashboard v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'dashboard' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'dashboard' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <LayoutDashboard size={18} /> Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'appointments' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'appointments' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Calendar size={18} /> Appointments
            </button>

            <button
              onClick={() => setActiveTab('services')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'services' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'services' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Scissors size={18} /> Services Catalog
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'gallery' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'gallery' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <ImageIcon size={18} /> Gallery Photos
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'customers' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'customers' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Users size={18} /> Customer Base
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: activeTab === 'settings' ? 'var(--accent-gold)' : '#A0A0A0',
                background: activeTab === 'settings' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Settings size={18} /> Salon Settings
            </button>
          </nav>
        </div>

        <div>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              borderRadius: '6px',
              color: '#BBB',
              fontSize: '0.85rem',
              marginBottom: '8px'
            }}
          >
            <ExternalLink size={16} /> View Public Website
          </button>

          <button
            onClick={logoutAdmin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '8px',
              background: '#2A1A1A',
              color: '#F87171',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {/* TOP HEADER BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: '#FFF', padding: '16px 24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
              {activeTab === 'dashboard' && 'Dashboard Analytics & Overview'}
              {activeTab === 'appointments' && 'Appointment Management'}
              {activeTab === 'services' && 'Services Catalog Management'}
              {activeTab === 'gallery' && 'Gallery Management'}
              {activeTab === 'customers' && 'Customer Database'}
              {activeTab === 'settings' && 'Salon Settings & Business Info'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Welcome back, {adminUser?.name || 'Admin'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                if (activeTab === 'dashboard') loadDashboardStats();
                if (activeTab === 'appointments') loadAppointments();
                if (activeTab === 'services') loadAdminServices();
                if (activeTab === 'gallery') loadAdminGallery();
                if (activeTab === 'customers') loadCustomers();
                showToast('Data refreshed');
              }}
              className="btn-secondary btn-sm"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>

            {activeTab === 'services' && (
              <button
                className="btn-primary btn-sm"
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({ name: '', category: 'Hair', gender: 'Unisex', description: '', price: '', duration: '', image: '', status: true });
                  setShowServiceModal(true);
                }}
              >
                <Plus size={16} /> Add New Service
              </button>
            )}

            {activeTab === 'gallery' && (
              <button className="btn-primary btn-sm" onClick={() => setShowGalleryModal(true)}>
                <Plus size={16} /> Upload Photo
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              
              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Today's Bookings</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 4px 0', color: 'var(--text-primary)' }}>{stats.todayCount}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scheduled for today</span>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending</span>
                  <span className="badge badge-pending" style={{ fontSize: '0.75rem' }}>Review</span>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 4px 0', color: 'var(--status-pending-color)' }}>{stats.pendingCount}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Needs confirmation</span>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Confirmed</span>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.75rem' }}>Active</span>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 4px 0', color: 'var(--status-confirmed-color)' }}>{stats.confirmedCount}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Confirmed slots</span>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed</span>
                  <span className="badge badge-completed" style={{ fontSize: '0.75rem' }}>Done</span>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 4px 0', color: 'var(--status-completed-color)' }}>{stats.completedCount}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fulfilled sessions</span>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-nude)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Customers</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '10px 0 4px 0', color: 'var(--text-primary)' }}>{stats.totalCustomers}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered clients</span>
              </div>

            </div>

            {/* Analytics Section & Recent Appointments */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              {/* Recent Bookings Table */}
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Appointments</h3>
                  <button className="btn-outline-gold btn-sm" onClick={() => setActiveTab('appointments')}>
                    View All
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F0F0F0', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Customer</th>
                      <th style={{ padding: '10px' }}>Service</th>
                      <th style={{ padding: '10px' }}>Date/Time</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments.map((appt) => (
                      <tr key={appt.appointmentId} style={{ borderBottom: '1px solid #F9F9F9' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 700 }}>{appt.appointmentId}</td>
                        <td style={{ padding: '12px 10px' }}>{appt.customerName}</td>
                        <td style={{ padding: '12px 10px' }}>{appt.service}</td>
                        <td style={{ padding: '12px 10px' }}>{appt.date} ({appt.time})</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Analytics Sidebar */}
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Most Booked Services</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.topServices.map((srvItem) => (
                    <div key={srvItem.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{srvItem.name}</span>
                        <span style={{ color: 'var(--accent-bronze)', fontWeight: 700 }}>{srvItem.count} bookings</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, srvItem.count * 25)}%`,
                            background: 'linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-bronze) 100%)',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Filters Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Phone or Service..."
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                <button className="btn-primary btn-sm" onClick={loadAppointments}>
                  Search
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select value={apptStatusFilter} onChange={(e) => setApptStatusFilter(e.target.value)} className="form-select" style={{ width: '160px' }}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>

                <input
                  type="date"
                  value={apptDateFilter}
                  onChange={(e) => setApptDateFilter(e.target.value)}
                  className="form-input"
                  style={{ width: '160px' }}
                />

                {apptDateFilter && (
                  <button className="btn-secondary btn-sm" onClick={() => setApptDateFilter('')}>Clear Date</button>
                )}
              </div>
            </div>

            {/* Appointments Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#F8F9FA', textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '14px 12px' }}>Appt ID</th>
                    <th style={{ padding: '14px 12px' }}>Customer</th>
                    <th style={{ padding: '14px 12px' }}>Service</th>
                    <th style={{ padding: '14px 12px' }}>Date & Time</th>
                    <th style={{ padding: '14px 12px' }}>Phone</th>
                    <th style={{ padding: '14px 12px' }}>Status</th>
                    <th style={{ padding: '14px 12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointmentsList.map((appt) => (
                      <tr key={appt._id || appt.appointmentId} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--accent-bronze)' }}>
                          {appt.appointmentId}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <strong style={{ display: 'block' }}>{appt.customerName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.gender}</span>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 500 }}>{appt.service}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span>{appt.date}</span>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.time}</span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>{appt.phone}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <select
                            value={appt.status}
                            onChange={(e) => updateAppointmentStatus(appt._id || appt.appointmentId, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              border: '1px solid #DDD',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Rescheduled">Rescheduled</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {/* Send WhatsApp Notification */}
                            <button
                              onClick={() => sendWhatsAppNotification(appt)}
                              title="Send WhatsApp update to customer"
                              style={{ background: '#25D366', color: '#FFF', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <MessageSquare size={14} />
                            </button>

                            {/* View Full Details */}
                            <button
                              onClick={() => setSelectedApptDetail(appt)}
                              title="View details"
                              style={{ background: '#F3F4F6', color: '#333', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Eye size={14} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteAppointment(appt._id || appt.appointmentId)}
                              title="Delete appointment"
                              style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {servicesList.map((srv) => (
                <div key={srv._id || srv.name} className="salon-card" style={{ padding: '20px' }}>
                  <div style={{ height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={srv.image} alt={srv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{srv.name}</h4>
                    <span style={{ fontWeight: 700, color: 'var(--accent-bronze)', fontSize: '1.1rem' }}>₹{srv.price}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    <span className="badge badge-gender">{srv.category}</span>
                    <span className="badge" style={{ background: '#F3F4F6', color: '#666' }}>{srv.gender}</span>
                    <span className="badge" style={{ background: srv.status ? '#D1FAE5' : '#FEE2E2', color: srv.status ? '#059669' : '#DC2626' }}>
                      {srv.status ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {srv.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #EEE' }}>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setEditingService(srv);
                        setServiceForm({
                          name: srv.name,
                          category: srv.category,
                          gender: srv.gender,
                          description: srv.description,
                          price: srv.price,
                          duration: srv.duration,
                          image: srv.image,
                          status: srv.status
                        });
                        setShowServiceModal(true);
                      }}
                    >
                      <Edit size={14} /> Edit
                    </button>

                    <button className="btn-secondary btn-sm" onClick={() => handleDeleteService(srv._id)} style={{ color: '#DC2626' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {galleryList.map((item) => (
                <div key={item._id || item.title} className="salon-card" style={{ padding: '12px', position: 'relative' }}>
                  <div style={{ height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h5 style={{ margin: '4px 0', fontSize: '0.95rem' }}>{item.title}</h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{item.category}</span>

                  <button
                    onClick={() => handleDeleteGallery(item._id)}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(220,38,38,0.85)', color: '#FFF', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER BASE */}
        {activeTab === 'customers' && (
          <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search customers by name, phone or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="form-input"
              />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8F9FA', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '12px' }}>Customer Name</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Gender</th>
                  <th style={{ padding: '12px' }}>Total Bookings</th>
                  <th style={{ padding: '12px' }}>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {customersList.map((cust) => (
                  <tr key={cust._id || cust.phone} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{cust.name}</td>
                    <td style={{ padding: '12px' }}>{cust.phone}</td>
                    <td style={{ padding: '12px' }}>{cust.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{cust.gender}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-gender">{cust.totalAppointments} sessions</span>
                    </td>
                    <td style={{ padding: '12px' }}>{cust.lastVisit || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: SALON SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} style={{ background: '#FFF', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Update Business Profile & Settings</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Salon Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.salonName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, salonName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={settingsForm.phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number (e.g. 919876543210)</label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsapp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business Email</label>
              <input
                type="email"
                value={settingsForm.email || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <textarea
                rows={2}
                value={settingsForm.address || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Opening Time</label>
                <input
                  type="text"
                  value={settingsForm.openingHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Closing Time</label>
                <input
                  type="text"
                  value={settingsForm.closingHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, closingHours: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
              Save Salon Settings
            </button>
          </form>
        )}

      </main>

      {/* SERVICE MODAL (Add / Edit) */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-content" style={{ padding: '32px', maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>
              {editingService ? 'Edit Salon Service' : 'Add New Salon Service'}
            </h3>

            <form onSubmit={handleSaveService}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keratin Hair Treatment"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Skin">Skin</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Gender *</label>
                  <select
                    value={serviceForm.gender}
                    onChange={(e) => setServiceForm({ ...serviceForm, gender: e.target.value })}
                    className="form-select"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Mins) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the service..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Image URL or Upload *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  className="form-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'service')}
                  style={{ marginTop: '8px', fontSize: '0.85rem' }}
                />
                {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Uploading image to Cloudinary/Local...</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowServiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY UPLOAD MODAL */}
      {showGalleryModal && (
        <div className="modal-overlay" onClick={() => setShowGalleryModal(false)}>
          <div className="modal-content" style={{ padding: '32px', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Upload Gallery Image</h3>

            <form onSubmit={handleSaveGallery}>
              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Styling Station"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="form-select"
                >
                  <option value="General">General</option>
                  <option value="Interior">Interior</option>
                  <option value="Hair">Hair</option>
                  <option value="Skin">Skin</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL or File Upload *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  className="form-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  style={{ marginTop: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowGalleryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT DETAIL MODAL */}
      {selectedApptDetail && (
        <div className="modal-overlay" onClick={() => setSelectedApptDetail(null)}>
          <div className="modal-content" style={{ padding: '32px', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Appointment Details</h3>
              <button onClick={() => setSelectedApptDetail(null)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div><strong>ID:</strong> {selectedApptDetail.appointmentId}</div>
              <div><strong>Customer Name:</strong> {selectedApptDetail.customerName}</div>
              <div><strong>Mobile:</strong> {selectedApptDetail.phone}</div>
              <div><strong>Email:</strong> {selectedApptDetail.email || 'None'}</div>
              <div><strong>Gender:</strong> {selectedApptDetail.gender}</div>
              <div><strong>Service:</strong> {selectedApptDetail.service}</div>
              <div><strong>Date & Time:</strong> {selectedApptDetail.date} at {selectedApptDetail.time}</div>
              <div><strong>Status:</strong> <span className={`badge badge-${selectedApptDetail.status.toLowerCase()}`}>{selectedApptDetail.status}</span></div>
              <div><strong>Special Notes:</strong> {selectedApptDetail.notes || 'No notes provided.'}</div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                className="btn-whatsapp"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => sendWhatsAppNotification(selectedApptDetail)}
              >
                <MessageSquare size={16} /> Contact via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
