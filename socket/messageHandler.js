const { setObject, getObject, deleteObject } = require("../redis/index");
const { wordPickTime } = require("../config/index");
/**
 *
 */
const chatMessageListener = (socket, io, data) => {
    const messageObject = {
        user: data.userName,
        message: data.message,
    };
    io.in(data.roomId).emit("chat:message", messageObject);
    console.log("chat data: ", data);
};

const guessMessageListener = async (socket, io, data) => {
    console.log(data);
    const room = await getObject(data.roomId);
    const guessWord = room.wordPicked;
    if (socket.id == room.currentTurn) return;
    if (!guessWord) return;
    if (data.message.toLowerCase() !== guessWord.toLowerCase()) {
        console.log("burda");
        socket.to(data.roomId).emit("message:incorrectGuess", data);
        return;
    }
    console.log("Corrrrrreeeecccct");
    io.in(data.roomId).emit("message:correctGuess", data.userName);
    room.users.map((user) => {
        if (Object.keys(user)[0] == socket.id) {
            user[socket.id].points += 10 - room.guessCnt;
        }
        if (Object.keys(user)[0] == room.currentTurn) {
            user[room.currentTurn].points += 11 - room.guessCnt;
        }
    });
    room.guessCnt++;
    console.log("Room after correct guess : ", room);

    io.in(data.roomId).emit("room:get", room);
    setObject(data.roomId, room);
};

module.exports = {
    guessMessageListener,
    chatMessageListener,
};
