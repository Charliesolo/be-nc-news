const db = require('../db/connection')

exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}) => {
        return rows
    })
}

exports.selectTopicBySlug = (topic) => {
    if(!topic){return}
    return db.query(`
        Select * FROM topics
        WHERE slug = $1
        `, [topic])
        .then(({rows}) =>{    
            if(rows.length < 1){  
                return Promise.reject({status: 404, msg: "Topic Not Found" })}
            return rows
        })
}

exports.addTopic = (slug, description) => {
    if(!slug || !description){
        return Promise.reject({status: 400, msg: 'Bad Request - Slug and Description required' })
    }
    return db.query(`
        INSERT INTO topics
            (slug, description)
            VALUES
                ($1,$2)
            RETURNING *
        `, [slug, description])
        .then(({rows}) => {
            return rows[0]
        })
}