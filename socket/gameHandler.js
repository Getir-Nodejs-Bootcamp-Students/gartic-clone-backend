const { setObject, getObject, deleteObject } = require("../redis/index");
const EventEmitter = require("events");
const { wordPickTime } = require("../config/index");
const { get } = require("http");
const time = new EventEmitter();

const startGame = async function (socket, io, data) {
  const room = await getObject(data.roomId);
  room.gameState = true;
  setObject(data.roomId, room);
  io.in(data.roomId.toString()).emit("game:started", {
    currentTurn: socket.id,
    gameState: true,
  });
  startTurn(socket, io, data.roomId, socket.id);
};

const startTurn = async function (socket, io, roomId, currentTurn) {
  let room = await getObject(roomId.toString());
  room.guessCnt = 0;
  console.log(currentTurn);
  room = { ...room, currentTurn: currentTurn };
  setObject(roomId, room);
  io.to(room.currentTurn).emit("game:wordPick", ["Agac", "At", "Dana"]);
  io.in(roomId).emit("room:get", await getObject(roomId));
  socket.removeAllListeners("game:wordPicked");
  timeTicker(socket, io, roomId);
};

const timeTicker = async (socket, io, roomId) => {
  let wordTime = 10;
  let wordTimerInterval = setInterval(async () => {
    io.in(roomId).emit("time:remaining", wordTime);
    wordTime--;
    if (wordTime === 0) {
      //logic if user dont pick a word in 10s
      clearInterval(wordTimerInterval);
    }
  }, 1000);
  console.log("ben burdaayım");
  socket.on("game:wordPicked", async (word) => {
    console.log("word", word);
    const room = await getObject(roomId);
    room.wordPicked = word;
    console.log("data when word picked: ",room.wordPicked);
  
    setObject(roomId, room);
    let drawTime = 10;
    clearInterval(wordTimerInterval);
    let drawTimerInterval = setInterval(async () => {
      io.in(roomId).emit("time:remaining", drawTime);
      drawTime -= 1;
      if (drawTime === 0) {
        //clear whiteboard
        const room = await getObject(roomId);
        const currentTurnIndex = (obj) =>
          Object.keys(obj)[0] === room.currentTurn;
        console.log(room.users.findIndex(currentTurnIndex));
        const nextPlayerIndex =
          (room.users.findIndex(currentTurnIndex) + 1) % room.users.length;
        const currentTurnId = Object.keys(room.users[nextPlayerIndex])[0];
        startTurn(
          io.sockets.sockets.get(currentTurnId),
          io,
          roomId,
          currentTurnId
        );
        clearInterval(drawTimerInterval);
      }
    }, 1000);
  });
  console.log(socket.listeners("game:wordPicked"));
};

module.exports = {
  startGame,
  startTurn,
  timeTicker,
};
