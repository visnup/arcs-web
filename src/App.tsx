import { useSync } from "@tldraw/sync";
import { useCallback } from "react";
import {
  defaultBindingUtils,
  defaultShapeUtils,
  Tldraw,
  type TLComponents,
  type TLOnMountHandler,
  type TLUiOverrides,
} from "tldraw";
import "tldraw/tldraw.css";
import { flip } from "./actions/flip";
import { rotate } from "./actions/rotate";
import { primary } from "./actions/primary";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { setup } from "./setup";
import { customBindingUtils, customShapeUtils } from "./shapes";
import { group } from "./actions/group";
import { SharePanel } from "./SharePanel";
import { colors } from "./shapes/player/colors";

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

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
    shapeUtils,
    bindingUtils,
  });

  const onMount = useCallback<TLOnMountHandler>((editor) => {
    if (window.location.search === "?new") setup(editor);
    editor.user.updateUserPreferences({
      color: colors[0],
      colorScheme: "dark",
    });
    editor.zoomToFit();
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
      />
    </div>
  );
}
