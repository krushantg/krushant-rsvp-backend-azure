
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const rsvpRoutes = require('./routes/rsvp.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? 'https://krushant-rsvp-frontend.azurewebsites.net'
  : 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

/*app.use(cors({
  origin: 'https://krushant-rsvp-frontend.onrender.com',
  credentials: true
}));*/
/*app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://krushant-rsvp-frontend.azurewebsites.net' 
  : 'http://localhost:3000',
  credentials: true
}));*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rsvp', rsvpRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Database sync and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('âœ“ Database connected successfully');
    
    await sequelize.sync();
    console.log('âœ“ Database synced');

    app.listen(PORT, () => {
      console.log(`âœ“ Server is running on port ${PORT}`);
      console.log(`  Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('âœ— Failed to connect to database:', error);
    process.exit(1);
  }
}

startServer();
