import type { Editor, TLUiActionsContextType, TLUnknownShape } from "tldraw";
import { getHoveredOrSelectedShapes } from "./getHoveredOrSelectedShapes";

export const flip: (editor: Editor) => TLUiActionsContextType = (editor) => ({
  flip: {
    id: "flip",
    label: "Flip",
    kbd: "f",
    onSelect: () => {
      const shapes = getHoveredOrSelectedShapes(editor).filter(
        (s): s is TLUnknownShape & { props: { faceUp: boolean } } =>
          "faceUp" in s.props,
      );
      editor.run(() => {
        editor.updateShapes(
          shapes.map((s) => ({
            id: s.id,
            type: s.type,
            props: { faceUp: !s.props.faceUp },
          })),
        );
        if (shapes.length <= 1) return;
        const ids = new Set(shapes.map((s) => s.id));
        const order = editor
          .getCurrentPageShapesSorted()
          .map((s) => s.id)
          .filter((id) => ids.has(id))
          .reverse();
        for (const id of order) editor.bringToFront([id]);
      });
    },
  },
});
