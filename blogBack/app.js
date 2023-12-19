// app.js

// Importation des modules natifs
const path = require('path');

// Importation des modules tiers
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importation des configurations et routes personnalisées
const corsConfig = require('./config/corsConfig');
const articlesRoutes = require('./routes/articles');
const usersRoutes = require('./routes/users');

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors(corsConfig));

// Middlewares pour parser les requêtes JSON
app.use(express.json({ limit: '50mb' }));

// Middleware pour servir les fichiers statiques (images)
app.use('/img', express.static(path.join(__dirname, 'img')));

// Routes personnalisées
app.use('/articles', articlesRoutes);
app.use('/users', usersRoutes);

// Modification: Configuration conditionnelle pour l'environnement de développement ou de production
if (process.env.NODE_ENV === 'production') {
  // En mode production, servir les fichiers statiques et index.html à partir du dossier 'dist'
  app.use(express.static(path.join(__dirname, '../blogFront/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../blogFront/dist/index.html'));
  });
}

// Démarrage du serveur
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
