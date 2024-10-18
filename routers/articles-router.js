const { getAllArticles, getArticleById, patchArticleByID, postArticle, deleteArticleByID } = require('../controllers/articles.controllers');
const { getCommentsByArticleId, postComment } = require('../controllers/comments.controllers');

const articlesRouter = require('express').Router()

articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleByID)
    .delete(deleteArticleByID)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articlesRouter