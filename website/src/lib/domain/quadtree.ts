import Quadtree, { Rect } from "@timohausmann/quadtree-js";

interface Area extends Rect {
  area: any;
}

export default class AreaQuadTree {
  tree: Quadtree;
  constructor(areas: any[]) {
    const bounds = this.calculateBounds(areas);
    this.tree = new Quadtree(bounds);

    areas.forEach((area) => {
      const bounds = area.polygon.bounds;
      const a: Area = {
        area: area,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
      this.tree.insert(a);
    });
  }

  calculateBounds(areas) {
    let minX: number;
    let minY: number;
    let maxX: number;
    let maxY: number;

    areas.forEach((area) => {
      const bounds = area.polygon.bounds;

      const originX = bounds.x;
      const originY = bounds.y;
      const extentX = bounds.x + bounds.width;
      const extentY = bounds.y + bounds.height;

      if (minX) {
        minX = Math.min(originX, minX);
      } else {
        minX = originX;
      }
      if (minY) {
        minY = Math.min(originY, minY);
      } else {
        minY = originY;
      }
      if (maxX) {
        maxX = Math.max(extentX, maxX);
      } else {
        maxX = originX;
      }
      if (maxY) {
        maxY = Math.max(extentY, maxY);
      } else {
        maxY = originY;
      }
    });

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
}
