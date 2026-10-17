const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    const { image, folder } = req.body;
    
    const result = await cloudinary.uploader.upload(image, {
      folder: folder || 'civil-services',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;