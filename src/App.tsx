import {
  defaultShapeUtils,
  Tldraw,
  type TLOnMountHandler,
  type TLComponents,
  defaultBindingUtils,
  type TLUiOverrides,
} from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { useCallback } from "react";
import { setup } from "./setup";
import { customBindingUtils, customShapeUtils } from "./shapes";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;
const shapeUtils = [...defaultShapeUtils, ...customShapeUtils];
const bindingUtils = [...defaultBindingUtils, ...customBindingUtils];

const components: TLComponents = {
  SelectionBackground: null,
  SelectionForeground: null,
  StylePanel: null,
  Toolbar: null,
};

const overrides: TLUiOverrides = {
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
    editor.user.updateUserPreferences({ colorScheme: "dark" });
    editor.zoomToFit();

    const cleanups: (() => void)[] = [];

    // Bring selected shapes to front
    cleanups.push(
      editor.sideEffects.registerAfterChangeHandler(
        "instance_page_state",
        (p, n, source) => {
          if (source === "user" && p.selectedShapeIds !== n.selectedShapeIds)
            editor.bringToFront(n.selectedShapeIds);
        },
      ),
    );

    return () => {
      for (const fn of cleanups) fn();
    };
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
