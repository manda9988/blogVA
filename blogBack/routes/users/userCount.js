// userCount.js
const express = require('express');
const pool = require('../../config/database');

const router = express.Router();

router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const count = parseInt(result.rows[0].count);
    console.log("Nombre d'utilisateurs renvoyé:", count); // Log du résultat
    res.json({ count });
  } catch (error) {
    console.error('Error querying the database:', error); // Log d'erreur
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
