require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to OCR API',
        status: 'Server is running',
        version: '1.0.0'
    });
});

module.exports = app;