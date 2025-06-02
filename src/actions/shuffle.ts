import type { Editor, TLUiActionsContextType } from "tldraw";
import * as d3 from "d3-array";

export const shuffle: (editor: Editor) => TLUiActionsContextType = (
  editor,
) => ({
  shuffle: {
    id: "shuffle",
    label: "Shuffle",
    kbd: "r",
    onSelect: () => {
      const order = d3.shuffle(
        [...editor.getSelectedShapeIds(), editor.getHoveredShapeId()].filter(
          (d) => d !== null,
        ),
      );
      editor.run(() => {
        for (const id of order) editor.bringToFront([id]);
      });
    },
  },
});
