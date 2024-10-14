const express = require('express');
const { getAllTopics } = require('./controllers/topics.controllers');
const { serverErrorHandling } = require('./error-handling');
const app = express();
const endpoints = require('./endpoints.json')


app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
} )

app.get('/api/topics', getAllTopics )


//last endpoint
app.all('/*', (request, response, next)=>{
    response.status(404).send({msg: 'Not Found'})
})

//error handling



//last error handler
app.use(serverErrorHandling)




module.exports = app;