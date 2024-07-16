import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { fetchStream} from "./api-services";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const initialLoadRef = useRef(false);
  const [data, setData] = useState('');

  useEffect(() => {
    if (initialLoadRef.current) return

    initialLoadRef.current = true;
    (async function () {
      await fetchStream((chunk: string): void => {
        setData(prev => prev + chunk)
      })
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
