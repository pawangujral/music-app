import { createServer, Model } from "miragejs";
import { dummyData } from "./dummyData";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,
    models: {
      track: Model,
      playlist: Model,
    },
    seeds(server) {
      dummyData.map((track) => server.create("track", track));
      server.create("playlist", {
        id: 1,
        title: "Saved Tracks",
        tracks: [dummyData[0].id],
      });
    },
    routes() {
      this.urlPrefix = "http://localhost:3000";
      this.namespace = "/api/v1";
      this.get("/tracks", (schema) => {
        return schema.tracks.all();
      });
      this.get("/tracks/:id", (schema, request) => {
        const id = request.params.id;
        return schema.tracks.find(id);
      });
      this.get("/playlists", (schema) => {
        return schema.playlists.all();
      });
      this.get("/playlists/:id", (schema, request) => {
        const id = request.params.id;
        return schema.playlists.find(id);
      });
      this.post("/playlists", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.playlists.create(attrs);
      });
      this.delete("/playlists/:id", (schema, request) => {
        const id = request.params.id;
        return schema.playlists.find(id).destroy();
      });
      this.patch("/playlists/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        console.log("hello");
        console.log(id, attrs);
        return schema.playlists.find(id).update(attrs);
      });
    },
  });
  return server;
}
