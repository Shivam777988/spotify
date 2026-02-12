const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname,  '.env')
});
app.use(express.static(path.join(__dirname, "public")));
  // To use .env variables
console.log("Expected secret from .env:", process.env.ADMIN_SECRET);










const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt=require("bcryptjs")
const jwt = require('jsonwebtoken');
const cookieParser=require("cookie-parser");
const { configDotenv } = require('dotenv');
// const upload=require('./cloudinary');
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

mongoose.connect("mongodb://127.0.0.1:27017/spotifyLogin", {
   
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Database connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,  // In a real app, hash passwords using bcrypt
     role: { type: String, enum: ['user', 'admin'], default: 'user' } 
});
const User = mongoose.model("User", userSchema);

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});
// ✅ USER REGISTRATION
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// ✅ ADMIN REGISTRATION (Move this OUTSIDE of user route)
app.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
res.status(201).json({
  message: 'Admin registered successfully',
  success: true
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// routes/admin.js or in your main file
app.post('/check-admin-secret', (req, res) => {
  const { secret } = req.body;

  if (secret === process.env.ADMIN_SECRET) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(403).json({ success: false, message: "Invalid secret" });
  }
});
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json(null);
  }

  jwt.verify(token,  "your_secret", {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userDoc = await User.findById(userData.userId); // not .id
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      role:userDoc.role
    });
  });
});





const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for audio
const dynamicStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith('image/')) {
      return {
        folder: 'covers',
        resource_type: 'image',
        public_id: file.originalname.split('.')[0],
        
      };
    } else if (file.mimetype.startsWith('audio/')) {
      return {
        folder: 'songs',
        resource_type: 'video',
        format: 'mp3',
        public_id: file.originalname.split('.')[0],
      };
    }
  },
});

const upload = multer({ storage: dynamicStorage });


// ✅ 3. NOW define the route AFTER `upload` is initialized
app.post('/api/upload-song', upload.fields([{ name: 'song', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), (req, res) => {
  try {
    const songFile = req.files?.song?.[0];
    const coverFile = req.files?.cover?.[0];

    if (!songFile || !coverFile) {
      return res.status(400).json({ success: false, message: 'Missing song or cover file' });
    }

    res.json({
      success: true,
      url: songFile.path,
      coverUrl: coverFile.path,
      filename: songFile.originalname,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});


// Song model
const songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  url: String,
  coverUrl: String,  // <-- add this line
});

const Song = mongoose.model('Song', songSchema);

// Save metadata route
app.post('/api/save-song', async (req, res) => {
  try {
    const { name, artist, url, coverUrl } = req.body;
    const song = new Song({ name, artist, url, coverUrl });
    await song.save();
    res.json({ success: true, message: "Song saved" });
  } catch (err) {
    console.error("Save Song Error:", err);
    res.status(500).json({ success: false, message: "Failed to save song" });
  }
});


app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error("Fetch Songs Error:", err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});
app.get('/api/songs/:id',async (req,res) => {
    try{
      const song=await Song.findById(req.params.id);
      if(!song){
        return res.status(404).json({message:"place not found"})
      }
      res.json(song);
    }  catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    
})
// Update a song
app.put('/api/songs/:id', async (req, res) => {
  try {
    const { name, artist } = req.body;
    await Song.findByIdAndUpdate(req.params.id, { name, artist });
    res.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete a song
app.delete('/api/songs/:id', async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});