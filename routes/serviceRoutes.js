const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(protect, createService);

router.route('/:slug')
  .get(getServiceBySlug);

router.route('/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

module.exports = router;