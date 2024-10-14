exports.serverErrorHandling = (err, request, response, next) => {
    console.log(err , "error")
    response.status(500).send({msg: "Internal Server Error"})
}