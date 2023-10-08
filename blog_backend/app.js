// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const articlesRoutes = require('./articlesRoutes');
const usersRoutes = require('./usersRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, '../blogFrontV2/dist')));
app.use(express.json({ limit: '50mb' }));
app.use('/articles', articlesRoutes);
app.use('/users', usersRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../blogFrontV2/dist/index.html'));
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
