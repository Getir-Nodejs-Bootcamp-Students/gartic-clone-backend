const { joinRoom, sendMessage, drawCanvas } = require("./socketHandler");
var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var connectedUsers = {
  room1: ["user1", "user2"],
};
socketApi.io = io;

io.on("connection", function (socket) {
  socket.on("room:join", (room, id) => {
    if (connectedUsers[room]) {
      connectedUsers[room] = [...id];
      socket.join(room);
    } else connectedUsers[room] = [id];
  });

  socket.on("room:leave", (room, id) => {
    const index = array.indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
    }
    socket.leave(id);
  });
  //socket.on("room:join", joinRoom);
  //socket.on("message:send", sendMessage);
  console.log("Socket connected");
  socket.on("canvas:draw", (data) => {
    socket.broadcast.emit("canvas:drawing", data);
  });
  socket.on("drawtime:get", () => {
    console.log("drwatime console");
    let time = 30;
    const drawTime = setInterval(() => {
      socket.emit("drawtime:send", time);
      time--;
      if (time === 0) clearInterval(drawTime);
    }, 1000);
  });
});

socketApi.sendNotification = function () {
  io.sockets.emit("hello", { msg: "Hello World!" });
};

module.exports = socketApi;
