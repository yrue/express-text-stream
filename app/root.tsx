import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { postData } from "./api-services";
import {  useState, useRef } from "react";

export default function App() {
  const [data, setData] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event) => {
    event.preventDefault()
    setData('')
    await postData({ prompt: inputRef.current.value }, (chunk: string): void => {
      setData(prev => prev + chunk)
    })
  }
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <form onSubmit={handleSubmit}>
          <label>Prompts:
            <input ref={inputRef} defaultValue={''} type="text"/>
          </label>
          <button type="submit">Submit</button>
        </form>
        <div id="response">
          <div>{data}</div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
