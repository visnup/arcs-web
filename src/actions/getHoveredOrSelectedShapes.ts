import type { Editor } from "tldraw";

export function getHoveredOrSelectedShapeIds(editor: Editor) {
  const hovered = editor.getHoveredShapeId();
  const selected = editor.getSelectedShapeIds();
  return hovered && !selected.includes(hovered) ? [hovered] : selected;
}

export function getHoveredOrSelectedShapes(editor: Editor) {
  const hovered = editor.getHoveredShape();
  const selected = editor.getSelectedShapes();
  return hovered && !selected.includes(hovered) ? [hovered] : selected;
}
