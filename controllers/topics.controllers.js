const { selectAllTopics, addTopic } = require("../models/topics.models")


exports.getAllTopics = (request, response, next) => {    
    selectAllTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) =>{
        next(err)
    })
}

exports.postTopic = (request, response, next) => {
    const {slug, description} = request.body
    addTopic(slug, description)
    .then((topic) => {
        response.status(201).send({topic})
    })
    .catch((err) => {        
        next(err)
    })
}