const express = require('express');
const cors = require('cors');
const moodsRouter = require('./moodsRouter');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/moods', moodsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Mood Board API up and running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app; // for tests
