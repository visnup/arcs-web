import { createShapeId, Editor } from "tldraw";
import { w, h } from "./shapes/player/board";

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
  editor.createShapes(
    [0, 1, 2, 3].map((slot) => ({
      id: createShapeId(`board-${slot}`),
      type: "board",
      x: positions[slot].x,
      y: positions[slot].y,
      isLocked: true,
      props: { slot },
    })),
  );

  editor.createShapes(
    [0, 1, 2, 3].flatMap((slot) =>
      [0, 1, 2.5, 4, 5].map((i) => ({
        id: createShapeId(`city-${slot}-${i}`),
        type: "city",
        props: { slot },
        x: positions[slot].x + w / 3.6 + (i * w) / 8.58,
        y: positions[slot].y + h / 8.7,
      })),
    ),
  );

  editor.zoomToFit();
}
