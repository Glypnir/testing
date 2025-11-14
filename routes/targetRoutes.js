const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Lokasi file users.json
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper baca JSON
function readJSON(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data || '[]'));
    });
  });
}

// Helper tulis JSON
function writeJSON(file, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(content, null, 2), 'utf8', err => {
      if (err) return reject(err);
      resolve();
    });
  });
}


// =============== CREATE TARGET ==================
router.post('/targets', async (req, res) => {
  try {
    const { title, description, durationMinutes, dueDate, userId } = req.body;

    const users = await readJSON(USERS_FILE);
    const userIdx = users.findIndex(u => u.id === userId);

    if (userIdx === -1)
      return res.status(404).json({ message: 'User not found' });

    const newTarget = {
      id: uuidv4(),
      title: title || 'Untitled',
      description: description || '',
      durationMinutes: Number(durationMinutes) || 0,
      progressMinutes: 0,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      completed: false
    };

    users[userIdx].targets.push(newTarget);
    await writeJSON(USERS_FILE, users);

    res.status(201).json({ target: newTarget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// =============== UPDATE TARGET ==================
router.put('/targets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, ...updates } = req.body;

    const users = await readJSON(USERS_FILE);
    const userIdx = users.findIndex(u => u.id === userId);

    if (userIdx === -1)
      return res.status(404).json({ message: 'User not found' });

    const tIdx = users[userIdx].targets.findIndex(t => t.id === id);
    if (tIdx === -1)
      return res.status(404).json({ message: 'Target not found' });

    users[userIdx].targets[tIdx] = {
      ...users[userIdx].targets[tIdx],
      ...updates
    };

    // Auto completed
    const target = users[userIdx].targets[tIdx];
    if (target.progressMinutes >= target.durationMinutes && target.durationMinutes > 0) {
      target.completed = true;
    }

    await writeJSON(USERS_FILE, users);

    res.json({ target });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// =============== DELETE TARGET ==================
router.delete('/targets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;

    const users = await readJSON(USERS_FILE);
    const userIdx = users.findIndex(u => u.id === userId);

    if (userIdx === -1)
      return res.status(404).json({ message: 'User not found' });

    users[userIdx].targets = users[userIdx].targets.filter(t => t.id !== id);
    await writeJSON(USERS_FILE, users);

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
