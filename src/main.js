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
  findTarget(pointer) {
    // TODO
    let target;
    this.store.get("circle").forEach((item) => {
      if (this.getDistance(item.meta, pointer) < item.meta.r) {
        target = item;
      }
    });
    return target;
  }
  /**
   * @param {{x: number; y: number}} p1
   * @param {{x: number; y: number}} p2
   */
  getDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.x - p2.x) ** 2);
  }
  getPointerPosition(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
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

canvas.addEventListener("mousedown", (e) => {
  const pos = entry.getPointerPosition(e);
  const target = entry.findTarget(pos);
  console.log(target);
});
