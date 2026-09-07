const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore, saveMemoryStore } = require('../config/db');

// GET /api/services (Public)
router.get('/', async (req, res) => {
  try {
    const { category, gender, search, all } = req.query;

    if (isInMemoryDB()) {
      let services = [...getMemoryStore().services];
      if (!all) {
        services = services.filter(s => s.status !== false);
      }
      if (category && category !== 'All') {
        services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
      }
      if (gender && gender !== 'All') {
        services = services.filter(s => s.gender === 'Unisex' || s.gender.toLowerCase() === gender.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        services = services.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return res.json({ success: true, count: services.length, services });
    }

    const query = {};
    if (!all) {
      query.status = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (gender && gender !== 'All') {
      query.$or = [{ gender: 'Unisex' }, { gender: gender }];
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: services.length, services });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
});

// GET /api/services/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isInMemoryDB()) {
      const service = getMemoryStore().services.find(s => s._id === id);
      if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
      return res.json({ success: true, service });
    }

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving service details.' });
  }
});

// POST /api/services (Admin Protected)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, category, gender, description, price, duration, image, status } = req.body;

    if (!name || !category || !description || price === undefined || duration === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required service fields.' });
    }

    const serviceData = {
      name,
      category,
      gender: gender || 'Unisex',
      description,
      price: Number(price),
      duration: Number(duration),
      image: image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      status: status !== undefined ? Boolean(status) : true,
      createdAt: new Date()
    };

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const newId = 'srv-' + Date.now();
      const newService = { _id: newId, ...serviceData };
      store.services.unshift(newService);
      saveMemoryStore();
      return res.status(201).json({ success: true, service: newService, message: 'Service created successfully.' });
    }

    const newService = await Service.create(serviceData);
    return res.status(201).json({ success: true, service: newService, message: 'Service created successfully.' });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
});

// PUT /api/services/:id (Admin Protected)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, gender, description, price, duration, image, status } = req.body;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const index = store.services.findIndex(s => s._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Service not found.' });

      const updated = {
        ...store.services[index],
        ...(name && { name }),
        ...(category && { category }),
        ...(gender && { gender }),
        ...(description && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(image && { image }),
        ...(status !== undefined && { status: Boolean(status) })
      };

      store.services[index] = updated;
      saveMemoryStore();
      return res.json({ success: true, service: updated, message: 'Service updated successfully.' });
    }

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

    if (name) service.name = name;
    if (category) service.category = category;
    if (gender) service.gender = gender;
    if (description) service.description = description;
    if (price !== undefined) service.price = Number(price);
    if (duration !== undefined) service.duration = Number(duration);
    if (image) service.image = image;
    if (status !== undefined) service.status = Boolean(status);

    await service.save();
    return res.json({ success: true, service, message: 'Service updated successfully.' });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
});

// DELETE /api/services/:id (Admin Protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const index = store.services.findIndex(s => s._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Service not found.' });
      store.services.splice(index, 1);
      saveMemoryStore();
      return res.json({ success: true, message: 'Service deleted successfully.' });
    }

    const service = await Service.findByIdAndDelete(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

    return res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
});

module.exports = router;
