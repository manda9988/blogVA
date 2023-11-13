// registerUser.js;
const { check, validationResult } = require('express-validator');
const pool = require('../../config/database');
const bcrypt = require('bcrypt');

const registerValidators = [
  check('username').notEmpty().withMessage("Le nom d'utilisateur est requis"),
  check('email').isEmail().withMessage("L'adresse e-mail n'est pas valide"),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

async function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Modification: Vérifier le nombre d'utilisateurs existants
  const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
  const userCount = parseInt(userCountResult.rows[0].count);

  if (userCount >= 4) {
    return res
      .status(400)
      .json({ error: 'La limite de 4 utilisateurs a été atteinte.' });
  }

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Modification de la logique d'attribution du rôle
    let role = 'user';
    if (email === 'votre_email@example.com' || email === 'manda@gmail.com') {
      role = 'admin';
    }

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
}

module.exports = { registerUser, registerValidators };
