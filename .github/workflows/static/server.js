const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serve karega (index.html, script.js, css, images, etc.)
app.use(express.static(__dirname));

// Health endpoint (Azure troubleshooting ke liye useful)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Optional sample form submit endpoint
app.post('/submit', (req, res) => {
  console.log('Form data received:', req.body);
  res.status(200).json({
    success: true,
    message: 'Form submit ho gaya.'
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
