const { joinRoom, sendMessage, drawCanvas } = require("./socketHandler");
var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var connectedUsers = {
};
socketApi.io = io;

io.on("connection", function (socket) {
  console.log("Socket connected");

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
    socket.emit("postman:test",`${socket.id} odaya katıldı`)
    console.log("connectedUsers", connectedUsers);
    console.log("rooms", socket.rooms);
  });
  
  socket.on("disconnecting", (data) => {
    console.log("Disconnecting socket rooms ", socket.rooms);
    console.log("Users during disconnection :",connectedUsers);
    socket.rooms.forEach((value,key)=>{
      if(Object.keys(connectedUsers).includes(key.toString())){
        connectedUsers[key] = connectedUsers[key].filter(item => item.socketId != socket.id)
        console.log("Deneme : ",connectedUsers[key]);
      }
    })
    
    
  });
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

module.exports = socketApi;
