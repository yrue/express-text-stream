import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { Readable } from "stream";

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

app.get("/test", (req, res) => {
  const text = "This is a stream of text data. ";
  res.send(text.repeat(100000));
});

// Define a route to stream text
app.get("/stream-text", (req, res) => {
  // Create a stream from a text string with a delay
  function textToSlowStream(text, delay = 1000) {
    const stream = new Readable({
      read() {},
    });

    const chunks = text.match(/.{1,20}/g); // Split text into smaller chunks

    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        stream.push(`${index}.\t${chunk}`);
        if (index === chunks.length - 1) {
          stream.push(null); // End the stream
        }
      }, delay * index);
    });

    return stream;
  }
  const text = "This is a stream of text data. ";
  const stream = textToSlowStream(text.repeat(10), 300); // Repeat to simulate large text and delay each

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
