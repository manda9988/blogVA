const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const pool = require('./database'); // Assurez-vous que ce chemin est correct

const router = express.Router();

const registerValidators = [
  check('username').notEmpty().withMessage("Le nom d'utilisateur est requis"),
  check('email').isEmail().withMessage("L'adresse e-mail n'est pas valide"),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

router.post('/register', registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Définir le rôle en fonction de l'adresse e-mail
    const role = email === 'votre_email@example.com' ? 'admin' : 'user';

    // Enregistrer l'utilisateur dans la base de données avec le rôle approprié
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

router.post('/login', (req, res) => {
  // Implémenter la logique de connexion ici
  // ...
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users',
    ); // Sélectionnez seulement les colonnes qui sont sûres à exposer
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
