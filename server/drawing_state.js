// server/drawing-state.js

class DrawingState {
  constructor() {
    this.operations = [];
  }

  addOperation(op) {
    // Clear redo history ONLY if there are undone ops
    // and this is a NEW operation
    if (this.operations.some(o => o.undone)) {
      this.operations = this.operations.filter(o => !o.undone);
    }

    this.operations.push(op);
  }

  getActiveOperations() {
    return this.operations.filter(op => !op.undone);
  }

  undo() {
    for (let i = this.operations.length - 1; i >= 0; i--) {
      if (!this.operations[i].undone) {
        this.operations[i].undone = true;
        return this.operations[i];
      }
    }
    return null;
  }

  redo() {
    for (let i = this.operations.length - 1; i >= 0; i--) {
      if (this.operations[i].undone) {
        this.operations[i].undone = false;
        return this.operations[i];
      }
    }
    return null;
  }
}

module.exports = DrawingState;
