const express = require('express')
const app = express()
require('dotenv').config()

const server = require('http').createServer(app)

const cors = require('cors')
const morgan = require('morgan')
const { Socket } = require('socket.io')


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
app.use(cors())
app.use(morgan('dev'))
const port = process.env.PORT || 4040

app.get('/', (req, res) => {
    res.send('Server working')
})

io.on('connection', (socket) => {
    socket.emit('me', socket.id)


    socket.on('disconnect', () => {
        socket.broadcast.emit('callended')
    })

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", {signal: signalData, name, from})
    })
    socket.on("answercall",(data) => {
        io.to(data.to).emit("callaccepted", data.signal)
    }) 
})



server.listen(port, () => {
    console.log(`app listening on port: ${port}...`)
})