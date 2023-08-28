const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./database.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Lire tous les articles
app.get("/articles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM articles");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

// Lire un article par ID
app.get("/articles/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM articles WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

// Ajouter un nouvel article
app.post("/articles", async (req, res) => {
  try {
    const { title, content, image_url, category_id } = req.body;
    const result = await pool.query(
      "INSERT INTO articles (title, content, image_url, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, image_url, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

// Mettre à jour un article
app.put("/articles/:id", async (req, res) => {
  try {
    const { title, content, image_url, category_id } = req.body;
    const result = await pool.query(
      "UPDATE articles SET title = $1, content = $2, image_url = $3, category_id = $4 WHERE id = $5 RETURNING *",
      [title, content, image_url, category_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

// Supprimer un article
app.delete("/articles/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM articles WHERE id = $1", [req.params.id]);
    res.status(204).send("Article supprimé");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur est survenue" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
