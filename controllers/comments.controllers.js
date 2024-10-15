const { selectArticleById } = require("../models/articles.models")
const { selectCommentsByArticleId, addComment } = require("../models/comments.models")

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    return Promise.all([selectArticleById(article_id), selectCommentsByArticleId(article_id)])
    .then((resolvedPromises) => {        
        response.status(200).send({comments: resolvedPromises[1]})
    })
    .catch((err) => {
        next(err)
    })    
}

exports.postComment = (request, response, next) => {
    const {article_id} = request.params
    const {username , body} = request.body
    return Promise.all([selectArticleById(article_id), addComment(article_id, username, body)])   
    .then((resolvedPromises) => {
        const comment = resolvedPromises[1]
        response.status(201).send({comment})
    })
    .catch((err) => {            
        next(err)
    })
}