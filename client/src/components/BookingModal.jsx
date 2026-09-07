import React, { useState, useEffect } from 'react';
import { useSalon, API_BASE_URL } from '../context/SalonContext';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
];

const BookingModal = () => {
  const {
    isBookingOpen,
    closeBookingModal,
    selectedBookingService,
    services,
    settings,
    showToast,
    buildWhatsAppLink
  } = useSalon();

  const [step, setStep] = useState(1);

  // Form Fields
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Female');
  const [notes, setNotes] = useState('');

  // Slot Availability
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Set default date to today or tomorrow
  useEffect(() => {
    if (isBookingOpen) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      if (selectedBookingService) {
        setSelectedService(selectedBookingService);
      } else if (services.length > 0) {
        setSelectedService(services[0]);
      }
      setStep(1);
      setCreatedAppointment(null);
      setErrorMsg('');
    }
  }, [isBookingOpen, selectedBookingService, services]);

  // Fetch occupied slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await fetch(`${API_BASE_URL}/appointments/booked-slots?date=${selectedDate}`);
          const data = await res.json();
          if (data.success) {
            setBookedSlots(data.bookedSlots || []);
          }
        } catch (err) {
          console.warn('Error checking booked slots:', err);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate]);

  if (!isBookingOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleServiceSelect = (srv) => {
    setSelectedService(srv);
    setErrorMsg('');
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!selectedService) {
        setErrorMsg('Please select a service to proceed.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate) {
        setErrorMsg('Please select a date.');
        return;
      }
      if (!selectedTime) {
        setErrorMsg('Please select a time slot.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gender,
        service: selectedService ? selectedService.name : 'Salon Service',
        serviceId: selectedService ? (selectedService._id || selectedService.id) : '',
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim()
      };

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setCreatedAppointment(data.appointment);
        setStep(4); // Confirmation step
        showToast('Appointment booked successfully!');
      } else {
        setErrorMsg(data.message || 'Failed to book appointment.');
      }
    } catch (err) {
      setErrorMsg('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Build formatted WhatsApp message for confirmation
  const getWhatsAppMessage = () => {
    if (!createdAppointment) return '';
    const appt = createdAppointment;
    return `Hello ${settings.salonName},

I would like to book an appointment.

Name: ${appt.customerName}
Mobile: ${appt.phone}
Service: ${appt.service}
Date: ${appt.date}
Time: ${appt.time}
Gender: ${appt.gender}
Notes: ${appt.notes || 'None'}

Please confirm my appointment.

Appointment ID: ${appt.appointmentId}`;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeBookingModal()}>
      <div className="modal-content" style={{ padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Book Appointment</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Step {step} of 4 — {step === 1 ? 'Select Service' : step === 2 ? 'Date & Time' : step === 3 ? 'Your Details' : 'Confirmation'}
            </p>
          </div>
          <button onClick={closeBookingModal} style={{ color: 'var(--text-muted)' }} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: i <= step ? 'var(--accent-gold)' : '#E0E0E0',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Choose a Service</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              {services.map((srv) => {
                const isSelected = selectedService && (selectedService._id === srv._id || selectedService.name === srv.name);
                return (
                  <div
                    key={srv._id || srv.name}
                    onClick={() => handleServiceSelect(srv)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--accent-nude)',
                      background: isSelected ? 'var(--accent-gold-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                          {srv.category}
                        </span>
                        <span className="badge badge-gender" style={{ fontSize: '0.7rem' }}>{srv.gender}</span>
                      </div>
                      <h5 style={{ fontSize: '0.95rem', margin: '4px 0', color: 'var(--text-primary)' }}>{srv.name}</h5>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-bronze)', fontSize: '0.95rem' }}>₹{srv.price}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱ {srv.duration} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn-primary" onClick={handleNextStep}>
                Next: Date & Time <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Date & Time */}
        {step === 2 && (
          <div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} /> Preferred Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} /> Available Time Slots
                {loadingSlots && <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginLeft: '10px' }}>(Checking availability...)</span>}
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '10px', maxHeight: '220px', overflowY: 'auto', marginTop: '8px' }}>
                {TIME_SLOTS.map((timeStr) => {
                  const isOccupied = bookedSlots.includes(timeStr);
                  const isSelected = selectedTime === timeStr;

                  return (
                    <button
                      key={timeStr}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setSelectedTime(timeStr)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--accent-nude)',
                        background: isOccupied
                          ? '#F3F4F6'
                          : isSelected
                          ? 'var(--accent-gold)'
                          : '#FFFFFF',
                        color: isOccupied ? '#9CA3AF' : isSelected ? '#FFFFFF' : 'var(--text-primary)',
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        textDecoration: isOccupied ? 'line-through' : 'none'
                      }}
                    >
                      {timeStr}
                      {isOccupied && <span style={{ display: 'block', fontSize: '0.65rem', color: '#EF4444' }}>Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={18} /> Back
              </button>
              <button className="btn-primary" onClick={handleNextStep}>
                Next: Your Details <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Information */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. aarav@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests / Hair & Skin Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Any allergies, preferences, or custom requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={18} /> Back
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Booking Confirmation */}
        {step === 4 && createdAppointment && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h4 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Appointment Reserved!
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your appointment request has been recorded. Reference ID below:
            </p>

            <div
              style={{
                background: 'var(--accent-gold-light)',
                border: '1px dashed var(--accent-gold)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                display: 'inline-block',
                minWidth: '240px'
              }}
            >
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-bronze)', display: 'block' }}>
                Appointment ID
              </span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '1px' }}>
                {createdAppointment.appointmentId}
              </strong>
            </div>

            {/* Receipt Summary Box */}
            <div style={{ background: '#F9F9F9', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EEE' }}>
                <span style={{ color: '#777' }}>Customer:</span>
                <strong>{createdAppointment.customerName} ({createdAppointment.phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EEE' }}>
                <span style={{ color: '#777' }}>Service:</span>
                <strong>{createdAppointment.service}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#777' }}>Date & Time:</span>
                <strong>{createdAppointment.date} at {createdAppointment.time}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={buildWhatsAppLink(getWhatsAppMessage())}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ justifyContent: 'center' }}
              >
                <MessageSquare size={20} /> Book / Confirm via WhatsApp
              </a>

              <button className="btn-secondary" onClick={closeBookingModal} style={{ justifyContent: 'center' }}>
                Close & Return to Website
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;
