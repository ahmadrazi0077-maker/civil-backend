const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

// POST request handle karega
router.post('/', async (req, res) => {
  try {
    const { file, folder = 'civil-services', fileName } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      name: fileName || result.original_filename,
    });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;