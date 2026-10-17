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
    name: { type: String },
    url: { type: String },
    publicId: { type: String },
    size: { type: Number },
    type: { type: String },
    uploadFailed: { type: Boolean } // Fallback ke liye
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