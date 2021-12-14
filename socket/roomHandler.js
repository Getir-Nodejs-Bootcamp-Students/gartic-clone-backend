const { setObject, getObject, deleteObject } = require("../redis/index");
const { generateRandomRoomId } = require("../helpers/helpers");
const redis = require("redis");
const util = require("util");
const client = redis.createClient();
client.get = util.promisify(client.get);

const joinRoom = async function (socket, io, data) {
    const roomExists = await getObject(data.roomId);

    if (roomExists) {
        roomExists.users.push({
            [socket.id]: {
                userName: data.userName || "guest-" + generateRandomRoomId(4),
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
            guessCnt: 0,
            currentTurn: socket.id,
            owner: socket.id,
            users: [
                {
                    [socket.id]: {
                        userName: data.userName || "guest-" + generateRandomRoomId(4),
                        points: 0,
                    },
                },
            ],
        });
    }
    socket.join(data.roomId.toString());
    io.in(data.roomId).emit("room:get", await getObject(data.roomId));
};

const leaveRoom = async function (socket, io) {
    client.keys("*", async (err, keys) => {
        for (const key of keys) {
            const room = await getObject(key);
            room.users.forEach((e, i) => {
                if (Object.keys(e)[0] === socket.id) {
                    room.users.splice(i, 1);
                    setObject(key, room);
                    io.in(key).emit("room:get", room);
                }
            });
        }
    });
};

module.exports = {
    joinRoom,
    leaveRoom,
};
