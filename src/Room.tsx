import { useSync } from "@tldraw/sync";
import { useCallback } from "react";
import {
  createShapeId,
  defaultBindingUtils,
  defaultShapeUtils,
  Tldraw,
  type TLComponents,
  type TLOnMountHandler,
  type TLUiOverrides,
} from "tldraw";
import "tldraw/tldraw.css";
import { flip } from "./actions/flip";
import { group } from "./actions/group";
import { primary } from "./actions/primary";
import { rotate } from "./actions/rotate";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { setup } from "./setup";
import { customBindingUtils, customShapeUtils } from "./shapes";
import { colors } from "./shapes/player/colors";
import { SharePanel } from "./SharePanel";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;
const shapeUtils = [...defaultShapeUtils, ...customShapeUtils];
const bindingUtils = [...defaultBindingUtils, ...customBindingUtils];

const components: TLComponents = {
  SelectionBackground: null,
  SelectionForeground: null,
  SharePanel: SharePanel,
  StylePanel: null,
  Toolbar: null,
};

const overrides: TLUiOverrides = {
  actions: (editor, actions) => {
    // Custom actions
    const custom = {
      ...flip(editor),
      ...group(editor),
      ...primary(editor),
      ...rotate(editor),
    };

    // Remove conflicting keys
    const kbd = new Set(Object.values(custom).map((a) => a.kbd));
    for (const v of Object.values(actions)) if (kbd.has(v.kbd)) delete v.kbd;

    return {
      ...actions,
      ...custom,
    };
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

interface RoomProps {
  room: string;
}

export default function Room({ room }: RoomProps) {
  const store = useSync({
    uri: `${WORKER_URL}/connect/${room}`,
    assets: multiplayerAssetStore,
    shapeUtils,
    bindingUtils,
  });

  const onMount = useCallback<TLOnMountHandler>((editor) => {
    const map = editor.getShape(createShapeId("map"));
    const url = new URL(window.location.toString());
    if (!map || url.searchParams.has("new")) setup(editor);
    let color = editor.user.getColor();
    if (!colors.includes(color)) {
      const others = editor.getCollaboratorsOnCurrentPage().map((u) => u.color);
      color = colors.find((c) => !others.includes(c)) ?? colors[0];
    }
    editor.user.updateUserPreferences({
      color,
      colorScheme: "dark",
    });
    if (!map) editor.zoomToFit();
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        store={store}
        shapeUtils={shapeUtils}
        bindingUtils={bindingUtils}
        components={components}
        overrides={overrides}
        onMount={onMount}
        deepLinks
      />
    </div>
  );
}
