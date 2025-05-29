import { Tldraw } from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { multiplayerAssetStore } from "./multiplayerAssetStore";

const WORKER_URL = process.env.TLDRAW_WORKER_URL;

export default function App() {
  const store = useSync({
    uri: `${WORKER_URL}/connect/1`,
    assets: multiplayerAssetStore,
  });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} />
    </div>
  );
}
