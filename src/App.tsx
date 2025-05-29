import { Tldraw, type TLOnMountHandler } from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
  });

  const onMount: TLOnMountHandler = (editor) => {
    editor.user.updateUserPreferences({ colorScheme: "dark" });
  };

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} onMount={onMount} />
    </div>
  );
}
