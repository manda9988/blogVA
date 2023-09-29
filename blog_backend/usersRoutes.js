// usersRoutes.js
const express = require('express');
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const { check, validationResult } = require('express-validator'); // Pour valider les données

const router = express.Router();

// Middleware pour valider les données d'inscription
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
    const hashedPassword = await bcrypt.hash(password, 10); // Hasher le mot de passe

    // Enregistrer l'utilisateur dans la base de données
    // ...

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login', (req, res) => {
  // Implémenter la logique de connexion ici
});

module.exports = router;
