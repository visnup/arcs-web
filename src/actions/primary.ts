import { group } from "d3-array";
import type { Editor, TLUiActionsContextType } from "tldraw";
import { getHoveredOrSelectedShapes } from "./getHoveredOrSelectedShapes";

export const primary: (editor: Editor) => TLUiActionsContextType = (
  editor,
) => ({
  primary: {
    id: "primary",
    kbd: "r",
    onSelect: () => {
      const shapes = getHoveredOrSelectedShapes(editor);
      editor.run(() => {
        for (const [type, s] of group(shapes, (s) => s.type)) {
          const shapeUtil = editor.getShapeUtil(type);
          if (
            "onPrimaryAction" in shapeUtil &&
            typeof shapeUtil.onPrimaryAction === "function"
          )
            shapeUtil.onPrimaryAction(s);
        }
      });
    },
  },
});
