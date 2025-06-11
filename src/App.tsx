import { nanoid } from "nanoid/non-secure";
import Room from "./Room";

export default function App() {
  const url = new URL(window.location.toString());
  const room = url.searchParams.get("room");

  if (!room) {
    url.searchParams.set("room", nanoid());
    window.location.href = url.toString();
    return null;
  }

  return <Room room={room.toLowerCase()} />;
}
