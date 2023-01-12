"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
const app = (0, express_1.default)();
const server = new http_1.Server(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*'
    }
});
app.use((0, cors_1.default)());
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const user = socket.id;
    const roomName = socket.handshake.query.roomName;
    yield socket.join(roomName);
    socket.on('mousePos', (data) => {
        socket.to(roomName).emit('mousePos', data);
    });
    socket.on('cleanPoints', () => {
        socket.to(roomName).emit('cleanPoints');
    });
    socket.on('cleanCanvas', () => {
        socket.to(roomName).emit('cleanCanvas');
    });
    socket.on('chatMessage', (data) => {
        socket.broadcast.to(roomName).emit('chatMessage', data);
    });
    socket.on('disconnect', () => {
        // console.log(io.sockets.adapter.rooms.get('riki'))
        console.log('socket disconnect');
    });
}));
app.get("/", (req, res) => {
    res.send("pagina principal del server");
});
server.listen(PORT, () => {
    console.log(PORT);
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
