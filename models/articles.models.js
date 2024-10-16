const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT author, title, article_id, topic, body, votes, article_img_url, created_at::varchar FROM articles
        WHERE article_id = $1`, [article_id])
        .then(({rows}) => {            
            if(rows.length < 1){                
                return Promise.reject(
                    {status: 404 , msg: 'Not Found'}
                )
            }                       
            return rows[0]
        })
}

exports.selectAllArticles = (sorted_by = 'created_at', order='desc', topic) => {
    const allowedSortCategories = ['author', 'title', 'article_id', 'topic', 'votes', 'article_img_url', 'comment_count', 'created_at' ]
    const allowedOrders = ['asc', 'desc']
    if (!allowedSortCategories.includes(sorted_by) || !allowedOrders.includes(order)){
        return Promise.reject({status:400, msg:'Invalid Input' })
    }
    const queryValues = []
    let queryStr = `
        SELECT articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url, COUNT(comments.comment_id) 
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id `  
        if(topic){
            queryValues.push(topic)
            queryStr += `WHERE topic = $1 `
        }
        
    queryStr += `
        GROUP BY articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url
        ORDER BY ${sorted_by} ${order}`    
    return db.query(queryStr, queryValues )
        .then(({rows}) => {                             
            return rows
        })
}

exports.updateArticlesVotes = (article_id, inc_votes) => {
    return db.query(` 
        UPDATE articles
        SET
            votes = votes + $1
        WHERE article_id = $2
        RETURNING *`, [inc_votes, article_id])
        .then(({rows}) => {            
            if(rows.length < 1){
                return Promise.reject({status: 404, msg: "Not Found" })
            }
            return rows[0]
        })
}

