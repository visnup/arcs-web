import Room from "./Room";

export default function App() {
  const room = new URL(window.location.toString()).searchParams.get("room")!;
  return <Room room={room.toLowerCase()} />;
}
