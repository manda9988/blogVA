const express = require('express');
const router = express.Router();
const pool = require('../../config/database');

router.get('/', async (req, res) => {
  let query = `
        SELECT articles.id, articles.title, articles.content, articles.category, articles.imageurl, articles.published_date, articles.modified_date, users.username, users.id AS user_id  
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
    console.error('Error querying the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
