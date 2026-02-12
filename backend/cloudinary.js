// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'songs',
    resource_type: 'auto', // very important for MP3
    allowed_formats: ['mp3']
  },
});

// Multer Setup
const upload = multer({ storage });

module.exports = { cloudinary, upload };
