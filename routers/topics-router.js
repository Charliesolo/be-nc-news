const topicsRouter = require('express').Router()
const { getAllTopics, postTopic } = require('../controllers/topics.controllers')


topicsRouter.route('/')
    .get(getAllTopics)
    .post(postTopic)

module.exports = topicsRouter