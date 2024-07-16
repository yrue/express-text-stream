const apiUrl = "http://localhost:3000/stream-text";
// const apiKey = 'your-openai-api-key'; // Replace with your OpenAI API key

interface PostData {
  prompt: string;
}
export async function submitPrompt(
  data: PostData,
  callback: { (chunk: string): void; (arg0: string): void }
): Promise<any> {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "CustomHeaderValue",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    if (!response.body) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value, { stream: true });
      callback(chunk);
    }

    console.log("Stream ended");
  } catch (error) {
    console.error("Error receiving stream:", error);
  }
}
