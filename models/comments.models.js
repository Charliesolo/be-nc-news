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
        return Promise.reject({status: 400, msg: 'Bad Request - Username and body required'})
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

exports.removeCommentById = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        `, [comment_id])
}

exports.selectCommentById = (comment_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1`, [comment_id])
        .then(({rows}) => {
            if(rows.length < 1){                
                return Promise.reject(
                    {status: 404 , msg: 'Comment Not Found'}
                )
            }                       
            return rows[0]
        })        
}