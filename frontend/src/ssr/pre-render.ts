import FS from 'node:fs/promises';

const template = await FS.readFile(
  new URL('../../build/index.html', import.meta.url),
  'utf-8',
);
const { render } = (await import(
  // @ts-expect-error: no type def
  '../../build-ssr/ssr-main.js'
)) as typeof import('../ssr-main');

// Has leading slash; no trailing slash
// e.g. ["/", "/about", "/404"]
const routesToPrerender = ['/catalog?course-modal=202401-30206'];

const promises = routesToPrerender.map(async (url) => {
  try {
    const appHTML = await render(url);

    const html = template
      // The HTML may contain dollar signs, which should not be special!
      .replace(/(?<=<div id="root">)(?=<\/div>)/u, () => appHTML.body);

    console.log(html);
  } catch (e) {
    console.log('Pre-render error', e, 'on path', url);
  }
});
Promise.all(promises);
