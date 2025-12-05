const express = require('express');
const router = express.Router();

let moods = [
  { id: 1, text: 'Feeling great!', createdAt: new Date().toISOString() },
];

let nextId = 2;

router.get('/', (req, res) => {
  res.json(moods);
});

router.post('/', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }

  const mood = {
    id: nextId++,
    text,
    createdAt: new Date().toISOString(),
  };

  moods.push(mood);
  res.status(201).json(mood);
});

module.exports = router;
