const express = require('express');
const multer = require('multer');
const pool = require('../../config/database');
const authenticateJWT = require('../../middlewares/authMiddleware');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.put(
  '/:id',
  authenticateJWT,
  multer({ dest: 'img/' }).single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;

    try {
      const existingArticle = await pool.query(
        'SELECT * FROM articles WHERE id = $1',
        [id],
      );

      if (existingArticle.rows.length === 0) {
        return res.status(404).send('Article not found');
      }

      const oldImageurl = existingArticle.rows[0].imageurl;
      let newImageurl = req.file ? `/img/${req.file.filename}` : undefined;

      if (newImageurl) {
        const oldImagePath = path.join(
          __dirname,
          '../../img',
          path.basename(oldImageurl),
        );
        fs.unlinkSync(oldImagePath);
      } else {
        newImageurl = oldImageurl;
      }

      // Ajout de la date de modification actuelle
      const modifiedDate = new Date(); // Nouvelle ligne ajoutée

      // Mise à jour des valeurs, y compris la date de modification
      const values = [title, content, category, newImageurl, modifiedDate, id]; // Modification ici pour inclure modifiedDate

      // Mise à jour de la requête pour inclure modified_date
      const query =
        'UPDATE articles SET title = $1, content = $2, category = $3, imageurl = $4, modified_date = $5 WHERE id = $6 RETURNING *'; // Modification ici pour inclure modified_date

      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Article not found after update');
      }
    } catch (error) {
      console.error('Error updating the article:', error);
      res.status(500).send('Internal Server Error');
    }
  },
);

module.exports = router;
