// articlesRoutes.js

const express = require('express');
const multer = require('multer');
const pool = require('./database');
const fs = require('fs');
const path = require('path');

// Importation des utilitaires et middlewares séparés
const authenticateJWT = require('./authMiddleware');
const cleanupUnusedImages = require('./imageUtils');

const router = express.Router();

// Route pour récupérer tous les articles
router.get('/', async (req, res) => {
  let query = `
        SELECT articles.id, articles.title, articles.content, articles.category, articles.imageurl, articles.published_date, users.username, users.id AS user_id  
        FROM articles 
        LEFT JOIN users ON articles.user_id = users.id
    `;
  const values = [];
  if (req.query.userId) {
    query += ' WHERE user_id = $1';
    values.push(req.query.userId);
  }
  query += ' ORDER BY articles.id DESC';
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la requête à la base de données:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route pour créer un nouvel article
router.post(
  '/',
  authenticateJWT,
  multer({ dest: 'img/' }).single('image'),
  async (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user && req.user.userId;
    let imageurl = req.file ? `/img/${req.file.filename}` : null;
    const values = [title, content, category, imageurl, userId];
    try {
      const result = await pool.query(
        'INSERT INTO articles (title, content, category, imageurl, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values,
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la requête à la base de données:', error);
      res.status(500).send('Erreur interne du serveur');
    }
  },
);

// Route pour récupérer un article spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT articles.id, articles.title, articles.content, articles.category, articles.imageurl, articles.published_date, users.username, users.id AS user_id  
        FROM articles 
        LEFT JOIN users ON articles.user_id = users.id
        WHERE articles.id = $1
    `;
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (error) {
    console.error('Erreur lors de la requête à la base de données:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route pour obtenir le nombre d'articles publiés par un utilisateur spécifique
router.get('/countByUser/:userId', async (req, res) => {
  const { userId } = req.params;
  const query = `
        SELECT COUNT(*) 
        FROM articles 
        WHERE user_id = $1
    `;
  try {
    const result = await pool.query(query, [userId]);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Erreur lors de la requête à la base de données:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route pour mettre à jour un article spécifique par ID
router.put(
  '/:id',
  authenticateJWT,
  multer({ dest: 'img/' }).single('image'),
  async (req, res) => {
    console.log("Mise à jour de l'article avec l'ID:", req.params.id); // Log pour confirmer que la route est atteinte
    console.log(
      "Requête reçue pour mettre à jour l'article avec l'ID:",
      req.params.id,
    );
    console.log('Données reçues:', req.body);

    const { id } = req.params;
    const { title, content, category } = req.body;

    try {
      const existingArticle = await pool.query(
        'SELECT * FROM articles WHERE id = $1',
        [id],
      );

      if (existingArticle.rows.length === 0) {
        console.error("Article non trouvé pour l'ID:", id);
        return res.status(404).send('Article not found');
      }

      console.log('Article existant:', existingArticle.rows[0]); // Log pour voir les détails de l'article existant

      const oldImageurl = existingArticle.rows[0].imageurl;
      let newImageurl = req.file ? `/img/${req.file.filename}` : undefined;

      if (newImageurl) {
        const oldImagePath = path.join(
          __dirname,
          'img',
          path.basename(oldImageurl),
        );
        fs.unlinkSync(oldImagePath);
        console.log('Ancienne image supprimée:', oldImagePath); // Log pour confirmer la suppression de l'ancienne image
      } else {
        newImageurl = oldImageurl;
      }

      const values = [title, content, category, newImageurl, id];
      const query =
        'UPDATE articles SET title = $1, content = $2, category = $3, imageurl = $4 WHERE id = $5 RETURNING *';
      const result = await pool.query(query, values);

      console.log('Article mis à jour:', result.rows[0]); // Log pour voir les détails de l'article mis à jour

      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Article not found after update');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error); // Log pour voir les détails de l'erreur
      res.status(500).send('Erreur interne du serveur');
    }
  },
);

// Route pour supprimer un article spécifique par ID
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
      'img',
      path.basename(article.imageurl),
    );
    fs.unlinkSync(imagePath);
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    await cleanupUnusedImages();
    res.status(204).send('Article and associated image deleted successfully');
  } catch (error) {
    console.error('Erreur lors de la requête à la base de données:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

module.exports = router;
