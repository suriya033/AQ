import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SalonProvider } from './context/SalonContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomBar from './components/MobileBottomBar';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BookingModal from './components/BookingModal';
import Toast from './components/Toast';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import GalleryPage from './pages/GalleryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
      <MobileBottomBar />
      <FloatingWhatsApp />
      <BookingModal />
      <Toast />
    </Router>
  );
}

function App() {
  return (
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  );
}

export default App;
