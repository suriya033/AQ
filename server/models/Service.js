const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Hair', 'Skin', 'Grooming', 'Beauty'] },
  gender: { type: String, default: 'Unisex', enum: ['Unisex', 'Male', 'Female'] },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  image: { type: String, required: true },
  status: { type: Boolean, default: true }, // active or inactive
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
