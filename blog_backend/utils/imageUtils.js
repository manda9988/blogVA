// imageUtils.js
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const cleanupUnusedImages = async () => {
  const directory = path.join(__dirname, '..', 'img');
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
};

module.exports = cleanupUnusedImages;
