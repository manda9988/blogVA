// database.js

// Importation des modules nécessaires
require('dotenv').config(); // Configuration des variables d'environnement
const { Pool } = require('pg'); // Module PostgreSQL pour Node.js

// Création d'une nouvelle instance de Pool pour la connexion à la base de données
// Les informations de connexion sont récupérées des variables d'environnement
const pool = new Pool({
  user: process.env.DB_USER, // Nom d'utilisateur de la base de données
  host: process.env.DB_HOST, // Hôte de la base de données
  database: process.env.DB_NAME, // Nom de la base de données
  password: process.env.DB_PASSWORD, // Mot de passe de la base de données
  port: process.env.DB_PORT, // Port de la base de données
});

// Exportation de l'instance de Pool pour être utilisée dans d'autres fichiers
module.exports = pool;

// Ce fichier est responsable de la configuration de la connexion à la base de données PostgreSQL. Il utilise le module pg pour créer une instance de Pool, qui gère un ensemble de connexions à la base de données. Les informations de connexion sont récupérées des variables d'environnement définies dans le fichier .env.
