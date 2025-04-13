const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

