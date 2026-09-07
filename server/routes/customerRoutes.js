const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Appointment = require('../models/Appointment');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore } = require('../config/db');

// GET /api/customers (Admin Protected)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { search } = req.query;

    if (isInMemoryDB()) {
      let customers = [...getMemoryStore().customers];
      if (search) {
        const q = search.toLowerCase();
        customers = customers.filter(
          c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q))
        );
      }
      return res.json({ success: true, count: customers.length, customers });
    }

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: customers.length, customers });
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customers.' });
  }
});

// GET /api/customers/:id (Admin Protected)
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB()) {
      const cust = getMemoryStore().customers.find(c => c._id === id || c.phone === id);
      if (!cust) return res.status(404).json({ success: false, message: 'Customer not found.' });

      const appointments = getMemoryStore().appointments.filter(a => a.phone === cust.phone);
      return res.json({ success: true, customer: cust, appointments });
    }

    const cust = await Customer.findOne({
      $or: [{ _id: id }, { phone: id }]
    });

    if (!cust) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const appointments = await Appointment.find({ phone: cust.phone }).sort({ createdAt: -1 });

    return res.json({ success: true, customer: cust, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving customer profile.' });
  }
});

module.exports = router;
