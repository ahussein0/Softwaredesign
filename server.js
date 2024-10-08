const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Dummy data
const users = {
  'user@example.com': { password: 'password123', profile: {} }
};
let events = [];
let volunteerHistory = [];

// Validation functions
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isFieldValid(field, minLength = 1) {
  return field && field.length >= minLength;
}

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration route
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
  }

  if (!isFieldValid(password, 6)) {
    return res.status(400).json({ status: 'failure', message: 'Password must be at least 6 characters long' });
  }

  if (users[email]) {
    return res.status(400).json({ status: 'failure', message: 'User already exists' });
  }

  users[email] = { password, profile: {} };
  res.status(201).json({ status: 'success', message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
  }

  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ status: 'failure', message: 'Invalid credentials' });
  }

  res.status(200).json({ status: 'success', message: 'Logged in successfully' });
});

// Profile update route
app.post('/profile', (req, res) => {
  const { fullName, address, skills, availability } = req.body;

  if (!isFieldValid(fullName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Full name must be at least 3 characters long' });
  }

  if (!isFieldValid(address, 5)) {
    return res.status(400).json({ status: 'failure', message: 'Address must be at least 5 characters long' });
  }

  const email = 'user@example.com'; // Dummy user for this example
  if (users[email]) {
    users[email].profile = { fullName, address, skills, availability };
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } else {
    res.status(404).json({ status: 'failure', message: 'User not found' });
  }
});

// Event creation route
app.post('/events', (req, res) => {
  const { eventName, eventLocation, requiredSkills, urgency, eventDate } = req.body;

  if (!isFieldValid(eventName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Event name must be at least 3 characters long' });
  }

  if (!isFieldValid(eventLocation, 5)) {
    return res.status(400).json({ status: 'failure', message: 'Event location must be at least 5 characters long' });
  }

  if (!requiredSkills || !Array.isArray(requiredSkills)) {
    return res.status(400).json({ status: 'failure', message: 'Required skills must be an array' });
  }

  if (!['high', 'medium', 'low'].includes(urgency)) {
    return res.status(400).json({ status: 'failure', message: 'Urgency must be one of high, medium, or low' });
  }

  if (!eventDate) {
    return res.status(400).json({ status: 'failure', message: 'Event date is required' });
  }

  const newEvent = { eventName, eventLocation, requiredSkills, urgency, eventDate };
  events.push(newEvent);
  res.status(201).json({ status: 'success', message: 'Event created successfully' });
});

// Volunteer matching route
app.post('/match', (req, res) => {
  const { volunteerName, eventName } = req.body;

  if (!isFieldValid(volunteerName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Volunteer name must be at least 3 characters long' });
  }

  if (!eventName) {
    return res.status(400).json({ status: 'failure', message: 'Event name is required' });
  }

  res.status(200).json({ status: 'success', message: `${volunteerName} has been matched to ${eventName}!` });
});

// History route (for displaying volunteer history)
app.get('/history', (req, res) => {
  res.status(200).json(volunteerHistory);
});

// Notifications route (for displaying notifications)
app.get('/notifications', (req, res) => {
  const notifications = [
    'You have been assigned to Community Cleanup on 2024-10-01',
    'Reminder: Food Drive is scheduled for 2024-09-15'
  ];
  res.status(200).json(notifications);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
