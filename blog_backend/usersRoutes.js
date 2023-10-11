// usersRoutes.js
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const pool = require('./database');
const jwt = require('jsonwebtoken');

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

router.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query('DELETE FROM users WHERE username = $1', [
      username,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

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
