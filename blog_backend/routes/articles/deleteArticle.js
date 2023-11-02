const express = require('express');
const pool = require('../../config/database');
const authenticateJWT = require('../../middlewares/authMiddleware');
const cleanupUnusedImages = require('../../utils/imageUtils');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send('Article not found');
    }
    const article = result.rows[0];
    const imagePath = path.join(
      __dirname,
      '../../img',
      path.basename(article.imageurl),
    );
    fs.unlinkSync(imagePath);
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    await cleanupUnusedImages();
    res.status(204).send('Article and associated image deleted successfully');
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
