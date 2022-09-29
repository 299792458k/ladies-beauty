require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

// Socket.io
const httpServer = require('http').createServer(app)
const Server = require('socket.io')
const io = Server(httpServer, {
    cors: {
        origin: 'http://localhost: /',
    }
})


io.on('connection', function (socket) {
    socket.on('joinRoom', ({ roomIds }) => {
        roomIds.map(id => {
            console.log("socket join " + id)
            socket.join(id);
        })
    })
    socket.on('sendMessage', ({ senderId, roomId, msg, time }, callback) => {
        console.log('msg: ' + msg + '_' + time + ' to' + roomId)
        socket.to(roomId).emit('updateMessages', { msg, time, senderId, roomId });
        // callback: send response to client
        callback({
            status: 'ok',
        })
    })
    socket.on('disconnect', () => {
        console.log('disconnect: ' + socket.id)
    })
});


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))



// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB')
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})
