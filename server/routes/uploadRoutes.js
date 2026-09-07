const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { verifyAdmin } = require('../middleware/auth');

// Configure Cloudinary if credentials present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_salon') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload (Admin Protected)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const fileBuffer = req.file.buffer;
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // If Cloudinary is configured with valid credentials
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo_salon' &&
      process.env.CLOUDINARY_API_KEY
    ) {
      try {
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'beauty_salon_uploads'
        });
        return res.json({
          success: true,
          imageUrl: result.secure_url,
          cloudinaryUrl: result.secure_url,
          public_id: result.public_id
        });
      } catch (cloudinaryErr) {
        console.warn('Cloudinary upload warning:', cloudinaryErr.message);
        // Fallback to data URI
        return res.json({
          success: true,
          imageUrl: base64Image,
          cloudinaryUrl: base64Image,
          message: 'Image converted locally (Cloudinary fallback).'
        });
      }
    }

    // Direct Base64 / Local URL Fallback
    return res.json({
      success: true,
      imageUrl: base64Image,
      cloudinaryUrl: base64Image,
      message: 'Uploaded as data URL.'
    });
  } catch (err) {
    console.error('Error during image upload:', err);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
});

module.exports = router;
