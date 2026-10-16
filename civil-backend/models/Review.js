const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  service: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    minlength: 10,
    maxlength: 1000,
  },
  company: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  projectImage: {
    type: String,
    default: '',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  response: {
    text: String,
    respondedAt: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);