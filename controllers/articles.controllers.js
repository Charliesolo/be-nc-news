const { selectArticleById, selectAllArticles, updateArticlesVotes } = require("../models/articles.models")
const { selectTopicBySlug } = require("../models/topics.models")

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
    const validQueries = ['sorted_by', 'order', 'topic']
    const queryKeys = Object.keys(request.query)    
    if(queryKeys.length> 0){
        queryKeys.forEach((query) => {
        if(!validQueries.includes(query)){
            next({status: 400, msg: "Bad Request"})
        }
    })}
    const {sorted_by, order, topic} = request.query
    const dbRequests = [selectAllArticles(sorted_by, order, topic), selectTopicBySlug(topic)]    
    Promise.all(dbRequests)
    .then(([articles, topicExists]) => {  
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

