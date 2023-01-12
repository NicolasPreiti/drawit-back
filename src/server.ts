import cors from 'cors'
import express from 'express'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

const PORT = 3000
const app = express()
const server = new HttpServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())

io.on('connection', async (socket) => {
  const user = socket.id

  const roomName = socket.handshake.query.roomName as string
  await socket.join(roomName)

  socket.on('mousePos', (data) => {
    socket.to(roomName).emit('mousePos', data)
  })

  socket.on('cleanPoints', () => {
    socket.to(roomName).emit('cleanPoints')
  })

  socket.on('cleanCanvas', () => {
    socket.to(roomName).emit('cleanCanvas')
  })

  socket.on('chatMessage', (data) => {
    socket.broadcast.to(roomName).emit('chatMessage', data)
  })

  socket.on('disconnect', () => {
    // console.log(io.sockets.adapter.rooms.get('riki'))
    console.log('socket disconnect')
  })
})

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
