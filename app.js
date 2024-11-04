const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { serverErrorHandling, psqlErrorHandling, customErrorHandling } = require('./error-handling');
const app = express();

const { getArticleById, getAllArticles, patchArticleByID} = require('./controllers/articles.controllers');
const { getCommentsByArticleId, postComment, deleteCommentById } = require('./controllers/comments.controllers');
const { getAllUsers } = require('./controllers/users.controllers');
const apiRouter = require("./routers/api-router");

const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use('/api', apiRouter)

app.all('/*', (request, response, next)=>{
    response.status(404).send({msg: 'Not Found'})
})

app.use(psqlErrorHandling)

app.use(customErrorHandling)

app.use(serverErrorHandling)




module.exports = app;