require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
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

app.use("/", () => {
    res.status(200).json({
        success: true,
        message: "Welcome to the OCR API"
    });
});