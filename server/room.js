// server/rooms.js

const DrawingState = require("./drawing_state");
const Users = require("./user");
const MSG = require("./protocol");

class Room {
  constructor(id) {
    this.id = id;
    this.users = new Users();
    this.state = new DrawingState();
  }
}

class Rooms {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  getRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Room(roomId));
    }
    return this.rooms.get(roomId);
  }

  joinRoom(socket, roomId, user) {
    const room = this.getRoom(roomId);

    socket.join(roomId);
    room.users.add(socket.id, user);

    socket.emit(MSG.INIT_STATE, {
      operations: room.state.operations,
      users: room.users.list()
    });

    socket.to(roomId).emit(MSG.USER_JOINED, user);

    socket.on("disconnect", () => {
      const removed = room.users.remove(socket.id);
      if (removed) {
        socket.to(roomId).emit(MSG.USER_LEFT, removed);
      }
    });

    return room;
  }
}

module.exports = Rooms;
