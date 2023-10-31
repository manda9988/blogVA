const express = require('express');
const multer = require('multer');
const pool = require('../../database');
const authenticateJWT = require('../../authMiddleware');

const router = express.Router();

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
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error');
    }
  },
);

module.exports = router;
