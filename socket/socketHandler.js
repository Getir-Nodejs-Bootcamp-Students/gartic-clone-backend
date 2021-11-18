module.exports = (io) => {
    const sendMessage = function (message,room) {
        const socket = this;
        if(room === ''){
            socket.broadcast.emit('receive-message',message);
        }else{
            socket.to(room).emit('receive-message',message);
        }
    };
  
    const joinRoom = function (room, callback) {
        const socket = this;
        socket.join(room);
        callback(`Joined room ${room}`);
    };
  
    return {
      sendMessage,
      joinRoom
    }
  }