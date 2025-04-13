const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
    trim: true
  },
  personName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Online', 'Downloaded', 'Watched'],
    default: 'Online'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on every save
DataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Data', DataSchema);