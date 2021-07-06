import { createServer } from 'http'
import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import cors from 'cors'
// mongo connection
import './config/mongo.js'
// socket configuration
import WebSockets from './utils/WebSockets.js'
// routes
import userRouter from './routes/user.js'
import chatRoomRouter from './routes/chatRoom.js'
import deleteRouter from './routes/delete.js'

const app = express()

/** Get port from environment and store in Express. */
const port = process.env.PORT || '3001'
app.set('port', port)
app.use(cors())
app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use('/users', userRouter)
app.use('/room', chatRoomRouter)
app.use('/delete', deleteRouter)

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
})

/** Create HTTP server. */
const httpServer = createServer(app)
/** Create socket connection */
global.io = new Server(httpServer)
global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
httpServer.listen(port)
/** Event listener for HTTP server "listening" event. */
httpServer.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
})
