// deleteUser.js
const pool = require('../../config/database');
const path = require('path');
const fs = require('fs');

async function cleanupImagesForUser(userId) {
  try {
    const articles = await pool.query(
      'SELECT imageurl FROM articles WHERE user_id = $1',
      [userId],
    );
    for (const row of articles.rows) {
      const imageUrl = row.imageurl;
      const imagePath = path.join(
        __dirname,
        '../../img',
        path.basename(imageUrl),
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  } catch (err) {
    console.error(
      "Erreur lors du nettoyage des images pour l'utilisateur:",
      err,
    );
  }
}

async function deleteUser(req, res) {
  try {
    const { username } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await cleanupImagesForUser(user.rows[0].id);

    await pool.query('DELETE FROM users WHERE username = $1', [username]);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = deleteUser;
