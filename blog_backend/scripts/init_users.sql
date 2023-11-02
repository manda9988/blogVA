-- init_users.sql
CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashé et salé
    role VARCHAR(255) NOT NULL, -- 'admin' ou 'user'
  );
