export {};

declare module "@tldraw/tlschema" {
  interface TLGlobalShapePropsMap {
    agent: { w: number; h: number; slot: number };
    ambition: { w: number; h: number; faceUp: boolean; index: number };
    "ambition-declared": { w: number; h: number };
    block: { w: number; h: number; kind: "large" | "small" | "circle" };
    board: { w: number; h: number; slot: number };
    card: {
      w: number;
      h: number;
      cols: number;
      rows: number;
      faceUp: boolean;
      index: number;
      backIndex?: number;
      frontUrl: string;
      backUrl: string;
    };
    "card-holder": { w: number; h: number; slot?: number };
    chapter: { w: number; h: number };
    city: { w: number; h: number; slot: number; faceUp: boolean };
    die: { w: number; h: number; face: number; kind: "assault" | "raid" | "skirmish" };
    initiative: { w: number; h: number };
    map: { w: number; h: number };
    power: { w: number; h: number; slot: number };
    resource: {
      w: number;
      h: number;
      kind: "fuel" | "material" | "weapon" | "relic" | "psionic";
    };
    ship: { w: number; h: number; slot: number; faceUp: boolean };
    stack: { w: number; h: number; count: number };
    starport: { w: number; h: number; slot: number; faceUp: boolean };
  }

  interface TLGlobalBindingPropsMap {
    "card-holder": object;
    stack: object;
  }
}
