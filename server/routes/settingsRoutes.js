const express = require('express');
const router = express.Router();
const SalonSettings = require('../models/SalonSettings');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore, saveMemoryStore } = require('../config/db');

// GET /api/settings (Public)
router.get('/', async (req, res) => {
  try {
    if (isInMemoryDB()) {
      const settings = getMemoryStore().settings || {};
      return res.json({ success: true, settings });
    }

    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create({});
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ success: false, message: 'Failed to load salon settings.' });
  }
});

// PUT /api/settings (Admin Protected)
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const {
      salonName,
      tagline,
      logo,
      phone,
      whatsapp,
      email,
      address,
      openingHours,
      closingHours,
      holidays,
      socialLinks,
      mapLocation
    } = req.body;

    if (isInMemoryDB()) {
      const store = getMemoryStore();
      const current = store.settings || {};

      store.settings = {
        ...current,
        ...(salonName && { salonName }),
        ...(tagline && { tagline }),
        ...(logo !== undefined && { logo }),
        ...(phone && { phone }),
        ...(whatsapp && { whatsapp }),
        ...(email && { email }),
        ...(address && { address }),
        ...(openingHours && { openingHours }),
        ...(closingHours && { closingHours }),
        ...(holidays && { holidays }),
        ...(socialLinks && { socialLinks }),
        ...(mapLocation && { mapLocation })
      };

      saveMemoryStore();
      return res.json({ success: true, settings: store.settings, message: 'Salon settings updated successfully.' });
    }

    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = new SalonSettings();
    }

    if (salonName) settings.salonName = salonName;
    if (tagline) settings.tagline = tagline;
    if (logo !== undefined) settings.logo = logo;
    if (phone) settings.phone = phone;
    if (whatsapp) settings.whatsapp = whatsapp;
    if (email) settings.email = email;
    if (address) settings.address = address;
    if (openingHours) settings.openingHours = openingHours;
    if (closingHours) settings.closingHours = closingHours;
    if (holidays) settings.holidays = holidays;
    if (socialLinks) settings.socialLinks = socialLinks;
    if (mapLocation) settings.mapLocation = mapLocation;

    await settings.save();
    return res.json({ success: true, settings, message: 'Salon settings updated successfully.' });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update salon settings.' });
  }
});

module.exports = router;
