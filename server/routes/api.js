const express = require('express');
const router = express.Router();
// const Data = require('../models/Data');
const Data = require('../models/data'); // Adjust the path as necessary

// @route   POST api/data
// @desc    Create a new data entry
// @access  Public
router.post('/data', async (req, res) => {
  try {
    const { code, personName, link, description, status } = req.body;
    
    // Check if code already exists
    const existingData = await Data.findOne({ code });
    if (existingData) {
      return res.status(400).json({ message: 'A record with this code already exists.' });
    }
    
    // Create new data entry
    const newData = new Data({
      code: code.toUpperCase(),
      personName: personName.toUpperCase(),
      link,
      description,
      status
    });
    
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/data/:id
// @desc    Update a data entry
// @access  Public
router.put('/data/:id', async (req, res) => {
  try {
    const { code, personName, link, description, status } = req.body;
    
    // Check if code exists but belongs to a different record
    const existingData = await Data.findOne({ 
      code: code.toUpperCase(), 
      _id: { $ne: req.params.id } 
    });
    
    if (existingData) {
      return res.status(400).json({ message: 'This code is already in use by another record.' });
    }
    
    // Find and update the data
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      {
        code: code.toUpperCase(),
        personName: personName.toUpperCase(),
        link,
        description,
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedData) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(updatedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/search/code/:code
// @desc    Search data by code (partial match)
// @access  Public
router.get('/search/code/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const data = await Data.find({ 
      code: { $regex: code, $options: 'i' } 
    }).sort({ code: 1 }).limit(10);
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/search/name/:name
// @desc    Search data by person name (partial match)
// @access  Public
router.get('/search/name/:name', async (req, res) => {
  try {
    const name = req.params.name.toUpperCase();
    const data = await Data.find({ 
      personName: { $regex: name, $options: 'i' } 
    }).sort({ personName: 1, code: 1 }).limit(10);
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/data/:id
// @desc    Get a data entry by ID
// @access  Public
router.get('/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
