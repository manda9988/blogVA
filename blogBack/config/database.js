// database.js

// Importation des modules nécessaires
require('dotenv').config();
const { Pool } = require('pg');

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exportation de l'instance de Pool
module.exports = pool;
