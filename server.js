import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { Readable } from "stream";

// Create a stream from a text string
function textToStream(text) {
  const stream = new Readable();
  stream.push(text);
  stream.push(null); // No more data
  return stream;
}

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();
app.use(
  viteDevServer ? viteDevServer.middlewares : express.static("build/client")
);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

// Define a route to stream text

app.get("/stream-text", (req, res) => {
  const text = "This is a stream of text data. ";
  const stream = textToStream(text.repeat(100000)); // Repeat to simulate large text

  // Set headers
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  // Pipe the stream to the response
  stream.pipe(res);
});

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
