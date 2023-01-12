import cors from 'cors'
import dotenv from "dotenv"
import express from 'express'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

dotenv.config()
const PORT = process.env.PORT ?? 3001
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

  const usersOnline = (await io.in(roomName).fetchSockets()).length
  socket.broadcast.to(roomName).emit("onlineUsers", usersOnline)

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

  socket.on('disconnect', async () => {
      const usersOnline = (await io.in(roomName).fetchSockets()).length
      socket.broadcast.to(roomName).emit("onlineUsers", usersOnline)
  })
})

app.get("/", (req, res) => {
  res.send("pagina principal del server")
})

server.listen(PORT, () => {
  console.log(PORT)
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
