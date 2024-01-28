import React from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Globals from './Globals';
import App from './App';

async function fetchStream(stream: ReadableStream) {
  const reader = stream.getReader();

  let res = '';
  await reader.read().then(async function processText({
    done,
    value,
  }): Promise<void> {
    if (done) return;
    res += new TextDecoder().decode(value);
    const nextChunk = await reader.read();
    await processText(nextChunk);
  });
  return res;
}

export async function render(url: string): Promise<{ body: string }> {
  const app = (
    <Globals>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Globals>
  );
  const stream = await renderToReadableStream(app);
  const body = await fetchStream(stream);
  return { body };
}
