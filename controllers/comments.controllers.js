const { selectArticleById } = require("../models/articles.models")
const { selectCommentsByArticleId } = require("../models/comments.models")

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