// app.js

// Importation des modules natifs
const path = require('path');

// Importation des modules tiers
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importation des configurations et routes personnalisées
const corsConfig = require('./config/corsConfig');
const articlesRoutes = require('./routes/articles'); // Changement ici
const usersRoutes = require('./routes/users');

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors(corsConfig));

// Middlewares pour servir les fichiers statiques et parser les requêtes JSON
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, '../blogFrontV2/dist')));
app.use(express.json({ limit: '50mb' }));

// Routes personnalisées
app.use('/articles', articlesRoutes);
app.use('/users', usersRoutes);

// Route par défaut pour servir le frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../blogFrontV2/dist/index.html'));
});

// Démarrage du serveur
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
