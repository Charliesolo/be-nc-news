const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { serverErrorHandling, psqlErrorHandling, customErrorHandling } = require('./error-handling');
const app = express();
const endpoints = require('./endpoints.json');
const { getArticleById } = require('./controllers/articles.controllers');


app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
} )

app.get('/api/topics', getAllTopics )

app.get('/api/articles/:article_id', getArticleById)


//last endpoint
app.all('/*', (request, response, next)=>{
    response.status(404).send({msg: 'Not Found'})
})

//error handling
app.use(psqlErrorHandling)

app.use(customErrorHandling)



//last error handler
app.use(serverErrorHandling)




module.exports = app;