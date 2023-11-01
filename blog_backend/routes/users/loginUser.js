const pool = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(req, res) {
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
}

module.exports = loginUser;
