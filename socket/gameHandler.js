const { setObject, getObject, deleteObject } = require("../redis/index");
const EventEmitter = require("events");
const { wordPickTime } = require("../config/index");
const time = new EventEmitter();

const startGame = async function (socket,io,data) {
  console.log("socket.adapter.rooms",socket.adapter.rooms)
  console.log(data.roomId)
  const room = await getObject(data.roomId);
  room.gameState = true;
  console.log("Started game on room : ", room);
  setObject(data.roomId, room);
  io.in(data.roomId.toString()).emit("game:started", { currentTurn: socket.id, gameState: true });
};

const startTurn = async function (data) {
  const socket = this;
  let room = await getObject(data.roomId);
  room = { ...room, currentTurn: data.socketId };
  setObject(data.roomId, room);
  socket.to(data.roomId).emit("game:startTurn", room, ["Agac", "At", "Dana"]);
  
};

const timeTicker = (room, time) => {
  while (time > 0) {
    setTimeout(() => {
      time--;
    }, 1000);
    socket.to(room).emit("time:remaining", time);
  }
};

module.exports = {
  startGame,
  startTurn,
  timeTicker,
};
