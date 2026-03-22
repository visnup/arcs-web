import { useEditor, useValue } from "tldraw";
import { snapTarget } from "./shapes/snap";

export function SnapPreview() {
  const editor = useEditor();
  const data = useValue(
    "snap-preview",
    () => {
      const t = snapTarget.get();
      if (!t) return null;
      const shape = editor.getShape(t.shapeId);
      if (!shape) return null;
      const { w, h } = shape.props as { w: number; h: number };
      const zoom = editor.getZoomLevel();
      const { x, y } = editor.pageToViewport({ x: t.x, y: t.y });
      return { shape, w, h, zoom, x, y, rotation: t.rotation };
    },
    [editor],
  );

  if (!data) return null;
  const { shape, w, h, zoom, x, y, rotation } = data;
  const util = editor.getShapeUtil(shape);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w * zoom,
        height: h * zoom,
        opacity: 0.4,
        pointerEvents: "none",
        overflow: "hidden",
        transform: `rotate(${rotation}rad)`,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          width: w,
          height: h,
        }}
      >
        {util.component(shape)}
      </div>
    </div>
  );
}
