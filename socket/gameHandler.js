const { setObject, getObject, deleteObject } = require("../redis/index");
const EventEmitter = require("events");
const {wordPickTime} = require('../config/index');
const time = new EventEmitter();

const startGame = async function (data) {
  const room = await getObject(data.roomId);
  room = { ...room, gameState: true };
  setObject(data.roomId, room);
  socket.to(data.roomId).emit("game:started", true);
};

const startTurn = async function (data) {
  const room = await getObject(data.roomId);
  room = { ...room, currentTurn: data.socketId };
  setObject(data.roomId, room);
  socket.to(data.roomId).emit("game:startTurn", room,["Agac","At","Dana"]);
  socket.on("time:start",(fdata)=> {
      timeTicker(fdata.roomId,wordPickTime);
  })
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
