// articlesRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'img/' });
const pool = require('./database');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageurl = `/img/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO articles (title, content, category, imageurl) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, category, imageurl],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT articles.id, articles.title, articles.content, articles.category, articles.imageurl, users.username, users.id AS user_id
  FROM articles 
  LEFT JOIN users ON articles.user_id = users.id
  ORDER BY articles.id DESC
`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
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
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image:', err);
    });
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    res.status(204).send('Article and associated image deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
