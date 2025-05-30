import { defaultShapeUtils, Tldraw, type TLOnMountHandler } from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { useCallback } from "react";
import { MapShapeUtil } from "./shapes/map";
import { BoardShapeUtil } from "./shapes/player/board";
import { setup } from "./setup";
import { ShipShapeUtil } from "./shapes/player/ship";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;

const shapeUtils = [
  BoardShapeUtil,
  MapShapeUtil,
  ShipShapeUtil,
  ...defaultShapeUtils,
];

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
    shapeUtils,
  });

  const onMount = useCallback<TLOnMountHandler>((editor) => {
    editor.user.updateUserPreferences({ colorScheme: "dark" });
    setup(editor);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} shapeUtils={shapeUtils} onMount={onMount} />
    </div>
  );
}
