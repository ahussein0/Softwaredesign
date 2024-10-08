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

// Stronger password validation
function isPasswordStrong(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;  // At least 6 chars, 1 letter, 1 number
  return passwordRegex.test(password);
}

function isFieldValid(field, minLength = 1) {
  return field && field.length >= minLength;
}

// Date validation: Ensure it's in the format YYYY-MM-DD
function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;  // Example: YYYY-MM-DD
  return dateRegex.test(dateString);
}

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration route with stronger password validation
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({ status: 'failure', message: 'Password must contain at least 6 characters, with at least 1 letter and 1 number' });
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

// Profile update route with better validation for skills and availability
app.post('/profile', (req, res) => {
  const { fullName, address, skills, availability } = req.body;

  if (!isFieldValid(fullName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Full name must be at least 3 characters long' });
  }

  if (!isFieldValid(address, 5)) {
    return res.status(400).json({ status: 'failure', message: 'Address must be at least 5 characters long' });
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ status: 'failure', message: 'Skills must be a non-empty array' });
  }

  if (!Array.isArray(availability) || availability.some(date => !isValidDate(date))) {
    return res.status(400).json({ status: 'failure', message: 'Availability must be a list of valid dates in the format YYYY-MM-DD' });
  }

  const email = 'user@example.com'; // Dummy user for this example
  if (users[email]) {
    users[email].profile = { fullName, address, skills, availability };
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } else {
    res.status(404).json({ status: 'failure', message: 'User not found' });
  }
});

// Event creation route with valid date check
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

  if (!isValidDate(eventDate)) {
    return res.status(400).json({ status: 'failure', message: 'Event date must be in the format YYYY-MM-DD' });
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
