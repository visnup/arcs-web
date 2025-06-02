import type { Editor, TLUiActionsContextType } from "tldraw";

export const rotate: (editor: Editor) => TLUiActionsContextType = (editor) => {
  const rotate = (angle: number) => () => {
    editor.run(() => {
      for (const id of [
        ...editor.getSelectedShapeIds(),
        editor.getHoveredShapeId(),
      ].filter((s) => s !== null))
        editor.rotateShapesBy([id], angle);
    });
  };

  return {
    rotateCCW: {
      id: "rotate-ccw-hover",
      label: "Rotate counterclockwise",
      kbd: "q",
      onSelect: rotate(-Math.PI / 4),
    },
    rotateCW: {
      id: "rotate-cw-hover",
      label: "Rotate clockwise",
      kbd: "e",
      onSelect: rotate(Math.PI / 4),
    },
  };
};
