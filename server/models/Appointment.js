const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  gender: { type: String, required: true },
  service: { type: String, required: true },
  serviceId: { type: String, default: '' },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  time: { type: String, required: true }, // e.g. "11:00 AM"
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
