const { joinRoom, sendMessage, drawCanvas } = require("./socketHandler");
var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var connectedUsers = {};
socketApi.io = io;

io.on("connection", function (socket) {
  console.log("Socket connected");
  socket.on("disconnect", () => {
    for (const room in connectedUsers) {
      const index = connectedUsers[room].indexOf(socket.id);
      if (index > -1) {
        connectedUsers[room].splice(index, 1);
        if (connectedUsers[room].length === 0) {
          delete connectedUsers[room];
        }
      }
    }

    console.log("on disconnect", connectedUsers);
  });

  socket.on("room:join", (data) => {
    socket.join(data.roomId);

    if (connectedUsers[data.roomId]) {
      connectedUsers[data.roomId] = [...connectedUsers[data.roomId], { userName: data.userName, socketId: socket.id,points : 0 }];
    }
    //init room
    else {
      connectedUsers = {
        ...connectedUsers,
        [data.roomId]: [{ userName: data.userName, socketId: socket.id,points : 0 }],
      };
    }
    console.log("connectedUsers", connectedUsers);
    console.log("rooms", io.sockets.adapter.rooms);
  });

  // socket.on("room:leave", (roomId) => {
  //   const index = connectedUsers[roomId].indexOf(socket.id);
  //   if (index > -1) {
  //     connectedUsers[roomId].splice(index, 1);
  //   }
  //   socket.leave(socket.id);
  //   console.log("Leave çalıştı -> ", connectedUsers);
  // });
  //socket.on("room:join", joinRoom);
  //socket.on("message:send", sendMessage);
  socket.on("canvas:draw", (data) => {
    socket.broadcast.to(data.roomId).emit("canvas:drawing", data);
  });
});

socketApi.sendNotification = function () {
  io.sockets.emit("hello", { msg: "Hello World!" });
};

module.exports = socketApi;
