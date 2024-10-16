const { selectArticleById, selectAllArticles, updateArticlesVotes } = require("../models/articles.models")

exports.getArticleById = (request, response, next) => {
const { article_id }= request.params
selectArticleById(article_id)
.then((article) =>{
    response.status(200).send({article})
})
.catch((err) => {    
    next(err)
    })
}

exports.getAllArticles = (request, response, next) => {  
    const {sorted_by, order} = request.query    
    selectAllArticles(sorted_by, order)
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleByID = (request, response, next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateArticlesVotes(article_id, inc_votes)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {        
        next(err)
    })
}

