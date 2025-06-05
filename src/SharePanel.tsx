import { track, useEditor } from "tldraw";
import { colors } from "./shapes/player/colors";

export const SharePanel = track(function SharePanel() {
  const editor = useEditor();
  const c = editor.user.getColor();
  const collaborators = editor.getCollaboratorsOnCurrentPage();
  const present = new Set([...collaborators.map((c) => c.color), c]);

  return (
    <div
      className="tlui-share-zone"
      draggable={false}
      style={{ gap: 3, margin: 10 }}
    >
      {colors.map((color) => (
        <button
          key={color}
          className="tlui-button"
          onClick={() => editor.user.updateUserPreferences({ color })}
          style={{
            backgroundColor: color,
            width: 20,
            height: 20,
            minWidth: 0,
            padding: 0,
            opacity: present.has(color) ? 1 : 0.5,
            borderRadius: "50%",
            border: color === c ? "2px solid var(--color-text-1)" : undefined,
          }}
        ></button>
      ))}
    </div>
  );
});
