const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Steel Detailing', 'Rebar Detailing', 'Quantity Takeoff', 'Cost Estimation', 'BOQ Preparation', 'Shop Drawings', 'Other'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  size: {
    type: String,
    required: [true, 'Project size is required'],
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  value: {
    type: String,
    required: [true, 'Project value is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  image: {
    type: String,
    default: '',
  },
  imagePublicId: {
    type: String,
    default: '',
  },
  clientName: {
    type: String,
  },
  year: {
    type: Number,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);