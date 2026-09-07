const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore, saveMemoryStore } = require('../config/db');

// GET /api/gallery (Public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (isInMemoryDB()) {
      let items = [...getMemoryStore().gallery];
      if (category && category !== 'All') {
        items = items.filter(g => g.category.toLowerCase() === category.toLowerCase());
      }
      return res.json({ success: true, count: items.length, gallery: items });
    }

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const gallery = await Gallery.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: gallery.length, gallery });
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery images.' });
  }
});

// POST /api/gallery (Admin Protected)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, category, image, cloudinaryUrl } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    const itemData = {
      title,
      category: category || 'General',
      image,
      cloudinaryUrl: cloudinaryUrl || '',
      createdAt: new Date()
    };

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const newItem = { _id: 'gal-' + Date.now(), ...itemData };
      store.gallery.unshift(newItem);
      saveMemoryStore();
      return res.status(201).json({ success: true, galleryItem: newItem, message: 'Image added to gallery.' });
    }

    const newItem = await Gallery.create(itemData);
    return res.status(201).json({ success: true, galleryItem: newItem, message: 'Image added to gallery.' });
  } catch (err) {
    console.error('Error adding gallery item:', err);
    res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
});

// DELETE /api/gallery/:id (Admin Protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const index = store.gallery.findIndex(g => g._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
      store.gallery.splice(index, 1);
      saveMemoryStore();
      return res.json({ success: true, message: 'Gallery item deleted.' });
    }

    const item = await Gallery.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });

    return res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
});

module.exports = router;
