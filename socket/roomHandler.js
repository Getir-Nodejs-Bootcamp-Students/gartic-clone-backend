/*
Example of a room object
  {
    [
      "roomId" : {
        gameState: false,
        timeStarted: false,
        wordPicked: "salam",
        turnId : socket.id
        users: [
           {
             "socketId" : {
                isOwner : true,
                userName: "Emree",
                points: 0,
            }
          },
        ]
      }
    ]
  }
*/

const { setObject, getObject, deleteObject } = require("../redis/index");
const { generateRandomRoomId } = require("../helpers/helpers");

const joinRoom = async function (data) {
  const socket = this;
  socket.join(data.roomId);
  socket.emit("room:get", await getObject(data.roomId));
  const roomExists = await getObject(data.roomId);
  if (roomExists) {
    roomExists.users.push({
      [socket.id]: {
        userName: data.userName || "guest-" + generateRandomRoomId(5),
        points: 0,
      },
    });
    setObject(data.roomId, roomExists);
  }
  //init room
  else {
    setObject(data.roomId, {
      gameState: false,
      timeStarted: false,
      wordPicked: null,
      owner : socket.id,
      users: [
        {
          [socket.id]: {
            userName: data.userName,
            points: 0,
          },
        },
      ],
    });
  }
};

const leaveRoom = async function () {
  const socket = this;
  socket.rooms.forEach(async (value) => {
    if (value == socket.id) return;
    const roomObj = await getObject(value);
    roomObj.users = roomObj.users.filter((item) => {
      if (!Object.keys(item).includes(socket.id.toString())) return item;
    });
    console.log("roomobj", roomObj);
    setObject(value, roomObj);
    const users = await getObject(value);
    console.log("Leave room ,", users);
  });
};

module.exports = {
  joinRoom,
  leaveRoom,
};
