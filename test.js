const { io } = require("socket.io-client");
const MSG = require("./server/protocol");

const socket = io("http://localhost:3001");

const USER = {
  id: "test-user-1",
  name: "Tester",
  color: "#00ff00"
};

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit(MSG.JOIN_ROOM, {
    roomId: "room-1",
    user: USER
  });

  setTimeout(() => {
    socket.emit(MSG.STROKE_START, {
      id: "stroke-1",
      userId: USER.id,
      type: "stroke",
      tool: "brush",
      color: "#00ff00",
      width: 4,
      points: [{ x: 10, y: 10, t: Date.now() }],
      undone: false,
      timestamp: Date.now()
    });

    socket.emit(MSG.STROKE_MOVE, {
      strokeId: "stroke-1",
      points: [{ x: 20, y: 20, t: Date.now() }]
    });

    socket.emit(MSG.STROKE_END, { strokeId: "stroke-1" });

    setTimeout(() => {
      socket.emit(MSG.UNDO);
    }, 1000);
  }, 1000);
});

socket.onAny((event, data) => {
  console.log("EVENT:", event, data);
});
