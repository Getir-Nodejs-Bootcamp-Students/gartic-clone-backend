const { setObject, getObject, deleteObject } = require("../redis/index");
const {drawTime} = require('../config/index');

const canvasDraw = async function (data) {
  const room = await getObject(data.roomId);
  if (socket.id == room.currentTurn)
    socket.to(data.roomId).emit("canvas:drawing", data.drawing);
};

module.exports = {
  canvasDraw,
};
