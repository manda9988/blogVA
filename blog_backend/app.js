const express = require("express");
const cors = require("cors"); // Assurez-vous d'avoir installé ce package via npm
const pool = require("./database");
const app = express();

// Utilisation de CORS ici
app.use(
  cors({
    origin: "http://localhost:5173", // Remplacez par l'origine de votre frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// ... (reste du code)

app.post("/articles", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const result = await pool.query(
      "INSERT INTO articles (title, content, category) VALUES ($1, $2, $3) RETURNING *",
      [title, content, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Récupérer tous les articles
app.get("/articles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM articles");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Récupérer un article par son ID
app.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM articles WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Mettre à jour un article
app.put("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const result = await pool.query(
      "UPDATE articles SET title = $1, content = $2, category = $3 WHERE id = $4 RETURNING *",
      [title, content, category, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Supprimer un article
app.delete("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.status(204).send("Article deleted");
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Et ainsi de suite pour les catégories...

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}. Access it at http://localhost:${port}`
  );
});
