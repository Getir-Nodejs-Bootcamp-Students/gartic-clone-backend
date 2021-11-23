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

const { UnavailableForLegalReasons } = require("http-errors");
const { setObject, getObject, deleteObject } = require("../redis/index");

const joinRoom = async function (data) {
    const socket = this;
    socket.join(data.roomId);
    const roomExists = await getObject(data.roomId);
    if (roomExists) {
        roomExists.users.push({
            [socket.id]: {
                isOwner: false,
                userName: data.userName,
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
            users: [
                {
                    [socket.id]: {
                        isOwner: true,
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
        if(value == socket.id) return;
        const roomObj = await getObject(value);
        roomObj.users = roomObj.users.filter(item => {
            if(!Object.keys(item).includes(socket.id.toString())) return item;
        })
        await setObject(value,roomObj);
    });
};

module.exports = {
    joinRoom,
    leaveRoom,
};
