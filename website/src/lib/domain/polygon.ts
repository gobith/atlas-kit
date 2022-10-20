import { SVGPathData } from "svg-pathdata";
import polylabel from "polylabel";

export default class Polygon {
  vertices: any;
  labelPoint: { x: number; y: number };
  bounds: { x: number; y: number; width: number; height: number };
  center: { x: number; y: number };
  constructor(d: string) {
    this.calculateVertices(d);
    this.calculateLabelPoint();
    this.calculateBounds();
  }

  calculateVertices(d: string) {
    this.vertices = [];
    const pathData = new SVGPathData(d);
    pathData.commands.forEach((command) => {
      if (command.type !== 1) {
        const array = [];
        array.push(command["x"]);
        array.push(command["y"]);

        this.vertices.push(array);
      }
    });
  }

  calculateLabelPoint() {
    const labelPointArray = polylabel([this.vertices], 1.0);
    this.labelPoint = { x: labelPointArray[0], y: labelPointArray[1] };
  }

  calculateBounds() {
    let minX: number;
    let minY: number;
    let maxX: number;
    let maxY: number;

    this.vertices.forEach((vertice) => {
      const x = vertice[0];
      const y = vertice[1];
      if (minX) {
        minX = Math.min(x, minX);
      } else {
        minX = x;
      }
      if (minY) {
        minY = Math.min(y, minY);
      } else {
        minY = y;
      }
      if (maxX) {
        maxX = Math.max(x, maxX);
      } else {
        maxX = x;
      }
      if (maxY) {
        maxY = Math.max(y, maxY);
      } else {
        maxY = y;
      }
    });

    this.center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    this.bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
}
