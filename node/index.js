const express = require('express')

const PORT = process.env.port || 8080

const app = express()

app.get('/', (req , res) => {
    res.send('Hello world!')
})

app.listen(PORT,console.log('server started on post ${PORT}'))