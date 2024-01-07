import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8080
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket)=> {
  console.log(`user connected - ${socket.id}`)

  io.on('disconnect', (socket)=> {
    console.log(`user disconnected - ${socket.id}`);
  })
})

export const startServer = (
  onCreateServer: ()=> void
)=> {
  io.listen(PORT)
  onCreateServer();
}

import AuthState from "../../types/AuthState"

export const emitQrCode = (qrCode: string) => {
  io.emit("qr_code", { qrCode });
} 

export const emitAuthState = (authState: AuthState) => {
  io.emit("auth_state", { authState });
}

