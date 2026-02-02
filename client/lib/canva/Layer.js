export default class Layers {
  constructor(width, height) {
    this.base = this.createLayer(width, height);
    this.live = this.createLayer(width, height);
  }

  createLayer(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }

  clear(layer) {
    const ctx = layer.getContext("2d");
    ctx.clearRect(0, 0, layer.width, layer.height);
  }
}
