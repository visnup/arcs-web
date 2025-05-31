import {
  defaultShapeUtils,
  Tldraw,
  type TLOnMountHandler,
  type TLComponents,
} from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { useCallback } from "react";
import { setup } from "./setup";
import { customShapeUtils } from "./shapes";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;
const shapeUtils = [...defaultShapeUtils, ...customShapeUtils];

const components: TLComponents = {
  SelectionBackground: null,
  SelectionForeground: null,
  StylePanel: null,
  Toolbar: null,
};

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
    shapeUtils,
  });

  const onMount = useCallback<TLOnMountHandler>((editor) => {
    if (window.location.pathname === "/new") setup(editor);
    editor.user.updateUserPreferences({ colorScheme: "dark" });
    editor.zoomToFit();
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        store={store}
        shapeUtils={shapeUtils}
        components={components}
        onMount={onMount}
      />
    </div>
  );
}
