// Assuming you have Express and other required modules set up
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/NPUBS', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB schema and model for pubkey
const pubkeySchema = new mongoose.Schema({
  pubkey: String,
});

const Pubkey = mongoose.model('Pubkey', pubkeySchema);

// API endpoint to store pubkey
app.post('/storePubkey', async (req, res) => {
  try {
    const { pubkey } = req.body;

    // Store pubkey in MongoDB
    const newPubkey = new Pubkey({ pubkey });
    await newPubkey.save();

    res.status(200).json({ message: 'Pubkey stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store pubkey' });
  }
});

// API endpoint to check if pubkey exists
app.post('/checkPubkey', async (req, res) => {
  try {
    const { pubkey } = req.body;

    // Check if pubkey exists in MongoDB
    const existingPubkey = await Pubkey.findOne({ pubkey });

    if (existingPubkey) {
      res.status(200).json({ existsInDatabase: true });
    } else {
      res.status(200).json({ existsInDatabase: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error checking pubkey' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
