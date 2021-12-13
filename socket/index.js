const { joinRoom, leaveRoom } = require("./roomHandler");
const { startGame, startTurn } = require("./gameHandler");
const { guessMessageListener, chatMessageListener } = require("./messageHandler");
const { canvasDraw } = require("./canvasHandler");
const { flushRedis } = require("../redis/index");
const socket_io = require("socket.io");
const io = socket_io();
const socketApi = {};

//flush redis before initialization
flushRedis();
console.log("Redis flushed");

socketApi.io = io;

io.on("connection", function (socket) {
    socket.on("room:join", (data) => joinRoom(socket, io, data));
    socket.on("game:start", (data) => startGame(socket, io, data));
    socket.on("message:guess", (data) => guessMessageListener(socket, io, data));
    socket.on("message:chat", (data) => chatMessageListener(socket, io, data));
    socket.on("canvas:draw", canvasDraw);
    // socket.on("canvas:draw", (data) => {
    //     socket.broadcast.to(data.roomId).emit("canvas:drawing", data);
    // });
    socket.on("disconnecting", leaveRoom);
    socket.on("disconnect", (data) => {
        console.log("Disconnected socket rooms ", socket.rooms);
    });
});

module.exports = socketApi;
