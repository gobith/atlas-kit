import { SVGPathData } from "svg-pathdata";
import polylabel from "polylabel";
import { Border, Node } from "./domain";
import type {AreaData , BorderData , PathData} from "./types";
const borders = new Map();

export const storeBorders = (borderData: BorderData[]) => {
  borderData.forEach((border) => {
    borders.set(border.id as string, new Border(border));
  });
};

const createNodes = (borderData: BorderData[])  => {
  const nodes = new Map<number , Node>();

  borderData.forEach((border) => {
    if (nodes.has(border.a)) {
      nodes.get(border.a).borderA(border);
    } else {
      const node = new Node(border.a);
      node.borderA(border);
      nodes.set(border.a, node);
    }

    if (nodes.has(border.b)) {
      nodes.get(border.b).borderB(border);
    } else {
      const node = new Node(border.b);
      node.borderB(border);
      nodes.set(border.b, node);
    }
  });

  return nodes;
};

export const borderPathForAreas = (areas: AreaData[]) : Path2D => {

  console.log("borders" , borders);
  console.log("areas" , areas);

  return new Path2D(borderDForAreas(areas));
};

export const borderDForArea = (area: AreaData) => {
  return borderDForAreas([area]);
};

export const borderDForAreas = (areas: AreaData[]) => {
  const areaBorders = bordersForAreas(areas, 1);
  const nodes = createNodes(areaBorders);
  return borderDForNodes(nodes);
};

const bordersForAreas = (areas: AreaData[], value: number) => {
  const borderIdBag = new Map();
  const areaBorders: Border[] = [];
  areas.forEach((area) => {
    area.borders.forEach((borderId) => {
      borderIdBag.set(borderId, (borderIdBag.get(borderId) ?? 0) + 1);
    });
  });

  borderIdBag.forEach((occurence, borderId) => {
    if (occurence === value) {
      areaBorders.push(borders.get(borderId));
    }
  });

  return areaBorders;
};

const borderDForNodes = (nodes: Map<number, Node>) => {
  const paths: PathData[] = [];
  const leftOver = new Map(nodes);
  nodes.forEach((node, nodeId) => {
    if (leftOver.has(nodeId)) {
      const array: PathData[] = [];
      node.initialFillPath(array, leftOver, nodes);
      const path = array.join(" ");
      paths.push(path);
    }
  });
  return paths.join(" ");
};

export const provinceBordersPathForAreas = (areas) => {
  const provinceBorders = bordersForAreas(areas, 2);

  return new Path2D(provinceBorders.map((border) => border.d).join(" "));
};

export const polylabelForD = (d) => {
  const pathData = new SVGPathData(d);

  const polygon = [];

  pathData.commands.forEach((command) => {
    if (command.type !== 1) {
      const array = [];
      array.push(command["x"]);
      array.push(command["y"]);

      polygon.push(array);
    }
  });
  const labelPoint = polylabel([polygon], 1.0);
  return { x: labelPoint[0], y: labelPoint[1] };
};
