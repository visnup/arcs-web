import { rollups } from "d3-array";
import type { Editor, TLUiActionsContextType } from "tldraw";

export const group: (editor: Editor) => TLUiActionsContextType = (editor) => ({
  group: {
    id: "group",
    label: "Group",
    kbd: "g",
    onSelect: () => {
      const shapes = [
        editor.getHoveredShape(),
        ...editor.getSelectedShapes(),
      ].filter((s) => s !== undefined);
      if (!shapes.length) return;
      const most = JSON.parse(
        rollups(
          shapes,
          (r) => r.length,
          (s) => JSON.stringify({ x: s.x, y: s.y }),
        ).sort((a, b) => b[1] - a[1])[0][0],
      );
      editor.updateShapes(
        shapes.map((s) => ({
          id: s.id,
          type: s.type,
          x: most.x,
          y: most.y,
        })),
      );
    },
  },
});
