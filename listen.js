const app = require('./app')

const { PORT = 8080} = process.env


app.listen( PORT, () => {`Listening on ${PORT}...`});