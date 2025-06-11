import { rollups } from "d3-array";
import type { Editor, TLUiActionsContextType } from "tldraw";
import { getHoveredOrSelectedShapes } from "./getHoveredOrSelectedShapes";

export const group: (editor: Editor) => TLUiActionsContextType = (editor) => ({
  group: {
    id: "group",
    label: "Group",
    kbd: "g",
    onSelect: () => {
      const shapes = getHoveredOrSelectedShapes(editor);
      if (!shapes.length) return;
      const most = JSON.parse(
        rollups(
          shapes,
          (r) => r.length,
          (s) => JSON.stringify({ x: s.x, y: s.y, rotation: s.rotation }),
        ).sort((a, b) => b[1] - a[1])[0][0],
      );
      editor.updateShapes(
        shapes.map((s) => ({
          id: s.id,
          type: s.type,
          ...most,
        })),
      );
    },
  },
});
