// usersRoutes.js

// Importation des modules nécessaires
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const pool = require('./database');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Pour la manipulation des fichiers
const path = require('path'); // Pour la manipulation des chemins de fichiers

const router = express.Router();

// Validations pour l'enregistrement d'un utilisateur
const registerValidators = [
  check('username').notEmpty().withMessage("Le nom d'utilisateur est requis"),
  check('email').isEmail().withMessage("L'adresse e-mail n'est pas valide"),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

// Fonction pour nettoyer les images non utilisées d'un utilisateur spécifique
async function cleanupImagesForUser(userId) {
  try {
    const articles = await pool.query(
      'SELECT imageurl FROM articles WHERE user_id = $1',
      [userId],
    );
    for (const row of articles.rows) {
      const imageUrl = row.imageurl;
      const imagePath = path.join(__dirname, 'img', path.basename(imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  } catch (err) {
    console.error('Error during image cleanup for user:', err);
  }
}

// Route pour l'enregistrement d'un nouvel utilisateur
router.post('/register', registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'votre_email@example.com' ? 'admin' : 'user';
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role],
    );
    res
      .status(201)
      .json({ message: 'Utilisateur créé avec succès', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour la connexion d'un utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'Aucun utilisateur trouvé avec cet email' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      const token = jwt.sign(
        { userId: user.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: '4h' },
      );
      res.json({
        message: 'Connexion réussie',
        user: user.rows[0],
        userId: user.rows[0].id,
        token: token,
      });
    } else {
      res.status(400).json({ error: 'Mot de passe incorrect' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users',
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route pour supprimer un utilisateur par son nom d'utilisateur
router.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Avant de supprimer l'utilisateur, supprimons d'abord ses images.
    await cleanupImagesForUser(user.rows[0].id);

    await pool.query('DELETE FROM users WHERE username = $1', [username]);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour vérifier la validité d'un token JWT
router.get('/verifyToken', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
    res.status(200).json({ valid: true });
  });
});

module.exports = router;
