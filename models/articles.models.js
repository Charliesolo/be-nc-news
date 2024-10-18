const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT articles.author, title, articles.article_id, topic, articles.body, articles.votes, article_img_url, articles.created_at::varchar, COUNT(comments.comment_id)::INT 
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url
        `, [article_id])
        .then(({rows}) => {            
            if(rows.length < 1){                
                return Promise.reject(
                    {status: 404 , msg: 'Article Not Found'}
                )
            }                       
            return rows[0]
        })
}

exports.selectAllArticles = (sorted_by = 'created_at', order='desc', topic, limit = 10, p) => {
    const allowedSortCategories = ['author', 'title', 'article_id', 'topic', 'votes', 'article_img_url', 'comment_count', 'created_at' ]
    const allowedOrders = ['asc', 'desc']
    if (!allowedSortCategories.includes(sorted_by) || !allowedOrders.includes(order)){
        return Promise.reject({status:400, msg:'Invalid Input' })
    }
    const queryValues = [limit]
    let queryStr = `
        SELECT articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url, COUNT(comments.comment_id)::INT 
            AS comment_count,
        COUNT(*) OVER()::integer AS total_count          
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id `  
        if(topic){
            queryValues.push(topic)
            queryStr += `WHERE topic = $2 `
        }
        
    queryStr += `
        GROUP BY articles.author, title, articles.article_id, topic, articles.created_at::varchar, articles.votes, article_img_url
        ORDER BY ${sorted_by} ${order}
        LIMIT $1        
        `
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
    return db.query(queryStr, queryValues )
        .then(({rows}) => {
            if(p>1 && rows.length === 0){
                return Promise.reject({msg:"Not Found", status:404})
            }
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
                return Promise.reject({status: 404, msg: "Article Not Found" })
            }
            return rows[0]
        })
}

exports.addArticle = (author, title, body, topic, article_img_url) => {
    const inputValues = [author, title, body, topic]
    let queryStr = ``
    if (article_img_url){
        inputValues.push(article_img_url)
        queryStr += `WITH posted_article AS 
        (
        INSERT INTO articles
            (author, title, body, topic, article_img_url)
        VALUES
            ($1, $2, $3, $4, $5)`
    } else {
        queryStr += `WITH posted_article AS 
        (
        INSERT INTO articles
            (author, title, body, topic)
        VALUES
            ($1, $2, $3, $4)`
    }
    queryStr += `
    RETURNING article_id, author, title, body, topic, created_at, votes, article_img_url
    )
    SELECT 
        posted_article.author, 
        posted_article.title, 
        posted_article.article_id, 
        posted_article.body, 
        posted_article.topic, 
        posted_article.created_at::varchar, 
        posted_article.votes, 
        posted_article.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM posted_article
    LEFT JOIN comments
    ON posted_article.article_id = comments.article_id
    GROUP BY 
        posted_article.author, 
        posted_article.title, 
        posted_article.article_id, 
        posted_article.body, 
        posted_article.topic, 
        posted_article.created_at::varchar, 
        posted_article.votes, 
        posted_article.article_img_url ;`    
    return db.query(queryStr,inputValues)
        .then(({rows}) => {       
            return rows[0]
        })
}

exports.removeArticleById = (article_id) => {
    return db.query(`
        DELETE FROM articles
        WHERE article_id = $1
        `, [article_id])        
    }
        

    exports.checkArticleExist = article_id => {
        return db.query(`
            SELECT * FROM articles
            WHERE article_id = $1`, [article_id])
            .then(({rows}) => {
                if(rows.length < 1){
                    return Promise.reject({status: 404, msg: 'Article Not Found'})
                }
            })
    }

