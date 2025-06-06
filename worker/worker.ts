import { AutoRouter, cors, error, IRequest } from "itty-router";
import { Environment } from "./types";

// make sure our sync durable object is made available to cloudflare
export { TldrawDurableObject } from "./TldrawDurableObject";

// we use itty-router (https://itty.dev/) to handle routing. in this example we turn on CORS because
// we're hosting the worker separately to the client. you should restrict this to your own domain.
const { preflight, corsify } = cors({ origin: "*" });
const router = AutoRouter<IRequest, [env: Environment, ctx: ExecutionContext]>({
  before: [preflight],
  finally: [corsify],
  catch: (e) => {
    console.error(e);
    return error(e);
  },
})
  // requests to /connect are routed to the Durable Object, and handle realtime websocket syncing
  .get("/connect/:roomId", (request, env) => {
    const id = env.TLDRAW_DURABLE_OBJECT.idFromName(request.params.roomId);
    const room = env.TLDRAW_DURABLE_OBJECT.get(id);
    return room.fetch(request.url, {
      headers: request.headers,
      body: request.body,
    });
  });

// export our router for cloudflare
export default router;
