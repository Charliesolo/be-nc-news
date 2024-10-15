const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { serverErrorHandling, psqlErrorHandling, customErrorHandling } = require('./error-handling');
const app = express();
const endpoints = require('./endpoints.json');
const { getArticleById, getAllArticles} = require('./controllers/articles.controllers');
const { getCommentsByArticleId } = require('./controllers/comments.controllers');


app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
} )

app.get('/api/topics', getAllTopics )

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId )



app.all('/*', (request, response, next)=>{
    response.status(404).send({msg: 'Not Found'})
})

app.use(psqlErrorHandling)

app.use(customErrorHandling)

app.use(serverErrorHandling)




module.exports = app;