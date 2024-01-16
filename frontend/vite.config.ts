/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import dotenv from 'dotenv';
import dns from 'dns';
import type { Transformer } from 'unified';
import type { Heading, Text } from 'mdast';

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
    createHtmlPlugin({ inject: dotenv.config().parsed }),
    basicSsl(),
    visualizer({
      filename: 'build/bundle-map.html',
    }),
  ],
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash:10][extname]',
        chunkFileNames(chunkInfo) {
          if (chunkInfo.facadeModuleId?.includes('gapi-script'))
            // Prevent emitting two index-abcd.js files, which messes with build
            // size calculation
            return 'assets/gapi-script-[hash:10].js';
          return 'assets/[name]-[hash:10].js';
        },
        entryFileNames: 'assets/[name]-[hash:10].js',
      },
    },
    cssCodeSplit: false,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
