// corsConfig.js

const corsConfig = {
  origin: 'http://localhost:5173', // Adresse du frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
  credentials: true, // Autorise les cookies et les en-têtes d'authentification
};

module.exports = corsConfig;
