import { useEffect, useState } from "react";
import { track, useEditor } from "tldraw";
import { colors as _colors } from "./shapes/player/colors";
import type { CardShape } from "./shapes/cards/card";
import { urls as dieUrls } from "./shapes/dice/die";

const colors = Object.fromEntries(
  [..._colors.entries()].map(([i, c]) => [c, i]),
);
const SCALE = 5;

export const Preview = track(function CardPreview() {
  const editor = useEditor();
  const [alt, setAlt] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Alt") setAlt(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Alt") setAlt(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  if (!alt) return null;

  const shape = editor.getHoveredShape();
  let style: React.CSSProperties | null = null;

  if (shape?.type === "card") {
    const s = shape as CardShape;
    const binding = editor.getBindingsFromShape(s, "card-holder")[0];
    const holder = binding ? editor.getShape(binding.toId) : null;
    const faceUp = holder
      ? (holder.props as { slot: number }).slot ===
        colors[editor.user.getColor()]
      : s.props.faceUp;

    const { cols, rows, index, backIndex, frontUrl, backUrl } = s.props;
    const w = 95 * SCALE,
      h = (95 / (585 / 816)) * SCALE;

    style = faceUp
      ? sprite(index, frontUrl, cols, rows, w, h)
      : backIndex !== undefined
        ? sprite(backIndex, backUrl, cols, rows, w, h)
        : {
            backgroundImage: `url(${backUrl})`,
            backgroundSize: `${w}px ${h}px`,
            width: w,
            height: h,
          };
  } else if (shape?.type === "die") {
    const { face, kind } = shape.props as {
      face: number;
      kind: keyof typeof dieUrls;
    };
    const cols = 6,
      w = 28 * SCALE,
      h = w;
    const bgX = face * (100 / (cols - 1));
    style = {
      backgroundImage: `url(${dieUrls[kind]})`,
      backgroundSize: `${cols * w}px ${h}px`,
      backgroundPosition: `${bgX}% 0%`,
      width: w,
      height: h,
    };
  }

  if (!style) return null;

  return (
    <div
      data-testid="card-preview"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          ...style,
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
        }}
      />
    </div>
  );
});

function sprite(
  idx: number,
  url: string,
  cols: number,
  rows: number,
  w: number,
  h: number,
) {
  const col = idx % cols,
    row = Math.floor(idx / cols);
  const bgX = col * (100 / (cols - 1)),
    bgY = row * (100 / (rows - 1));
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: `${cols * w}px ${rows * h}px`,
    backgroundPosition: `${bgX}% ${bgY}%`,
    width: w,
    height: h,
  };
}
