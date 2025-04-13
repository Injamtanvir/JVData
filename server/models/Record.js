// server/models/Record.js
const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,  // Automatically convert to uppercase
    trim: true
  },
  personName: {
    type: String,
    required: true,
    uppercase: true,  // Automatically convert to uppercase
    trim: true
  },
  link: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['ONLINE', 'DOWNLOADED', 'WATCHED'],
    required: true
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

// Pre-save middleware to update the 'updatedAt' timestamp
RecordSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Record', RecordSchema);