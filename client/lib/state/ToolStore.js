class ToolStore {
  constructor() {
    this.tool = "brush"; // brush | eraser
    this.color = "#000000";
    this.width = 4;
  }

  setTool(tool) {
    this.tool = tool;
  }

  setColor(color) {
    this.color = color;
  }

  setWidth(width) {
    this.width = width;
  }
}

const toolStore = new ToolStore();
export default toolStore;
