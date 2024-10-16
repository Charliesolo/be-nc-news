const { selectAllTopics } = require("../models/topics.models")


exports.getAllTopics = (request, response, next) => {    
    return selectAllTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) =>{
        next(err)
    })
}