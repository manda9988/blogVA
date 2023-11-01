const pool = require('../../database');

async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users',
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
}

module.exports = getAllUsers;
