const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const targetRoutes = require('./routes/targetRoutes');
const reminderService = require('./services/reminderService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ===== SERVE STATIC FILES =====

// Serve static files dari folder public (HTML, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static CSS dari folder styles (jika CSS dipisah)
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// ===== API ROUTES =====
app.use('/api', targetRoutes);

// ===== FALLBACK UNTUK SPA =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START REMINDER SERVICE =====
reminderService.start();

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
