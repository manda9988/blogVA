// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const articlesRoutes = require('./articlesRoutes'); // Importer les routes d'articles
const usersRoutes = require('./usersRoutes'); // Importer les routes d'utilisateurs

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Assure-toi que ce port est correct
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

// Servir les fichiers statiques du dossier "img"
app.use('/img', express.static(path.join(__dirname, 'img')));

// Servir les fichiers statiques de votre application Svelte
app.use(express.static(path.join(__dirname, '../blogFrontV2/dist')));

// Parse le body en JSON avec une limite augmentée
app.use(express.json({ limit: '50mb' })); // Augmenter la limite à 50mb

// Utiliser les routes d'articles
app.use('/articles', articlesRoutes);

// Utiliser les routes d'utilisateurs
app.use('/users', usersRoutes); // Ajouté pour utiliser les routes d'utilisateurs

// Ce bloc doit être ajouté à la fin pour gérer les routes côté client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../blogFrontV2/dist/index.html'));
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
