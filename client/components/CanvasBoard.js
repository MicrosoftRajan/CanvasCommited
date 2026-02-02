"use client";

import { useEffect, useRef } from "react";
import throttle from "@/lib/utils/throttle";
import CanvasRenderer from "@/lib/canva/CanvasRenderer";
import Toolbar from "./Toolbar";
import Layers from "@/lib/canva/Layer";
import CursorLayer from "@/lib/canva/CursorLayer";
import { MSG } from "@/lib/real_time/protocol";
import StrokeBuilder from "@/lib/canva/StrokeBuilder";
import { socket } from "@/lib/real_time/socket";
import toolStore from "@/lib/state/ToolStore";

export default function CanvasBoard() {
  const canvasRef = useRef(null);

  const layersRef = useRef(null);
  const baseRenderer = useRef(null);
  const liveRenderer = useRef(null);
  const cursorLayer = useRef(null);

  const operationsRef = useRef([]); // 🔹 history cache
  const isDrawing = useRef(false);
  const strokeBuilder = useRef(null);
  const currentStroke = useRef(null);

  const user = useRef({
    id: crypto.randomUUID(),
    name: "Guest",
    color: "#000000",
  });

  /* ---------------- COMPOSITE ---------------- */

  function composite() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(layersRef.current.base, 0, 0);
    ctx.drawImage(layersRef.current.live, 0, 0);
    ctx.drawImage(cursorLayer.current.canvas, 0, 0);
  }

  /* ---------------- REPLAY (UNDO / REDO) ---------------- */

  function replayBase() {
    layersRef.current.clear(layersRef.current.base);

    operationsRef.current
      .filter((op) => !op.undone)
      .forEach((op) => baseRenderer.current.drawStroke(op));

    composite();
  }

  /* ---------------- CURSOR (THROTTLED) ---------------- */

  const sendCursor = throttle((x, y) => {
    socket.emit(MSG.CURSOR, {
      userId: user.current.id,
      x,
      y,
      color: user.current.color,
    });
  }, 30);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    layersRef.current = new Layers(canvas.width, canvas.height);

    baseRenderer.current = new CanvasRenderer(
      layersRef.current.base.getContext("2d"),
    );
    liveRenderer.current = new CanvasRenderer(
      layersRef.current.live.getContext("2d"),
    );

    cursorLayer.current = new CursorLayer(canvas.width, canvas.height);

    socket.emit(MSG.JOIN_ROOM, {
      roomId: "room-1",
      user: user.current,
    });

    /* -------- INIT STATE -------- */
    socket.on(MSG.INIT_STATE, ({ operations }) => {
      operationsRef.current = operations;
      replayBase();
    });

    /* -------- UNDO / REDO -------- */
    socket.on(MSG.HISTORY_UPDATE, (updatedOp) => {
        console.log("FRONTEND GOT:", updatedOp);
      operationsRef.current = operationsRef.current.map((op) =>
        op.id === updatedOp.id ? { ...op, undone: updatedOp.undone } : op,
      );

      replayBase();
    });

    /* -------- DRAWING -------- */
    socket.on(MSG.STROKE_START, (stroke) => {
      operationsRef.current.push(stroke);
      liveRenderer.current.drawStroke(stroke);
      composite();
    });

    socket.on(MSG.STROKE_MOVE, (stroke) => {
      liveRenderer.current.drawStroke(stroke);
      composite();
    });

    socket.on(MSG.STROKE_END, (stroke) => {
      layersRef.current.clear(layersRef.current.live);
      baseRenderer.current.drawStroke(stroke);
      composite();
    });

    /* -------- CURSORS -------- */
    socket.on(MSG.CURSOR, ({ userId, x, y, color }) => {
      if (userId === user.current.id) return;

      cursorLayer.current.update(userId, x, y, color);
      cursorLayer.current.draw();
      composite();
    });

    socket.on("user:left", (user) => {
      cursorLayer.current.remove(user.id);
      cursorLayer.current.draw();
      composite();
    });

    return () => socket.off();
  }, []);

  /* ---------------- POINTER EVENTS ---------------- */

  function pointerDown(e) {
    isDrawing.current = true;
    strokeBuilder.current = new StrokeBuilder();

    currentStroke.current = {
      id: crypto.randomUUID(),
      userId: user.current.id,
      type: "stroke",
      tool: toolStore.tool,
      color: toolStore.color,
      width: toolStore.width,
      points: [],
      undone: false,
      timestamp: Date.now(),
    };

    const p = { x: e.clientX, y: e.clientY, t: Date.now() };
    strokeBuilder.current.add(p);
    currentStroke.current.points.push(p);

    socket.emit(MSG.STROKE_START, currentStroke.current);
  }

  function pointerMove(e) {
    if (!isDrawing.current) return;

    const p = { x: e.clientX, y: e.clientY, t: Date.now() };
    strokeBuilder.current.add(p);
    currentStroke.current.points = strokeBuilder.current.points;

    layersRef.current.clear(layersRef.current.live);
    liveRenderer.current.drawStroke(currentStroke.current);
    composite();

    socket.emit(MSG.STROKE_MOVE, {
      id: currentStroke.current.id,
      points: [p],
    });

    sendCursor(e.clientX, e.clientY);
  }

  function pointerUp() {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    layersRef.current.clear(layersRef.current.live);
    baseRenderer.current.drawStroke(currentStroke.current);
    composite();

    socket.emit(MSG.STROKE_END, currentStroke.current);
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Toolbar />
      <canvas
        ref={canvasRef}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        style={{ display: "block", background: "#fff" }}
      />
    </>
  );
}
