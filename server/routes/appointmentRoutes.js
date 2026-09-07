const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const SalonSettings = require('../models/SalonSettings');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore, saveMemoryStore } = require('../config/db');

// Helper to generate Unique Appointment ID
const generateAppointmentId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `APPT-${randomNum}`;
};

// GET /api/appointments/booked-slots (Public)
router.get('/booked-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required (YYYY-MM-DD).' });
    }

    let bookedTimes = [];
    if (isInMemoryDB()) {
      bookedTimes = getMemoryStore()
        .appointments.filter(a => a.date === date && a.status !== 'Cancelled')
        .map(a => a.time);
    } else {
      const appts = await Appointment.find({ date, status: { $ne: 'Cancelled' } });
      bookedTimes = appts.map(a => a.time);
    }

    return res.json({ success: true, date, bookedSlots: bookedTimes });
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch booked slots.' });
  }
});

// POST /api/appointments (Public Customer Booking)
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, gender, service, serviceId, date, time, notes } = req.body;

    if (!customerName || !phone || !gender || !service || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please fill in all required booking fields.' });
    }

    // Phone validation
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 7) {
      return res.status(400).json({ success: false, message: 'Please enter a valid mobile phone number.' });
    }

    // Check past date
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ success: false, message: 'You cannot book an appointment for a past date.' });
    }

    // Check holiday day of week
    let holidays = ['Monday'];
    if (isInMemoryDB()) {
      if (getMemoryStore().settings && getMemoryStore().settings.holidays) {
        holidays = getMemoryStore().settings.holidays;
      }
    } else {
      const settings = await SalonSettings.findOne();
      if (settings && settings.holidays) {
        holidays = settings.holidays;
      }
    }

    const bookingDateObj = new Date(date + 'T00:00:00');
    const dayName = bookingDateObj.toLocaleDateString('en-US', { weekday: 'long' });
    if (holidays.map(h => h.toLowerCase()).includes(dayName.toLowerCase())) {
      return res.status(400).json({ success: false, message: `The salon is closed on ${dayName}s. Please choose another date.` });
    }

    // Check slot collision
    let existingBooking = null;
    if (isInMemoryDB()) {
      existingBooking = getMemoryStore().appointments.find(
        a => a.date === date && a.time === time && a.status !== 'Cancelled'
      );
    } else {
      existingBooking = await Appointment.findOne({ date, time, status: { $ne: 'Cancelled' } });
    }

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked. Please select another time.' });
    }

    const apptId = generateAppointmentId();

    const appointmentData = {
      appointmentId: apptId,
      customerName: customerName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : '',
      gender,
      service,
      serviceId: serviceId || '',
      date,
      time,
      notes: notes ? notes.trim() : '',
      status: 'Pending',
      createdAt: new Date()
    };

    let createdAppt = null;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      createdAppt = { _id: 'appt-' + Date.now(), ...appointmentData };
      store.appointments.unshift(createdAppt);

      // Customer update / create
      let cust = store.customers.find(c => c.phone === cleanPhone);
      if (cust) {
        cust.name = customerName;
        if (email) cust.email = email;
        cust.gender = gender;
        cust.totalAppointments = (cust.totalAppointments || 0) + 1;
        cust.lastVisit = date;
      } else {
        store.customers.push({
          _id: 'cust-' + Date.now(),
          name: customerName,
          phone: cleanPhone,
          email: email || '',
          gender,
          totalAppointments: 1,
          lastVisit: date,
          createdAt: new Date()
        });
      }
      saveMemoryStore();
    } else {
      createdAppt = await Appointment.create(appointmentData);

      // Customer update / create
      let cust = await Customer.findOne({ phone: cleanPhone });
      if (cust) {
        cust.name = customerName;
        if (email) cust.email = email;
        cust.gender = gender;
        cust.totalAppointments += 1;
        cust.lastVisit = date;
        await cust.save();
      } else {
        await Customer.create({
          name: customerName,
          phone: cleanPhone,
          email: email || '',
          gender,
          totalAppointments: 1,
          lastVisit: date
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: createdAppt
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to create appointment.' });
  }
});

// GET /api/appointments (Admin Protected)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, date, service, search } = req.query;

    if (isInMemoryDB()) {
      let list = [...getMemoryStore().appointments];

      if (status && status !== 'All') {
        list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }
      if (date) {
        list = list.filter(a => a.date === date);
      }
      if (service && service !== 'All') {
        list = list.filter(a => a.service.toLowerCase().includes(service.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          a =>
            a.appointmentId.toLowerCase().includes(q) ||
            a.customerName.toLowerCase().includes(q) ||
            a.phone.includes(q) ||
            a.service.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, count: list.length, appointments: list });
    }

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }
    if (service && service !== 'All') {
      query.service = { $regex: service, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { appointmentId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: appointments.length, appointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
  }
});

// GET /api/appointments/:id (Admin / Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB()) {
      const appt = getMemoryStore().appointments.find(a => a._id === id || a.appointmentId === id);
      if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
      return res.json({ success: true, appointment: appt });
    }

    const appt = await Appointment.findOne({
      $or: [{ _id: id }, { appointmentId: id }]
    });

    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving appointment.' });
  }
});

// PUT /api/appointments/:id (Admin Protected)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time, notes, service } = req.body;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const index = store.appointments.findIndex(a => a._id === id || a.appointmentId === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Appointment not found.' });

      const updated = {
        ...store.appointments[index],
        ...(status && { status }),
        ...(date && { date }),
        ...(time && { time }),
        ...(notes !== undefined && { notes }),
        ...(service && { service })
      };

      store.appointments[index] = updated;
      saveMemoryStore();
      return res.json({ success: true, appointment: updated, message: 'Appointment updated successfully.' });
    }

    const appt = await Appointment.findOne({
      $or: [{ _id: id }, { appointmentId: id }]
    });

    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    if (status) appt.status = status;
    if (date) appt.date = date;
    if (time) appt.time = time;
    if (notes !== undefined) appt.notes = notes;
    if (service) appt.service = service;

    await appt.save();
    return res.json({ success: true, appointment: appt, message: 'Appointment updated successfully.' });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to update appointment.' });
  }
});

// DELETE /api/appointments/:id (Admin Protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const index = store.appointments.findIndex(a => a._id === id || a.appointmentId === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Appointment not found.' });

      store.appointments.splice(index, 1);
      saveMemoryStore();
      return res.json({ success: true, message: 'Appointment deleted successfully.' });
    }

    const appt = await Appointment.findOneAndDelete({
      $or: [{ _id: id }, { appointmentId: id }]
    });

    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    return res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete appointment.' });
  }
});

module.exports = router;
