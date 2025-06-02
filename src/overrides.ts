import type { TLUiOverrides, TLUiActionItem, TLUnknownShape } from "tldraw";

export const overrides: TLUiOverrides = {
  actions: (editor, actions) => {
    const flip: TLUiActionItem = {
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
    };

    const rotate = (angle: number) => () => {
      editor.rotateShapesBy(
        [...editor.getSelectedShapeIds(), editor.getHoveredShapeId()].filter(
          (s) => s !== null,
        ),
        angle,
      );
    };
    const rotateLeft: TLUiActionItem = {
      id: "rotate-left",
      label: "Rotate left",
      kbd: "q",
      onSelect: rotate(-Math.PI / 4),
    };
    const rotateRight: TLUiActionItem = {
      id: "rotate-right",
      label: "Rotate right",
      kbd: "e",
      onSelect: rotate(Math.PI / 4),
    };

    return { ...actions, flip, rotateLeft, rotateRight };
  },

  tools: (_editor, tools) => {
    // Remove tools
    delete tools.arrow;
    delete tools.ellipse;
    delete tools.eraser;
    delete tools.frame;
    delete tools.line;
    delete tools.rectangle;
    return tools;
  },
};
