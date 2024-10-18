const { response, request } = require("../app")
const { selectArticleById, selectAllArticles, updateArticlesVotes, addArticle, removeArticleById, checkArticleExist } = require("../models/articles.models")
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
    const validQueries = ['sorted_by', 'order', 'topic', 'limit', 'p' ]
    const queryKeys = Object.keys(request.query)    
    if(queryKeys.length> 0){
        queryKeys.forEach((query) => {
        if(!validQueries.includes(query)){
            next({status: 400, msg: "Bad Request"})
        }
    })}
    const {sorted_by, order, topic, limit, p} = request.query
    const dbRequests = [selectAllArticles(sorted_by, order, topic, limit, p), selectTopicBySlug(topic)]    
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

exports.postArticle = (request, response, next) => {
const {author, title, body, topic, article_img_url} = request.body
addArticle(author, title, body, topic, article_img_url)
.then((article) => {    
    response.status(201).send({article})
})
.catch((err) => {
    next(err)
})
}

exports.deleteArticleByID = (request, response, next) => {
    const {article_id} = request.params
    Promise.all([removeArticleById(article_id), checkArticleExist(article_id)])
    .then(() => {
        response.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

