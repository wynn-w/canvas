class CanvasControl {
  /**
   * @param {{container: string}} ops
   * */
  constructor(ops) {
    this.canvasInit(ops);
    this.store = new Map([["circle", []]]);
    this.activeTarget = null;
    this.status = {
      status: GraStatusEnum.IDLE,
    };
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
const GraStatusEnum = {
  IDLE: 0,
  DRAG_START: 1,
  DRAGGING: 2,
};
const entry = new CanvasControl({
  container: "canvas-main",
});
const canvas = entry.canvas;

class Circle {
  constructor(ops = { x: 100, y: 100, r: 50, lineWidth: 2 }) {
    this.meta = { ...ops };
    this.draw();
  }
  draw() {
    entry.ctx.save();
    entry.ctx.beginPath();
    const { x, y, r, lineWidth } = this.meta;
    entry.ctx.strokeStyle = "red";
    entry.ctx.arc(x, y, r, 0, 360);
    entry.ctx.lineWidth = lineWidth;
    entry.ctx.stroke();

    entry.ctx.closePath();
    entry.ctx.restore();
    entry.store.get("circle").push({
      meta: this.meta,
      hot: true,
      pointer: this,
    });
  }
}

const c1 = new Circle();

canvas.addEventListener("mousedown", (e) => {
  const pos = entry.getPointerPosition(e);
  const target = entry.findTarget(pos);
  if (target) {
    entry.status.status = GraStatusEnum.DRAG_START;
    entry.activeTarget = target;
    entry.lastPos = pos;
  }
});
canvas.addEventListener("mousemove", (e) => {
  const pos = entry.getPointerPosition(e);
  if (entry.findTarget(pos)) {
    canvas.style.cursor = "all-scroll";
  } else {
    canvas.style.cursor = "";
  }
  if (
    entry.status.status === GraStatusEnum.DRAG_START &&
    entry.getDistance(pos, entry.lastPos) > 5 
  ) {
    console.log("ready to drag");
    entry.status.status = GraStatusEnum.DRAGGING;
  } else if (entry.status.status === GraStatusEnum.DRAGGING) {
    console.assert(entry.activeTarget, "not exist");
    if (entry.activeTarget) {
      console.log("dragging");
      entry.status.status = GraStatusEnum.DRAGGING;

      // clear screen -> TODO: clear target
      entry.ctx.clearRect(0, 0, entry.canvas.width, entry.canvas.height);

      entry.activeTarget.meta.x = pos.x;
      entry.activeTarget.meta.y = pos.y;

      // redraw target shape
      entry.activeTarget.pointer.draw();
    }
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (entry.status.status === GraStatusEnum.DRAGGING) {
    entry.status.status = GraStatusEnum.IDLE;
    console.log("drag finished");
  }
});
