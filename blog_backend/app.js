// app.js

// Importation des modules natifs
const path = require('path');

// Importation des modules tiers
require('dotenv').config(); // Configuration des variables d'environnement
const express = require('express'); // Framework web pour Node.js
const cors = require('cors'); // Middleware pour activer les requêtes cross-origin

// Importation des modules propres (routes personnalisées)
const articlesRoutes = require('./articlesRoutes'); // Routes pour les articles
const usersRoutes = require('./usersRoutes'); // Routes pour les utilisateurs

// Initialisation de l'application Express
const app = express();

// Configuration CORS pour permettre les requêtes cross-origin
// Ceci est nécessaire si le frontend et le backend sont sur des ports différents
app.use(
  cors({
    origin: 'http://localhost:5173', // Adresse du frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true, // Autorise les cookies et les en-têtes d'authentification
  }),
);

// Middleware pour servir les images depuis le dossier 'img'
app.use('/img', express.static(path.join(__dirname, 'img')));

// Middleware pour servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../blogFrontV2/dist')));

// Middleware pour parser les requêtes JSON (avec une limite de taille)
app.use(express.json({ limit: '50mb' }));

// Utilisation des routes personnalisées pour les articles et les utilisateurs
app.use('/articles', articlesRoutes);
app.use('/users', usersRoutes);

// Route par défaut pour servir le frontend
// Si aucune route précédente ne correspond, cette route enverra le fichier index.html du frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../blogFrontV2/dist/index.html'));
});

// Démarrage du serveur sur un port spécifique
const port = process.env.PORT || 3002; // Utilise le port défini dans les variables d'environnement ou 3002 par défaut
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
