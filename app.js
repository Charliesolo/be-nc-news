const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { serverErrorHandling, psqlErrorHandling, customErrorHandling } = require('./error-handling');
const app = express();
const endpoints = require('./endpoints.json');
const { getArticleById, getAllArticles, patchArticleByID} = require('./controllers/articles.controllers');
const { getCommentsByArticleId, postComment } = require('./controllers/comments.controllers');

app.use(express.json())

app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
} )

app.get('/api/topics', getAllTopics )

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticleById)

app.patch('/api/articles/:article_id', patchArticleByID)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId )

app.post('/api/articles/:article_id/comments', postComment)



app.all('/*', (request, response, next)=>{
    response.status(404).send({msg: 'Not Found'})
})

app.use(psqlErrorHandling)

app.use(customErrorHandling)

app.use(serverErrorHandling)




module.exports = app;