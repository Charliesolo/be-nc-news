const apiRouter = require("express").Router();
const endpoints = require('../endpoints.json');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

apiRouter.get("/", (request, response) => {    
    response.status(200).send({endpoints})
})

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/users', usersRouter)

module.exports = apiRouter