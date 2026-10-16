const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  // NEW: File attachments
  attachments: [{
    name: String,
    url: String,
    publicId: String,
    size: Number,
    type: String,
  }],
  // Quote specific fields
  timeline: {
    type: String,
    default: 'standard',
  },
  isQuote: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  reply: {
    type: String,
    default: '',
  },
  repliedAt: Date,
  readAt: Date,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inquiry', inquirySchema);