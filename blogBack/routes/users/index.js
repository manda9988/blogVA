const express = require('express');
const { registerUser, registerValidators } = require('./registerUser');
const loginUser = require('./loginUser');
const getAllUsers = require('./getAllUsers');
const deleteUser = require('./deleteUser');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.post('/register', registerValidators, registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/:username', deleteUser);
router.get('/verifyToken', verifyToken);

module.exports = router;
