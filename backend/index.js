const express = require('express');
const app = express(); 
const { connectDB } = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

// const questionRoutes = require('./routes/questionsRoutes');
const userRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionRoutes = require('./routes/questionsRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { authMiddleware } = require('./middlewares/authMiddleware');
const branchRoutes = require('./routes/branchRoutes');


dotenv.config();

const port = 3000;

// Enable CORS for your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend URL
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
// app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api', branchRoutes);
app.use('/api/test', questionRoutes);
// app.use(authMiddleware); // Apply auth middleware for routes below


app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
