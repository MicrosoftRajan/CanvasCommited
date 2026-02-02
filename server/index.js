// server/index.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Rooms = require("./room");
const MSG = require("./protocol");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const rooms = new Rooms(io);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on(MSG.JOIN_ROOM, ({ roomId, user }) => {
    const room = rooms.joinRoom(socket, roomId, user);

    // ----- Drawing -----
    socket.on(MSG.STROKE_START, (data) => {
      const exists = room.state.operations.some((op) => op.id === data.id);

      if (!exists) {
        room.state.addOperation(data);
      }

      socket.to(roomId).emit(MSG.STROKE_START, data);
    });
    socket.on(MSG.STROKE_MOVE, (data) => {
      socket.to(roomId).emit(MSG.STROKE_MOVE, data);
    });

    socket.on(MSG.STROKE_END, (data) => {
      socket.to(roomId).emit(MSG.STROKE_END, data);
    });

    // ----- Cursor (ephemeral) -----
    socket.on(MSG.CURSOR, (data) => {
      socket.to(roomId).emit(MSG.CURSOR, data);
    });

    // ----- Undo / Redo (global) -----
    socket.on(MSG.UNDO, () => {
      const op = room.state.undo();
      if (op) {
        io.to(roomId).emit(MSG.HISTORY_UPDATE, op);
      }
    });

    socket.on(MSG.REDO, () => {
      const op = room.state.redo();
      console.log("REDO CLICKED:", op, room.state.operations);
      if (op) {
        io.to(roomId).emit(MSG.HISTORY_UPDATE, op);
      }
    });
  });
});

server.listen(3001, () => {
  console.log("Backend listening on :3001");
});
