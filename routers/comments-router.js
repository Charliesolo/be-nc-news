const { deleteCommentById, patchCommentByID } = require('../controllers/comments.controllers')

const commentsRouter = require('express').Router()

commentsRouter
.route('/:comment_id')
.delete(deleteCommentById)
.patch(patchCommentByID)

module.exports = commentsRouter