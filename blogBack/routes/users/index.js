// index.js
const express = require('express');
const { registerUser, registerValidators } = require('./registerUser');
const loginUser = require('./loginUser');
const getAllUsers = require('./getAllUsers');
const deleteUser = require('./deleteUser');
const verifyToken = require('./verifyToken');
const userCount = require('./userCount'); // Importer le routeur userCount

const router = express.Router();

router.post('/register', registerValidators, registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/:username', deleteUser);
router.get('/verifyToken', verifyToken);
router.get('/count', userCount); // Ajouter la route /count pour obtenir le nombre d'utilisateurs

module.exports = router;
