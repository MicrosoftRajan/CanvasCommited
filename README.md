# 🎨 Real-Time Collaborative Drawing Canvas

A real-time, multi-user drawing application where multiple users can draw simultaneously on a shared canvas with live synchronization, cursor indicators, and **global undo/redo**.

The project is built from scratch using the HTML5 Canvas API and WebSockets—**no drawing libraries** are used.

---

## 🚀 Features

### 🖌️ Drawing Tools
- Brush tool
- Eraser tool
- Color picker
- Adjustable stroke width

### 🔄 Real-Time Collaboration
- Live stroke synchronization using WebSockets (Socket.IO)
- See other users’ drawings **while they draw**
- Real-time cursor indicators for connected users

### 🧠 Canvas Architecture
- **Layered canvas system**
  - Base layer (committed strokes)
  - Live layer (in-progress strokes)
  - Cursor layer (ephemeral UI)
- Deterministic replay of drawing history on refresh or join

### ↩️ Global Undo / Redo
- Undo/Redo operates on a **shared global history**
- Affects all connected users
- Redo is only available after Undo
- Redo history is cleared when a new drawing occurs

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- HTML5 Canvas
- Socket.IO Client
- Custom canvas engine (no third-party drawing libs)

### Backend
- Node.js
- Express
- Socket.IO (WebSockets)
- In-memory room & history management

---

## 📁 Project Structure

```
Canvas Commit/
├── client/
│   ├── app/
│   ├── components/
│   │   ├── CanvasBoard.js
│   │   └── Toolbar.js
│   ├── lib/
│   │   ├── canva/
│   │   │   ├── CanvasRenderer.js
│   │   │   ├── Layer.js
│   │   │   ├── CursorLayer.js
│   │   │   └── StrokeBuilder.js
│   │   ├── real_time/
│   │   │   ├── socket.js
│   │   │   └── protocol.js
│   │   └── state/
│   │       └── ToolStore.js
│   ├── next.config.js
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── room.js
│   ├── drawing-state.js
│   ├── protocol.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm

---

### 1️⃣ Start the Backend

```bash
cd server
npm install
npm start
```

Expected output:
```
Backend listening on :3001
```

---

### 2️⃣ Start the Frontend

```bash
cd client
npm install
npm run dev
```

Open in browser:
```
http://localhost:3000
```

---

## 🧪 How to Test

### Single-User (Undo / Redo)
1. Draw two strokes
2. Click **Undo** → last stroke disappears
3. Click **Undo** again → canvas clears
4. Click **Redo** → first stroke reappears
5. Click **Redo** again → second stroke reappears
6. Click Redo again → nothing happens (correct)

### Multi-User
1. Open the app in two browser windows
2. Draw in one window
3. See real-time updates in the other
4. Click Undo in one window
5. Both canvases update together

> ⚠️ Undo/Redo is **global**, not per-user.

---

## 🧠 Undo / Redo Design

- The application maintains a **single shared history per room**
- Undo marks the most recent active operation as `undone`
- Redo restores the most recent undone operation
- Any new drawing clears the redo stack (linear history)
- This matches behavior in tools like Figma and Photoshop

---

## ⚠️ Known Limitations

- History is stored in memory (resets on server restart)
- Redo is global, not per-user
- No authentication (users are anonymous)
- Dev mode may create multiple socket connections due to hot reload

---

## ⏱️ Time Spent

Approximately **3–5 days**, including:
- Canvas engine implementation
- WebSocket protocol design
- Global undo/redo debugging
- Real-time sync testing
- Dev environment cleanup

---

## 🌍 Browser Support

- Chrome ✅
- Firefox ✅
- Safari ✅ (latest versions)

---

## 🎯 Future Improvements

- Persistent storage (database)
- Per-user undo stacks
- Shape tools (rectangle, circle)
- Mobile / touch support
- Permissions (host-only undo)
- Performance metrics (FPS, latency)

---

## 🏁 Final Notes

This project intentionally avoids third-party drawing libraries to demonstrate:
- Canvas mastery
- Real-time event streaming
- Shared state synchronization
- Correct global undo/redo behavior
