import { createShapeId, Editor } from "tldraw";
import { w, h } from "./shapes/player/board";
import * as d3 from "d3-array";
import { resources } from "./shapes/resource";

const jitter = () => Math.random() * 5;

export function setup(editor: Editor) {
  // Map
  const mapId = createShapeId("map");
  editor.createShape({ id: mapId, type: "map", isLocked: true });
  const map = editor.getShape(mapId)!;
  const { bounds } = editor.getShapeGeometry(map);

  // Player boards
  const gap = 20;
  const positions = [
    { x: bounds.maxX - w, y: bounds.maxY + gap }, // bottom-right
    { x: bounds.minX, y: bounds.maxY + gap }, // bottom-left
    { x: bounds.minX, y: bounds.minY - h - gap }, // top-left
    { x: bounds.maxX - w, y: bounds.minY - h - gap }, // top-right
  ];
  const slots = [0, 1, 2, 3];
  editor.createShapes(
    slots.map((slot) => ({
      id: createShapeId(`board-${slot}`),
      type: "board",
      x: positions[slot].x,
      y: positions[slot].y,
      isLocked: true,
      props: { slot },
    })),
  );

  // Cities
  editor.createShapes(
    slots.flatMap((slot) =>
      [0, 1, 2.5, 4, 5].map((i) => ({
        id: createShapeId(`city-${slot}-${i}`),
        type: "city",
        props: { slot },
        x: positions[slot].x + w / 3.6 + (i * w) / 8.58,
        y: positions[slot].y + h / 8.8,
      })),
    ),
  );
  // Starports
  editor.createShapes(
    slots.flatMap((slot) =>
      d3.range(0, 5).map((i) => ({
        id: createShapeId(`starport-${slot}-${i}`),
        type: "starport",
        props: { slot },
        x: positions[slot].x + w + gap + 10 + jitter(),
        y: positions[slot].y + h / 8.8 + jitter(),
      })),
    ),
  );
  // Ships
  editor.createShapes(
    slots.flatMap((slot) =>
      d3.range(0, 15).map((i) => ({
        id: createShapeId(`ship-${slot}-${i}`),
        type: "ship",
        props: { slot },
        x: positions[slot].x + w + gap + jitter(),
        y: positions[slot].y + 3.5 * gap + jitter(),
      })),
    ),
  );
  // Agents
  editor.createShapes(
    slots.flatMap((slot) =>
      d3.range(0, 10).map((i) => ({
        id: createShapeId(`agent-${slot}-${i}`),
        type: "agent",
        props: { slot },
        x: positions[slot].x + w + gap + 20 + jitter(),
        y: positions[slot].y + 6 * gap + jitter(),
      })),
    ),
  );

  // Resources
  editor.createShapes(
    resources.flatMap((kind, i) =>
      d3.range(0, 5).map((j) => ({
        id: createShapeId(`resource-${kind}-${j}`),
        type: "resource",
        props: { kind },
        x: -120 + jitter(),
        y: bounds.h / 2 - i * 60 + 40 + jitter(),
      })),
    ),
  );

  editor.zoomToFit();
}
