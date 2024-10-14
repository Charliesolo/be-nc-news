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

exports.selectAllArticles = () => {
    return db.query(
        `
        SELECT articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url, COUNT(comments.comment_id) 
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url
        ORDER BY created_at DESC;
        `  
    )
        .then(({rows}) => {                       
            return rows
        })


}