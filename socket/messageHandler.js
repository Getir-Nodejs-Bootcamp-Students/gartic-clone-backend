const { setObject, getObject, deleteObject } = require("../redis/index");
const { wordPickTime } = require("../config/index");
const { get } = require("http");

const chatMessageListener = (socket, io, data) => {
    const messageObject = {
        user : data.userName,
        message : data.message
    }
    io.in(data.roomId).emit("chat:message",messageObject);
    console.log("chat data: ",data);
};

const guessMessageListener = async(socket, io, data) => {
    console.log(data)
    const room = await getObject(data.roomId);
    console.log("Room :",room);
    const guessWord = room.wordPicked;
    if(data.message!==guessWord) return;
    // yazılan doğru çıktığında nasıl bir veri dönülecek. chat verisi nasıl değişecek onu implemente etmek lazım
    room.users[socket.id].points = 30 - (room.whoGuessed * 2);
    setObject(data.roomId,room);

};

module.exports = {
    guessMessageListener,
    chatMessageListener
}


