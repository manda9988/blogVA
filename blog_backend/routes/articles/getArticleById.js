const express = require('express');
const router = express.Router();
const pool = require('../../database');

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
    console.error('Error querying the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
