const { joinRoom, leaveRoom } = require("./roomHandler");
var events = require("events");
var socket_io = require("socket.io");
const { EventEmitter } = require("stream");
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on("connection", function (socket) {
    console.log("Socket connected");

    // socket.on("room:join", (data) => {
    //     socket.join(data.roomId);
    //     const roomExists = connectedUsers[data.roomId];
    //     if (roomExists) {
    //         connectedUsers[data.roomId] = [...connectedUsers[data.roomId], { userName: data.userName, socketId: socket.id, points: 0 }];
    //     }
    //     //init room
    //     else {
    //         connectedUsers = {
    //             ...connectedUsers,
    //             [data.roomId]: [{ userName: data.userName, socketId: socket.id, points: 0 }],
    //         };
    //     }
    //     socket.emit("postman:test", `${socket.id} odaya katıldı`);
    //     console.log("connectedUsers", connectedUsers);
    //     console.log("rooms", socket.rooms);
    // });
    socket.on("room:join", joinRoom);
    socket.on("disconnecting", leaveRoom);
    
    socket.on("disconnect", (data) => {
        console.log("Disconnected socket rooms ", socket.rooms);
    });
    socket.on("canvas:draw", (data) => {
        socket.broadcast.to(data.roomId).emit("canvas:drawing", data);
    });
});

socketApi.sendNotification = function () {
    io.sockets.emit("hello", { msg: "Hello World!" });
};

var eventEmmiter = new events.EventEmitter();
eventEmmiter.on("turn:change", () => {});
eventEmmiter.on("score:add", () => {});
eventEmmiter.on("time:start", () => {});

module.exports = socketApi;
