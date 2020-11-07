const app = require('./express-app')

const port = process.env.PORT

app.listen(port, ( ) => console.log('App running on port ' + port + '!'))