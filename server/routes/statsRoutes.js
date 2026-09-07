const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore } = require('../config/db');

// GET /api/stats/dashboard (Admin Protected)
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const appts = store.appointments || [];
      const customers = store.customers || [];
      const services = store.services || [];

      const todayAppts = appts.filter(a => a.date === todayStr);
      const pendingAppts = appts.filter(a => a.status === 'Pending');
      const confirmedAppts = appts.filter(a => a.status === 'Confirmed');
      const completedAppts = appts.filter(a => a.status === 'Completed');
      const cancelledAppts = appts.filter(a => a.status === 'Cancelled');

      // Top booked services distribution
      const serviceCounts = {};
      appts.forEach(a => {
        serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1;
      });

      const topServices = Object.keys(serviceCounts)
        .map(name => ({ name, count: serviceCounts[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return res.json({
        success: true,
        stats: {
          todayCount: todayAppts.length,
          pendingCount: pendingAppts.length,
          confirmedCount: confirmedAppts.length,
          completedCount: completedAppts.length,
          cancelledCount: cancelledAppts.length,
          totalAppointments: appts.length,
          totalCustomers: customers.length,
          totalServices: services.length,
          topServices,
          recentAppointments: appts.slice(0, 5)
        }
      });
    }

    const todayAppts = await Appointment.countDocuments({ date: todayStr });
    const pendingAppts = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppts = await Appointment.countDocuments({ status: 'Confirmed' });
    const completedAppts = await Appointment.countDocuments({ status: 'Completed' });
    const cancelledAppts = await Appointment.countDocuments({ status: 'Cancelled' });
    const totalAppointments = await Appointment.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalServices = await Service.countDocuments({ status: true });

    const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(5);

    // Group top booked services
    const topServicesAgg = await Appointment.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topServices = topServicesAgg.map(item => ({ name: item._id, count: item.count }));

    return res.json({
      success: true,
      stats: {
        todayCount: todayAppts,
        pendingCount: pendingAppts,
        confirmedCount: confirmedAppts,
        completedCount: completedAppts,
        cancelledCount: cancelledAppts,
        totalAppointments,
        totalCustomers,
        totalServices,
        topServices,
        recentAppointments
      }
    });
  } catch (err) {
    console.error('Error calculating dashboard stats:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
});

module.exports = router;
