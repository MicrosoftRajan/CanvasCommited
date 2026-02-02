"use client";

import { MSG } from "@/lib/real_time/protocol";
import { socket } from "@/lib/real_time/socket";
import toolStore from "@/lib/state/ToolStore";

export default function Toolbar() {
  return (
    <div style={styles.bar}>
      {/* Tools */}
      <button onClick={() => toolStore.setTool("brush")}>
        Brush
      </button>

      <button onClick={() => toolStore.setTool("eraser")}>
        Eraser
      </button>

      {/* Color Picker */}
      <input
        type="color"
        defaultValue={toolStore.color}
        onChange={(e) => toolStore.setColor(e.target.value)}
      />

      {/* Stroke Width */}
      <input
        type="range"
        min="1"
        max="30"
        defaultValue={toolStore.width}
        onChange={(e) => toolStore.setWidth(Number(e.target.value))}
      />

      {/* Undo / Redo */}
      <button onClick={() => socket.emit(MSG.UNDO)}>
        Undo
      </button>

      <button onClick={() => socket.emit(MSG.REDO)}>
        Redo
      </button>
    </div>
  );
}

const styles = {
  bar: {
    position: "fixed",
    top: 10,
    left: 10,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 10px",
    background: "#000",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
};
