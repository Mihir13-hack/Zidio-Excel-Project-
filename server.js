// Basic Express server setup for Excel Analytics Platform
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Auth routes
app.use('/api/auth', require('./routes/auth'));

// File upload routes
app.use('/api/files', require('./routes/files'));

// History routes
app.use('/api/history', require('./routes/history'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));

// Example route
app.get('/', (req, res) => {
  res.send('Excel Analytics Platform API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
