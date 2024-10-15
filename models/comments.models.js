const db = require('../db/connection')
const { convertTimestampToDate } = require('../db/seeds/utils')

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT comment_id, votes, created_at::varchar, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [article_id])
        .then(({rows}) => {            
            return rows
        })
}

exports.addComment = (article_id, username, body) => {
    
    if(!username || !body){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    return db.query(`INSERT INTO comments
            (article_id, author, body)
            VALUES
                ($1,$2,$3)
            RETURNING *
        `, [article_id, username, body])
        .then(({rows}) => {                     
            return rows[0]
        })
}