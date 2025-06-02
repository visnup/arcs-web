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
    const rotateCCW: TLUiActionItem = {
      id: "rotate-ccw-hover",
      label: "Rotate counterclockwise",
      kbd: "q",
      onSelect: rotate(-Math.PI / 4),
    };
    const rotateCW: TLUiActionItem = {
      id: "rotate-cw-hover",
      label: "Rotate clockwise",
      kbd: "e",
      onSelect: rotate(Math.PI / 4),
    };

    return { ...actions, flip, rotateCCW, rotateCW };
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
