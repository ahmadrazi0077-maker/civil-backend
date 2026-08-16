const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  icon: {
    type: String,
    default: '🛠️',
  },
  image: {
    type: String,
    default: '',
  },
  imagePublicId: {
    type: String,
    default: '',
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  features: [{
    type: String,
  }],
  price: {
    type: String,
    default: '',
  },
  timeline: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create slug from title if not provided
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);