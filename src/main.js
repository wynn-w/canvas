class CanvasControl {
  /**
   * @param {{container: string}} ops
   * */
  constructor(ops) {
    this.canvasInit(ops);
    this.store = new Map([["circle", []]]);
    this.activeTarget = null;
  }
  canvasInit(ops) {
    this.canvas = document.getElementById(ops.container);
    this.ctx = this.canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
  }
}
const entry = new CanvasControl({
  container: "canvas-main",
});
const canvas = entry.canvas;

class Circle {
  constructor(ops = {}) {
    const { x = 100, y = 100, r = 50 } = ops;
    this.meta = { x, y, r };
    this.create();
  }
  create() {
    entry.ctx.save();
    entry.ctx.beginPath();
    const { x, y, r } = this.meta;
    entry.ctx.strokeStyle = "red";
    entry.ctx.arc(x, y, r, 0, 360);
    entry.ctx.stroke();

    entry.ctx.closePath();
    entry.ctx.restore();
    entry.store.get("circle").push({
      meta: { x, y, r },
      hot: true,
    });
  }
}

const c1 = new Circle();
