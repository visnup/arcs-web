import type { Editor, TLUiActionsContextType, TLUnknownShape } from "tldraw";

export const flip: (editor: Editor) => TLUiActionsContextType = (editor) => ({
  flip: {
    id: "flip",
    label: "Flip",
    kbd: "f",
    onSelect: () => {
      editor.updateShapes(
        [...editor.getSelectedShapes(), editor.getHoveredShape()]
          .filter(
            (s): s is TLUnknownShape & { props: { faceUp: boolean } } =>
              !!s && "faceUp" in s.props,
          )
          .map((s) => ({
            id: s.id,
            type: s.type,
            props: { faceUp: !s.props.faceUp },
          })),
      );
    },
  },
});
