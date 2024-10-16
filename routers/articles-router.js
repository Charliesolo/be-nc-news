const { getAllArticles, getArticleById, patchArticleByID } = require('../controllers/articles.controllers');
const { getCommentsByArticleId, postComment } = require('../controllers/comments.controllers');

const articlesRouter = require('express').Router()

articlesRouter.get('/', getAllArticles)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleByID);

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articlesRouter