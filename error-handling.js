exports.serverErrorHandling = (err, request, response, next) => {    
    response.status(500).send({msg: "Internal Server Error"})
}

exports.psqlErrorHandling = (err, request, response, next) => {    
    if (err.code === '22P02' || err.code === '23503'){
        response.status(400).send({msg: 'Bad Request'})
    } else next(err)
}

exports.customErrorHandling = (err, request, response, next) => {
    if(err.status && err.msg){        
        response.status(err.status).send({msg: err.msg})
    } else next(err)
}