import { Tldraw, type TLOnMountHandler } from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";
import { useCallback } from "react";
import { asset as mapAsset, shape as mapShape } from "./shapes/map";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
  });

  const onMount = useCallback<TLOnMountHandler>((editor) => {
    editor.user.updateUserPreferences({ colorScheme: "dark" });

    editor.createAssets([mapAsset]);
    editor.createShape(mapShape);
    console.log(editor.store.allRecords());
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} onMount={onMount} />
    </div>
  );
}
