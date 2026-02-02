// server/protocol.js

module.exports = {
  STROKE_START: "stroke:start",
  STROKE_MOVE: "stroke:move",
  STROKE_END: "stroke:end",

  CURSOR: "cursor",

  UNDO: "undo",
  REDO: "redo",
  HISTORY_UPDATE: "history:update",

  JOIN_ROOM: "room:join",
  LEAVE_ROOM: "room:leave",
  INIT_STATE: "state:init",

  USER_JOINED: "user:joined",
  USER_LEFT: "user:left"
};
