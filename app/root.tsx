import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { postData } from "./api-services";
import {  useState } from "react";

export default function App() {
  const [data, setData] = useState('');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <>
          <button onClick={async () => {
            await postData({ prompt: 'whatever prompt' }, (chunk: string): void => {
              setData(prev => prev + chunk)
            })
          }}>Submit</button>
        </>
        <div id="response">
          <div>{data}</div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
