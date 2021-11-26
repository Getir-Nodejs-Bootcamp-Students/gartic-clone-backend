const { setObject, getObject, deleteObject } = require("../redis/index");
const EventEmitter = require("events");
const { wordPickTime } = require("../config/index");
const time = new EventEmitter();

const startGame = async function (socket, io, data) {
  const room = await getObject(data.roomId);
  room.gameState = true;
  setObject(data.roomId, room);
  io.in(data.roomId.toString()).emit("game:started", {
    currentTurn: socket.id,
    gameState: true,
  });
};

const startTurn = async function (io,socket,data) {
  console.log("starturn data",data);
  let room = await getObject(data.roomId.toString());
  room = { ...room, currentTurn: data.socketId };
  setObject(data.roomId, room);
  socket.to(room.currentTurn).emit("game:startTurn", room, ["Agac", "At", "Dana"]);
  timeTicker(io, data.roomId, 15);
};

const timeTicker = (io, room, time) => {
  while (time > 0) {
    setTimeout(() => {
      console.log(time);
      io.in(room.toString()).emit("time:remaining", time);
      time--;
    }, 1000);
    
  }
};

module.exports = {
  startGame,
  startTurn,
  timeTicker,
};
