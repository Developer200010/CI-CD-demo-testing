// src/app.js
const express = require('express');
const cors = require('cors');
const moodsRouter = require('./moodsRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/moods', moodsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Mood Board API up and running' });
});

module.exports = app;
