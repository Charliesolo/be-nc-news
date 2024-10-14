const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT author, title, article_id, topic, body, votes, article_img_url, created_at::varchar FROM ARTICLES
        WHERE article_id = $1`, [article_id])
        .then(({rows}) => {
            if(rows.length < 1){                
                return Promise.reject(
                    {status: 404 , msg: 'Not Found'}
                )
            }
            console.log(rows[0])
            return rows[0]
        })

}