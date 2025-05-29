const express = require('express');
const multer = require('multer');
const historyController = require('../controllers/historyController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes
router.post('/add', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), historyController.addHistory);
router.get('/:userId', historyController.getHistoriesByUser);

module.exports = router;
