// app.js
const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'img/' });
const app = express();

// Configuration CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

// Servir les fichiers statiques du dossier "img"
app.use('/img', express.static(path.join(__dirname, 'img')));

// Servir les fichiers statiques de votre application Svelte
app.use(express.static(path.join(__dirname, '../blogFrontV2/dist')));

// Parse le body en JSON avec une limite augmentée
app.use(express.json({ limit: '50mb' })); // Augmenter la limite à 50mb

// Création d'un nouvel article avec image
app.post('/articles', upload.single('image'), async (req, res) => {
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

// ... (le reste de votre code pour les autres routes)

// Récupérer tous les articles
app.get('/articles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles ORDER BY id DESC'); // Correction ici

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Récupérer un article par son ID
app.get('/articles/:id', async (req, res) => {
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

// Mettre à jour un article
app.put('/articles/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const imageurl = req.file ? `/img/${req.file.filename}` : undefined;
    const values = [title, content, category];
    let query = 'UPDATE articles SET title = $1, content = $2, category = $3';
    if (imageurl) {
      query += ', imageurl = $4';
      values.push(imageurl);
    }
    query += ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
    values.push(id);
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

// Supprimer un article
app.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.status(204).send('Article deleted');
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Ce bloc doit être ajouté à la fin pour gérer les routes côté client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../blogFrontV2/dist/index.html'));
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`,
  );
});
