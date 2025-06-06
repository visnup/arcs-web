import { createShapeId, Editor } from "tldraw";
import { w, h } from "./shapes/player/board";
import * as d3 from "d3-array";
import { resources } from "./shapes/resource";
import action from "./shapes/cards/action.jpg";
import actionBack from "./shapes/cards/action-back.jpg";
import bc from "./shapes/cards/bc.jpg";
import bcBack from "./shapes/cards/bc-back.jpg";
import type { ShipShapeUtil } from "./shapes/player/ship";
import type { AgentShapeUtil } from "./shapes/player/agent";
import type { StarportShapeUtil } from "./shapes/player/building";

const jitter = () => Math.random() * 5;

export function setup(editor: Editor) {
  // Reset stacks
  editor.deleteShapes(
    editor.getCurrentPageShapes().filter((s) => s.type === "stack"),
  );

  const gap = 10;

  // Map
  const mapId = createShapeId("map");
  editor.createShape({ id: mapId, type: "map", isLocked: true });
  const map = editor.getShape(mapId)!;
  const { bounds } = editor.getShapeGeometry(map);
  // Chapter
  editor.createShape({
    id: createShapeId("chapter"),
    type: "chapter",
    x: bounds.maxX - 161,
    y: bounds.maxY - 66,
  });
  // Ambition declared
  editor.createShape({
    id: createShapeId("ambition-declared"),
    type: "ambition-declared",
    x: bounds.minX + 27,
    y: bounds.maxY - 103,
  });
  editor.createShapes(
    [0, 1, 2].map((index) => ({
      id: createShapeId(`ambition-${index}`),
      type: "ambition",
      x: bounds.w - 155 + 46 * index,
      y: 122,
      rotation: -Math.PI / 2,
      props: { index },
    })),
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

  // Base court
  editor.createShapes(
    d3.range(0, 31).map((index) => ({
      id: createShapeId(`bc-${index}`),
      type: "card",
      x: bounds.w + 132 + gap,
      y: bounds.h - 100,
      rotation: Math.PI / 2,
      props: { index, frontUrl: bc, backUrl: bcBack },
    })),
  );
  // Action
  editor.createShapes(
    d3.range(0, 28).map((index) => ({
      id: createShapeId(`action-${index}`),
      type: "card",
      x: 11,
      y: 108,
      rotation: -Math.PI / 2,
      props: {
        index,
        rows: 7,
        frontUrl: action,
        backUrl: actionBack,
      },
    })),
  );

  // Dice
  editor.createShapes(
    ["assault", "raid", "skirmish"].flatMap((kind, i) =>
      d3.range(0, 6).map((face) => ({
        id: createShapeId(`die-${kind}-${face}`),
        type: "die",
        x: -230 - i * 40 + jitter(),
        y: 140 + face * 40 + jitter(),
        props: { kind, face },
      })),
    ),
  );

  // Players
  const positions = [
    { x: bounds.maxX - w, y: bounds.maxY + h + gap }, // bottom-right
    { x: bounds.minX, y: bounds.maxY + h + gap }, // bottom-left
    { x: bounds.minX, y: bounds.minY - 2 * h - gap }, // top-left
    { x: bounds.maxX - w, y: bounds.minY - 2 * h - gap }, // top-right
  ];
  // Initiative
  editor.createShape({
    id: createShapeId("initiative"),
    type: "initiative",
    x: positions[0].x - 60,
    y: positions[0].y - 120,
  });
  // Player boards
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
  // Card holders
  editor
    .createShapes(
      slots.map((slot) => ({
        id: createShapeId(`cards-${slot}`),
        type: "card-holder",
        x: positions[slot].x,
        y: positions[slot].y + h * (slot <= 1 ? -1 : 1),
        isLocked: true,
        props: { w, h, slot },
      })),
    )
    .deleteBindings(
      slots.flatMap((slot) =>
        editor.getBindingsToShape(
          createShapeId(`cards-${slot}`),
          "card-holder",
        ),
      ),
    );

  // Cities
  editor.createShapes(
    slots.flatMap((slot) =>
      [0, 1, 2.5, 4, 5].map((i) => ({
        id: createShapeId(`city-${slot}-${i}`),
        type: "city",
        props: { slot },
        x: positions[slot].x + w / 3.6 + (i * w) / 8.58,
        y: positions[slot].y + h / 8.9,
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
        y: positions[slot].y + h / 8.9 + jitter(),
      })),
    ),
  );
  for (const s of slots)
    (editor.getShapeUtil("starport") as StarportShapeUtil).stack(
      editor.getShape(createShapeId(`starport-${s}-4`))!,
    );
  // Ships
  editor.createShapes(
    slots.flatMap((slot) =>
      d3.range(0, 15).map((i) => ({
        id: createShapeId(`ship-${slot}-${i}`),
        type: "ship",
        props: { slot },
        x: positions[slot].x + w + gap + jitter(),
        y: positions[slot].y + 70 + jitter(),
      })),
    ),
  );
  for (const s of slots)
    (editor.getShapeUtil("ship") as ShipShapeUtil).stack(
      editor.getShape(createShapeId(`ship-${s}-14`))!,
    );
  // Agents
  editor.createShapes(
    slots.flatMap((slot) =>
      d3.range(0, 10).map((i) => ({
        id: createShapeId(`agent-${slot}-${i}`),
        type: "agent",
        props: { slot },
        x: positions[slot].x + w + gap + 20 + jitter(),
        y: positions[slot].y + 110 + jitter(),
      })),
    ),
  );
  for (const s of slots)
    (editor.getShapeUtil("agent") as AgentShapeUtil).stack(
      editor.getShape(createShapeId(`agent-${s}-9`))!,
    );
  // Power markers
  editor.createShapes(
    slots.map((slot, i) => ({
      id: createShapeId(`power-${slot}-1`),
      type: "power",
      props: { slot },
      x: 15 + (i % 2) * 15,
      y: bounds.maxY - 15 - Math.floor(i / 2) * 15,
    })),
  );
}
