const jwt = require('jsonwebtoken');

function verifyToken(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
    res.status(200).json({ valid: true });
  });
}

module.exports = verifyToken;
