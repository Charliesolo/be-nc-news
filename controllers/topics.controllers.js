const { selectAllModels } = require("../models/topics.models")


exports.getAllTopics = (request, response, next) => {    
    return selectAllModels()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) =>{
        next(err)
    })
}