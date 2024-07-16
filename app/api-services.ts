const apiUrl = 'http://localhost:3000/stream-text';
// const apiKey = 'your-openai-api-key'; // Replace with your OpenAI API key

export async function fetchStream(callback): Promise<void> {
  try {
    const response = await fetch(apiUrl);

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value, { stream: true });
      callback(chunk)
    }

    console.log('Stream ended');
  } catch (error) {
    console.error('Error receiving stream:', error);
  }
}