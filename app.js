const express = require('express');
const morgan = require('morgan');
const DB = require('./src/db');
const db = new DB('weather');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

app.get('/weather', function(req, res) {
  db.read().then(data => res.json(data));
});

app.post('/weather', function(req, res) {
  const data = req.body;
  db.insert(data).then(() => res.json({ result: 'success' }));
});

app.delete('/weather/:id', async function(req, res) {
  const id = req.params.id;

  const deleteOp = await db.delete(id);
  res.json({ result: 'success' });
});

app.post('/weather/update', async function(req, res) {
  const data = req.body;

  const updateOp = await db.update(data._id, data);
  res.json({ result: 'success' });
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
