const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(createInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .put(protect, updateInquiry)
  .delete(protect, deleteInquiry);

module.exports = router;