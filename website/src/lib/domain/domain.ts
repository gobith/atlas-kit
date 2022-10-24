import utils from "svg-path-reverse";
import type Polygon from "./polygon";
import type {
  UUID,
  BorderDirection,
  PathData,
  AreaData,
  RegentData,
  ProvinceData,
  TerrainData,
} from "./types";

export class Node {
  id: string;
  pathToNodeMapping: Map<number, BorderDirection>;

  constructor(id: number) {
    this.id = id;
    this.pathToNodeMapping = new Map();
  }

  borderA(border: Border) {
    this.pathToNodeMapping.set(border.b, {
      border: border,
      direction: "forward",
    });
  }

  borderB(border: Border) {
    this.pathToNodeMapping.set(border.a, {
      border: border,
      direction: "reverse",
    });
  }

  initialFillPath(
    array: PathData[],
    leftOver: Map<number, Node>,
    nodes: Map<number, Node>
  ) {
    leftOver.delete(this.id);
    const [nextNodeId] = this.pathToNodeMapping.keys();

    const object = this.pathToNodeMapping.get(nextNodeId)!;
    const d = object.border.initialD(object.direction);
    array.push(d);
    const nextNode = nodes.get(nextNodeId)!;
    nextNode.fillPath(array, this.id, leftOver, this.id, nodes);
  }

  fillPath(
    array: PathData[],
    prevNodeId: number,
    leftOver: Map<number, Node>,
    beginNodeId: number,
    nodes: Map<number, Node>
  ) {
    if (this.id === beginNodeId) {
      return;
    }
    leftOver.delete(this.id);
    this.pathToNodeMapping.forEach((object, nextNodeId) => {
      if (nextNodeId !== prevNodeId) {
        const d = object.border.followingD(object.direction);
        array.push(d);
        const nextNode = nodes.get(nextNodeId)!;
        nextNode.fillPath(array, this.id, leftOver, beginNodeId, nodes);
      }
    });
  }
}

export class Border {
  id: number;
  a: number;
  b: number;
  d: PathData;

  constructor(data: any) {
    this.id = data.id;
    this.a = data.a;
    this.b = data.b;
    this.d = data.d;
  }

  initialD(direction: string): PathData {
    if (direction === "forward") {
      return this.d;
    } else {
      return utils.reverse(this.d);
    }
  }

  followingD(direction: string) {
    if (direction === "forward") {
      return this.d.replace("M", "L");
    } else {
      return utils.reverse(this.d).replace("M", "L");
    }
  }
}

export class ProvinceArea {
  borders: number[];
  path?: Path2D;
  province?: Province;
  labelPoint: any;
  polygon?: Polygon;

  constructor(areaData: AreaData) {
    this.borders = areaData.borders;
  }
}

export class RealmArea {
  path?: Path2D;
  domain: Domain;
  labelPoint: any;

  constructor(domainObject: Domain) {
    this.domain = domainObject;
  }
}

export class Loyalty {
  constructor() {}
}

export class LoyaltyAverage extends Loyalty {
  constructor() {
    super();
  }

  smiley() {
    return "😐";
  }
}

export class LoyaltyHigh extends Loyalty {
  constructor() {
    super();
  }

  smiley() {
    return "🙂";
  }
}

export class LoyaltyPoor extends Loyalty {
  constructor() {
    super();
  }

  smiley() {
    return "🙁";
  }
}

export class LoyaltyRebellious extends Loyalty {
  constructor() {
    super();
  }

  smiley() {
    return "😠";
  }
}

const loyaltyClasses = new Map<string, Loyalty>(
  Object.entries({
    High: LoyaltyHigh,
    Average: LoyaltyAverage,
    Poor: LoyaltyPoor,
    Rebellious: LoyaltyRebellious,
  })
);

export class Entity {
  id: UUID;

  constructor(object: any) {
    this.id = object.id;
  }

  isRegent() {
    return false;
  }
  isDomain() {
    return false;
  }
  isProvince() {
    return false;
  }
  isHolding() {
    return false;
  }

  areas(): ProvinceArea[] {
    return [];
  }
}

export class Regent extends Entity {
  name: string;
  domains: Domain[];

  constructor(object: RegentData) {
    super(object);
    this.name = object.name;
    this.domains = [];
  }

  typeString() {
    return "Regent";
  }

  isRegent() {
    return true;
  }

  areas(): ProvinceArea[] {
    const areas: ProvinceArea[] = [];

    this.domains.forEach((domain) => {
      domain.addToAreas(areas);
    });

    return areas;
  }
}

export class Domain extends Entity {
  name: string;
  gold: number;
  owner?: Regent;
  provinces: Province[];
  holdings: Holding[];
  abbr: string;

  constructor(object: any) {
    super(object);
    this.name = object.name;
    this.gold = object.gold;
    this.provinces = [];
    this.holdings = [];
    this.abbr = object.abbr;
  }

  typeString() {
    if (this.hasProvinces()) {
      return "Realm";
    } else {
      return "Domain";
    }
  }

  isDomain() {
    return true;
  }

  areas(): ProvinceArea[] {
    const areas: ProvinceArea[] = [];
    this.addToAreas(areas);
    return areas;
  }

  addToAreas(areaCollection: ProvinceArea[]): void {
    this.provinces.forEach((province) => {
      province.addToAreas(areaCollection);
    });
  }

  regent() {
    return this.owner;
  }

  hasProvinces() {
    return this.provinces.length > 0;
  }

  stats() {
    return `${this.level()}/${this.sourceRating()}`;
  }

  level() {
    return this.provinces
      .map((province) => province.level)
      .reduce((a, b) => {
        return a + b;
      });
  }

  sourceRating() {
    return this.provinces
      .map((province) => province.sourceRating)
      .reduce((a, b) => {
        return a + b;
      });
  }
}

export class Province extends Entity {
  name: string;
  level: number;
  loyalty: LoyaltyHigh | LoyaltyAverage | LoyaltyPoor | LoyaltyRebellious;
  sourceRating: number;
  terrain: TerrainData;
  owner?: Domain;
  holdings: Holding[];
  provinceAreas: ProvinceArea[];
  descriptionArea?: ProvinceArea;

  constructor(object: ProvinceData) {
    super(object);
    this.name = object.name;
    this.level = object.level;
    const loyaltyClass: Loyalty = loyaltyClasses.get(object.loyalty)!;
    this.loyalty = new loyaltyClass();
    this.sourceRating = object.sourceRating;
    this.terrain = object.terrain;
    this.holdings = [];
    this.provinceAreas = [];
  }

  typeString() {
    return "Province";
  }

  isProvince() {
    return true;
  }

  stats() {
    return `${this.level}/${this.sourceRating}`;
  }

  areas() {
    return this.provinceAreas;
  }

  addToAreas(areaCollection: ProvinceArea[]): void {
    this.provinceAreas.forEach((area) => {
      areaCollection.push(area);
    });
  }

  regent() {
    if (this.owner) {
      return this.owner.regent();
    } else {
      return null;
    }
  }

  domain() {
    return this.owner;
  }

  domainHoldings() {
    const domainHoldings = new Map();

    this.holdings.forEach((holding) => {
      let domainHolding;
      if (domainHoldings.has(holding.owner)) {
        domainHolding = domainHoldings.get(holding.owner);
      } else {
        domainHolding = {
          owner: holding.owner,
          law: "",
          temple: "",
          guild: "",
          source: "",
        };
        domainHoldings.set(holding.owner, domainHolding);
      }
      domainHolding[holding.type] = holding.level;
    });
    return Array.from(domainHoldings.values());
  }
}
export class Holding extends Entity {
  province?: Province;
  level: number;
  type: string;
  owner?: Domain;

  constructor(object: any) {
    super(object);
    this.level = object.level;
    this.type = object.type;
  }

  typeString() {
    return "Holding";
  }

  isHolding() {
    return true;
  }
}
