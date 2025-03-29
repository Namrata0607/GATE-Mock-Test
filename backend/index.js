const express = require('express');
const app = express(); // app object is an instance of express
const questionRoute = require('./routes/questionsRoutes');
const userRoute = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const { connectDB } = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middlewares/errorHandler');
const { authMiddleware } = require('./middlewares/authMiddleware');

dotenv.config();

const port = 3000;

// Enable CORS for your frontend
app.use(
  cors({
    origin: "http://localhost:5174", // Change to your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Important for cookies
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

// Public routes (no authentication required)
app.use('/api/questions', questionRoute);
app.use('/api/staff', staffRoutes);

// Protected routes (authentication required)
// app.use(authMiddleware); // Apply auth middleware for routes below
// app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoute);
app.use('/api/staff/protected-route', staffRoutes);

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
