// articlesRoutes.js

// Importation des modules nécessaires
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pool = require('./database');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware pour authentifier le JWT
const authenticateJWT = (req, res, next) => {
  // Vérification de la présence du header d'autorisation
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token invalide ou expiré' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Token JWT manquant' });
  }
};

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
    const result = await pool.query(
      'INSERT INTO articles (title, content, category, imageurl, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values,
    );
    res.status(201).json(result.rows[0]);
  },
);

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
  const result = await pool.query(query, values);
  res.json(result.rows);
});

// Route pour récupérer un article spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT articles.id, articles.title, articles.content, articles.category, articles.imageurl, articles.published_date, users.username, users.id AS user_id  
        FROM articles 
        LEFT JOIN users ON articles.user_id = users.id
        WHERE articles.id = $1
    `;
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).send('Article not found');
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
  const result = await pool.query(query, [userId]);
  res.json({ count: parseInt(result.rows[0].count) });
});

// Route pour mettre à jour un article spécifique par ID
router.put(
  '/:id',
  multer({ dest: 'img/' }).single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const existingArticle = await pool.query(
      'SELECT * FROM articles WHERE id = $1',
      [id],
    );
    const oldImageurl = existingArticle.rows[0].imageurl;
    let newImageurl = req.file ? `/img/${req.file.filename}` : undefined;
    if (newImageurl) {
      const oldImagePath = path.join(
        __dirname,
        'img',
        path.basename(oldImageurl),
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    } else {
      newImageurl = oldImageurl;
    }
    const values = [title, content, category, newImageurl, id];
    const query =
      'UPDATE articles SET title = $1, content = $2, category = $3, imageurl = $4 WHERE id = $5 RETURNING *';
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Article not found');
    }
  },
);

// Fonction pour nettoyer les images non utilisées
async function cleanupUnusedImages() {
  const directory = path.join(__dirname, 'img');
  const filesInDirectory = fs.readdirSync(directory);
  for (const filename of filesInDirectory) {
    const imagePath = path.join(directory, filename);
    const imageUrl = `/img/${filename}`;
    const result = await pool.query(
      'SELECT * FROM articles WHERE imageurl = $1',
      [imageUrl],
    );
    if (result.rows.length === 0) {
      fs.unlinkSync(imagePath);
    }
  }
}

// Route pour supprimer un article spécifique par ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).send('Article not found');
  }
  const article = result.rows[0];
  const imagePath = path.join(
    __dirname,
    'img',
    path.basename(article.imageurl),
  );
  fs.unlink(imagePath, (err) => {
    if (err) console.error('Error deleting image:', err);
  });
  await pool.query('DELETE FROM articles WHERE id = $1', [id]);
  await cleanupUnusedImages();
  res.status(204).send('Article and associated image deleted successfully');
});

module.exports = router;
