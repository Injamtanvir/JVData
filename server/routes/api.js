// server/routes/api.js
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get record by code
router.get('/records/:code', async (req, res) => {
  try {
    // Convert code to uppercase
    const code = req.params.code.toUpperCase();
    const record = await Record.findOne({ code });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search records by person name
router.get('/search/name/:name', async (req, res) => {
  try {
    const name = req.params.name.toUpperCase();
    const records = await Record.find({ 
      personName: { $regex: name, $options: 'i' } 
    });
    
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new record
router.post('/records', async (req, res) => {
  try {
    const { code, personName, link, description, status } = req.body;
    
    // Check if code already exists
    const existingRecord = await Record.findOne({ code: code.toUpperCase() });
    
    if (existingRecord) {
      return res.status(400).json({ message: 'Code already exists' });
    }
    
    // Create new record
    const newRecord = new Record({
      code: code.toUpperCase(),
      personName: personName.toUpperCase(),
      link: link || '',
      description: description || '',
      status: status.toUpperCase()
    });
    
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing record
router.put('/records/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { personName, link, description, status } = req.body;
    
    // Update record
    const updatedRecord = await Record.findOneAndUpdate(
      { code },
      { 
        personName: personName.toUpperCase(),
        link: link || '',
        description: description || '',
        status: status.toUpperCase(),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a record
router.delete('/records/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const deletedRecord = await Record.findOneAndDelete({ code });
    
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;