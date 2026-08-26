import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { createServer } from 'vite';

import { applyPageMeta } from './src/seo/applyPageMeta';
import { type PublicPage, PUBLIC_PAGES } from './src/seo/publicPages';

const injectAppHtml = (template: string, appHtml: string): string => {
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('Prerender: built index.html is missing an empty #root');
  }

  return template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
};

const assertPageContent = (page: PublicPage, appHtml: string): void => {
  const requiredSnippets: Record<string, string> = {
    '/': 'Вивчай німецьку',
    '/courses': 'Обери свій шлях',
    '/privacy': 'Політика конфіденційності',
    '/terms': 'Умови використання',
    '/cookies': 'Політика використання файлів Cookie',
  };

  const snippet = requiredSnippets[page.path];
  if (snippet && !appHtml.includes(snippet)) {
    throw new Error(`Prerender of ${page.path} is missing expected copy: "${snippet}"`);
  }
};

export const prerenderPublicPages = (): Plugin => {
  let outDir = '';
  let root = '';

  return {
    name: 'prerender-public-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      if (process.env.VITEST || process.env.BUERO_PRERENDER_RUNNING === '1') {
        return;
      }

      process.env.BUERO_PRERENDER_RUNNING = '1';

      const templatePath = path.join(outDir, 'index.html');
      const template = fs.readFileSync(templatePath, 'utf8');

      let server: ViteDevServer | undefined;
      try {
        server = await createServer({
          root,
          server: { middlewareMode: true, hmr: false },
          appType: 'custom',
          mode: 'production',
          optimizeDeps: { noDiscovery: true },
        });

        const { renderPath } = (await server.ssrLoadModule('/src/prerender/render.tsx')) as {
          renderPath: (url: string) => Promise<string>;
        };

        for (const page of PUBLIC_PAGES) {
          const appHtml = await renderPath(page.path);
          assertPageContent(page, appHtml);

          const html = applyPageMeta(injectAppHtml(template, appHtml), page);
          const target = path.join(outDir, page.file);
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, html);
          console.info(`[prerender] ${page.path} → ${page.file}`);
        }
      } finally {
        await server?.close();
      }
    },
  };
};
