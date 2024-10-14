const db = require('../db/connection')
exports.selectAllModels = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}) => {
        return rows
    })
}