const express = require('express');
const router = express.Router();

// Importation des routes modulaires
const getAllArticles = require('./getAllArticles');
const createArticle = require('./createArticle');
const getArticleById = require('./getArticleById');
const getCountByUser = require('./getCountByUser');
const updateArticle = require('./updateArticle');
const deleteArticle = require('./deleteArticle');

router.use('/', getAllArticles);
router.use('/', createArticle);
router.use('/', getArticleById);
router.use('/', getCountByUser);
router.use('/', updateArticle);
router.use('/', deleteArticle);

module.exports = router;
