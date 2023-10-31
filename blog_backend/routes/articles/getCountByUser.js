const express = require('express');
const router = express.Router();
const pool = require('../../database');

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
    console.error('Error querying the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
