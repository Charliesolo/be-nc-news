const db = require('../db/connection')
const { convertTimestampToDate } = require('../db/seeds/utils')

exports.selectCommentsByArticleId = (article_id, limit=10, p) => {
    
    let queryStr = `
        SELECT comment_id, votes, created_at::varchar, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        `
    const queryValues = [article_id, limit]
    if(p){
        if(isNaN(p)){
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }        
        if(p>1){
        const offsetValue = (p-1)*limit        
        queryValues.push(offsetValue)
        queryStr += `OFFSET $${queryValues.length}`
        }
    }
    return db.query(queryStr, queryValues)
        .then(({rows}) => {
            if(p && rows.length === 0){
                return Promise.reject({status: 404, msg:'Not Found'})
            }            
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

exports.updateCommentsVotes = (comment_id, inc_votes) => {
    return db.query(`
        UPDATE comments
        SET 
            votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`, [inc_votes, comment_id])
        .then(({rows}) => {
            if(rows.length < 1){
                return Promise.reject({status: 404, msg: "Comment Not Found"})
            }
            return rows [0]
        })
    
}