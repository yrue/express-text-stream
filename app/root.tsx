import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { fetchStream} from "./api-services";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState('');
  useEffect(() => {
    (async function () {
      await fetchStream(setData)
    })()
  }, [])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="response">
          <div>{data}</div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
