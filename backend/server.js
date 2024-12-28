// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import the DB connection
const connectDB = require('./config/db');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
app.use(express.json()); // For parsing JSON data

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Connect to MongoDB using the connectDB function from db.js
connectDB();

// Import the auth routes
const authRoutes = require('./routes/authRoutes'); // Path to your auth routes
const adminRoutes = require('./routes/adminRoutes'); // Ensure this line is present

// Use the auth routes
app.use('/api/auth', authRoutes); // Mount the auth routes at /api/auth
app.use('/api/admin', adminRoutes); // Ensure this line is present

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
