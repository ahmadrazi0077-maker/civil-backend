const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

// @route   POST /api/upload
// @desc    Upload file to Cloudinary
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { file, folder = 'civil-services', fileName } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const uploadOptions = {
      folder: folder,
      resource_type: 'auto', // Support PDF, DWG, images
      public_id: fileName 
        ? `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}` 
        : undefined,
      use_filename: true,
      unique_filename: true,
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      name: fileName || result.original_filename,
      size: result.bytes,
      type: result.format,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

module.exports = router;