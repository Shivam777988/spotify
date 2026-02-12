const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname,  '.env')
});
  // To use .env variables
console.log("Expected secret from .env:", process.env.ADMIN_SECRET);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt=require("bcryptjs")
const jwt = require('jsonwebtoken');
const cookieParser=require("cookie-parser");
const { configDotenv } = require('dotenv');
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
      email: userDoc.email
    });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});