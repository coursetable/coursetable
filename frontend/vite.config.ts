import dns from 'node:dns';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import mdx from '@mdx-js/rollup';
import basicSsl from '@vitejs/plugin-basic-ssl';
import reactPlugin from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import type { Heading, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

dns.setDefaultResultOrder('verbatim');

// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-utils/src/markdownUtils.ts
// Note! Heading IDs use the syntax `## heading (#id)` instead of the usually
// `{#id}` because the latter is JSX expression syntax. Docusaurus works around
// this by using a escaping preprocessor, but we don't have our own Vite plugin
// to do the same
function parseMarkdownHeadingId(heading: string): {
  /**
   * The heading content sans the ID part, right-trimmed. e.g. `## Some heading`
   */
  text: string;
  /** The heading ID. e.g. `some-heading` */
  id: string | undefined;
} {
  // eslint-disable-next-line regexp/no-super-linear-move
  const customHeadingIdRegex = /\s*\(#(?<id>(?:.(?!\{#|\}))*.)\)$/u;
  const matches = customHeadingIdRegex.exec(heading);
  if (matches) {
    return {
      text: heading.replace(matches[0], ''),
      id: matches.groups!.id,
    };
  }
  return { text: heading, id: undefined };
}

// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-mdx-loader/src/remark/headings/index.ts
function remarkPluginAddHeadingId(): Transformer {
  return (root) => {
    visit(root, 'heading', (headingNode: Heading) => {
      // eslint-disable-next-line no-multi-assign
      const data = (headingNode.data ??= {});
      const properties = (data.hProperties ??= {}) as {
        id?: string;
      };
      if (properties.id) return;

      const headingTextNodes = headingNode.children.filter(
        ({ type }) => !['html', 'jsx'].includes(type),
      );
      const heading = toString(
        headingTextNodes.length > 0 ? headingTextNodes : headingNode,
      );

      // Support explicit heading IDs
      const { id: parsedId, text: parsedText } =
        parseMarkdownHeadingId(heading);

      if (!parsedId) return;
      // When there's an id, it is always in the last child node
      // Sometimes heading is in multiple "parts" (** syntax creates a child
      // node):
      // ## part1 *part2* part3 (#id)
      const lastNode = headingNode.children[
        headingNode.children.length - 1
      ] as Text;

      if (headingNode.children.length > 1) {
        const lastNodeText = parseMarkdownHeadingId(lastNode.value).text;
        // When last part contains test+id, remove the id
        if (lastNodeText) lastNode.value = lastNodeText;
        // When last part contains only the id: completely remove that node
        else headingNode.children.pop();
      } else {
        lastNode.value = parsedText;
      }
      properties.id = parsedId;
    });
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkPluginAddHeadingId],
        providerImportSource: '@mdx-js/react',
      }),
    },
    reactPlugin(),
    createHtmlPlugin({
      inject: dotenv.config().parsed,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        // This is the only config we changed, but this plugin doesn't support
        // partial config overrides...
        // We need to keep the recruiting notice in the HTML
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
      },
    }),
    basicSsl(),
    visualizer({
      filename: 'build/bundle-map.html',
    }),
    process.env.NODE_ENV === 'production' &&
      sentryVitePlugin({
        org: 'coursetable',
        project: 'frontend',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      manifest: {
        name: 'CourseTable',
        short_name: 'CourseTable',
        start_url: '/',
        icons: [
          {
            src: 'icon250x250.png',
            sizes: '250x250',
            purpose: 'any',
          },
          {
            src: 'maskable_icon_x48.png',
            sizes: '250x250',
            purpose: 'maskable',
          },
          {
            src: 'maskable_icon_x72.png',
            sizes: '250x250',
            purpose: 'maskable',
          },
          {
            src: 'maskable_icon_x96.png',
            sizes: '250x250',
            purpose: 'maskable',
          },
          {
            src: 'maskable_icon_x128.png',
            sizes: '250x250',
            purpose: 'maskable',
          },
          {
            src: 'maskable_icon_x192.png',
            sizes: '250x250',
            purpose: 'maskable',
          },
        ],
        display: 'standalone',
        theme_color: '#ffffff',
      },
    }),
  ],
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash:10][extname]',
        chunkFileNames(chunkInfo) {
          // Our best attempt at avoiding chunks called `index`. Avoids chunk
          // name collision and messes with build size calc.
          // Fixable by https://github.com/rollup/rollup/issues/4858
          if (chunkInfo.name === 'index') {
            if (chunkInfo.facadeModuleId?.includes('gapi-script'))
              return 'assets/gapi-script-[hash:10].js';
          }
          return 'assets/[name]-[hash:10].js';
        },
        // Prevent collision with chunk name and mess with build size calc
        entryFileNames: 'assets/entry-[name]-[hash:10].js',
      },
    },
    sourcemap: process.env.NODE_ENV === 'production',
  },
  server: {
    // Only used in dev
    // Note: in the build-size action we build without doppler, so this must be
    // runnable without env, but it's unused anyway
    port: process.env.FRONTEND_ENDPOINT
      ? Number(new URL(process.env.FRONTEND_ENDPOINT).port || 3000)
      : 3000,
  },
});
