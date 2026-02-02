export default class StrokeBuilder {
  constructor() {
    this.points = [];
    this.MIN_DIST = 2;
  }

  add(point) {
    const last = this.points[this.points.length - 1];
    if (!last || this.dist(last, point) > this.MIN_DIST) {
      this.points.push(point);
    }
  }

  dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
}
