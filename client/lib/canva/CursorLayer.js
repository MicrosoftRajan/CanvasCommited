export default class CursorLayer {
  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    this.cursors = new Map();
  }

  update(userId, x, y, color) {
    this.cursors.set(userId, { x, y, color });
  }

  remove(userId) {
    this.cursors.delete(userId);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clear();

    for (const { x, y, color } of this.cursors.values()) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
