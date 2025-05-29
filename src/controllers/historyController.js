const History = require('../models/history');
const { BlobServiceClient } = require('@azure/storage-blob');

const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(process.env.AZURE_BLOB_URL);

// POST: Add a new history with photo and audio uploaded to Azure Blob Storage
const addHistory = async (req, res) => {
    const { userId, extractedText } = req.body;

    // Validate fields
    if (!userId || !req.files || !req.files.photo || !req.files.audio || !extractedText) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const photo = req.files.photo[0];
    const audio = req.files.audio[0];

    try {
        // Upload photo to Blob Storage
        const photoContainerClient = blobServiceClient.getContainerClient(containerName);
        const photoBlobClient = photoContainerClient.getBlockBlobClient(`photos/${Date.now()}-${photo.originalname}`);
        await photoBlobClient.upload(photo.buffer, photo.size);

        // Upload audio to Blob Storage
        const audioBlobClient = photoContainerClient.getBlockBlobClient(`audios/${Date.now()}-${audio.originalname}`);
        await audioBlobClient.upload(audio.buffer, audio.size);

        // Save history to database
        const newHistory = new History({
            userId,
            photoUrl: photoBlobClient.url,
            extractedText,
            audioUrl: audioBlobClient.url,
        });
        const savedHistory = await newHistory.save();

        return res.status(201).json(savedHistory);
    } catch (error) {
        console.error('Error adding history:', error.message);
        return res.status(500).json({ error: 'Failed to add history' });
    }
};

// GET: Fetch all histories for a specific user
const getHistoriesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const histories = await History.find({ userId }).sort({ date: -1 });
        return res.status(200).json(histories);
    } catch (error) {
        console.error('Error fetching histories:', error.message);
        return res.status(500).json({ error: 'Failed to fetch histories' });
    }
};

module.exports = {
    addHistory,
    getHistoriesByUser,
};
