// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked, type Tokens } from 'marked';
import type { PageServerLoad } from './$types';

export const prerender = true;

function findWhitepaper(): string {
  const searchStarts = [process.cwd(), fileURLToPath(new URL('.', import.meta.url))];
  for (const start of searchStarts) {
    let curr = start;
    for (let i = 0; i < 6; i++) {
      const candidate = join(curr, 'docs', 'WHITEPAPER.md');
      if (existsSync(candidate)) return candidate;
      const parent = resolve(curr, '..');
      if (parent === curr) break;
      curr = parent;
    }
  }
  throw new Error('docs/WHITEPAPER.md not found in workspace hierarchy');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
    .replace(/\s/g, '-');
}

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export const load: PageServerLoad = async () => {
  const filePath = findWhitepaper();
  const markdown = await readFile(filePath, 'utf-8');

  const toc: TocItem[] = [];
  const renderer = new marked.Renderer();

  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const id = slugify(plainText);

    if (depth === 2 || depth === 3) {
      toc.push({ level: depth, text: plainText, id });
    }

    return `<h${depth} id="${id}" class="scroll-mt-24 font-bold ${
      depth === 1
        ? 'text-2xl sm:text-3xl md:text-4xl mt-6 mb-4 text-base-content border-b border-base-300 pb-3'
        : depth === 2
          ? 'text-xl sm:text-2xl mt-10 mb-3 text-base-content border-b border-base-content/10 pb-2'
          : 'text-lg sm:text-xl mt-6 mb-2 text-base-content/90'
    }"><a href="#${id}" class="hover:underline text-inherit">${text}</a></h${depth}>`;
  };

  renderer.table = (token: Tokens.Table) => {
    const defaultTable = marked.Renderer.prototype.table.call(renderer, token);
    return `<div class="overflow-x-auto my-5 rounded-lg border border-base-300 shadow-xs">${defaultTable.replace(
      '<table>',
      '<table class="table table-zebra table-sm sm:table-md w-full bg-base-100">'
    )}</div>`;
  };

  renderer.blockquote = (token: Tokens.Blockquote) => {
    const body = renderer.parser.parse(token.tokens);
    return `<blockquote class="border-l-4 border-primary/60 bg-primary/5 pl-4 pr-3 py-2.5 my-4 italic rounded-r-lg text-base-content/90">${body}</blockquote>`;
  };

  const html = await marked.parse(markdown, { renderer });

  return {
    html,
    toc
  };
};
