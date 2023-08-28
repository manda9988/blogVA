const { Pool } = require("pg");

const pool = new Pool({
  user: "myusername",
  host: "localhost",
  database: "blog_backend_db",
  password: "mypassword",
  port: 5432,
});

module.exports = pool;
