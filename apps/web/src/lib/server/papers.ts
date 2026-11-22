// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The documents under /papers/. Each is a markdown file in docs/ (CC BY 4.0), read
// and rendered at build time; every page is prerendered.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer, type Tokens, type TokenizerAndRendererExtension } from 'marked';

interface PaperSource {
  slug: string;
  file: string;
  // Bare `[12]` in the text cites the 12th item of the numbered list under
  // "## References". The whitepaper writes its citations as links instead.
  numberedReferences?: boolean;
}

// Listed in the order the papers index shows them.
const PAPERS: readonly PaperSource[] = [
  { slug: 'jany-latyn', file: 'WHITEPAPER.md' },
  { slug: 'making-of-the-kyrgyz', file: 'MAKING-OF-THE-KYRGYZ.md', numberedReferences: true }
];

export const PAPER_SLUGS: readonly string[] = PAPERS.map((p) => p.slug);

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export interface PaperMeta {
  slug: string;
  title: string;
  // Inline HTML, from the bold line under the title.
  subtitle: string;
  author: string;
  date: string;
  // Inline HTML of the first paragraph under "## Abstract".
  abstract: string;
  // Plain text, for <meta name="description">.
  description: string;
}

export interface Paper {
  meta: PaperMeta;
  html: string;
  toc: TocItem[];
}

function findDoc(file: string): string {
  const searchStarts = [process.cwd(), fileURLToPath(new URL('.', import.meta.url))];
  for (const start of searchStarts) {
    let curr = start;
    for (let i = 0; i < 8; i++) {
      const candidate = join(curr, 'docs', file);
      if (existsSync(candidate)) return candidate;
      const parent = resolve(curr, '..');
      if (parent === curr) break;
      curr = parent;
    }
  }
  throw new Error(`docs/${file} not found in workspace hierarchy`);
}

// Anchors must stay stable: the whitepaper's own table of contents, and links
// people have shared, point at them.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
    .replace(/\s/g, '-');
}

const ENTITIES: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};

function htmlToText(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inline TeX as the book uses it: sample sizes and F-statistics ($n = 52$,
// $F_{ST} = 0.2\%$). Letters are set as italic variables, subscripts as <sub>.
function texToHtml(tex: string): string {
  return escapeHtml(tex.replace(/\\([%$&#_])/g, '$1'))
    .replace(/_\{([^}]*)\}|_(\w)/g, (_m, group, single) => `\u0001${group ?? single}\u0002`)
    .replace(/(?<![A-Za-z\u0001])([A-Za-z])(?![A-Za-z])/g, '<i>$1</i>')
    .replace(/\u0001/g, '<sub>')
    .replace(/\u0002/g, '</sub>');
}

const inlineMath: TokenizerAndRendererExtension = {
  name: 'inlineMath',
  level: 'inline',
  start(src) {
    const at = src.indexOf('$');
    return at < 0 ? undefined : at;
  },
  tokenizer(src) {
    const match = /^\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/.exec(src);
    if (match) return { type: 'inlineMath', raw: match[0], tex: match[1] };
    return undefined;
  },
  renderer(token) {
    return `<span class="math">${texToHtml(token.tex as string)}</span>`;
  }
};

const numberedCitation: TokenizerAndRendererExtension = {
  name: 'numberedCitation',
  level: 'inline',
  start(src) {
    return src.match(/\[\d/)?.index;
  },
  tokenizer(src) {
    // Inside link text the citation would nest one <a> in another.
    if (this.lexer.state.inLink) return undefined;
    const match = /^\[(\d{1,3})\](?![(:[])/.exec(src);
    if (match) return { type: 'numberedCitation', raw: match[0], n: Number(match[1]) };
    return undefined;
  },
  renderer(token) {
    return `<a href="#ref${token.n}" class="citation">[${token.n}]</a>`;
  }
};

const HEADING_CLASS: Readonly<Record<number, string>> = {
  1: 'text-2xl sm:text-3xl md:text-4xl mt-6 mb-4 text-base-content border-b border-base-300 pb-3',
  2: 'text-xl sm:text-2xl mt-10 mb-3 text-base-content border-b border-base-content/10 pb-2',
  3: 'text-lg sm:text-xl mt-6 mb-2 text-base-content/90',
  4: 'text-base sm:text-lg mt-5 mb-2 text-base-content/90'
};

// Lines such as "**Version:** 2026.4" directly under the title.
const FIELD_LINE = /^\*\*([^*]+?):\*\*\s*(.*)$/;

function createMarked(source: PaperSource): { marked: Marked; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const marked = new Marked({
    extensions: source.numberedReferences ? [inlineMath, numberedCitation] : [inlineMath]
  });
  let section = '';

  const renderer = new Renderer();

  renderer.heading = function ({ text, depth, tokens }: Tokens.Heading) {
    const inner = this.parser.parseInline(tokens);
    const plainText = htmlToText(inner);
    const id = slugify(text.replace(/<[^>]*>/g, ''));
    if (depth === 2) section = plainText;
    if (depth === 2 || depth === 3) toc.push({ level: depth, text: plainText, id });
    const cls = HEADING_CLASS[depth] ?? 'text-base mt-4 mb-1 text-base-content/80';
    return `<h${depth} id="${id}" class="scroll-mt-24 font-bold ${cls}"><a href="#${id}" class="hover:underline text-inherit">${inner}</a></h${depth}>`;
  };

  // The front matter: a paragraph made only of "**Field:** value" lines becomes a
  // definition list, one field per row, instead of running together as one line.
  renderer.paragraph = function (token: Tokens.Paragraph) {
    const lines = token.text.split('\n');
    if (lines.length >= 2 && lines.every((l) => FIELD_LINE.test(l))) {
      const rows = lines.map((l) => {
        const [, label, value] = FIELD_LINE.exec(l)!;
        return `<dt class="font-semibold">${escapeHtml(label)}</dt><dd>${marked.parseInline(value) as string}</dd>`;
      });
      return `<dl class="paper-fields">${rows.join('')}</dl>\n`;
    }
    return Renderer.prototype.paragraph.call(this, token);
  };

  renderer.table = function (token: Tokens.Table) {
    const defaultTable = Renderer.prototype.table.call(this, token);
    return `<div class="overflow-x-auto my-5 rounded-lg border border-base-300 shadow-xs">${defaultTable.replace(
      '<table>',
      '<table class="table table-zebra table-sm sm:table-md w-full bg-base-100">'
    )}</div>`;
  };

  renderer.blockquote = function (token: Tokens.Blockquote) {
    const body = this.parser.parse(token.tokens);
    return `<blockquote class="border-l-4 border-primary/60 bg-primary/5 pl-4 pr-3 py-2.5 my-4 italic rounded-r-lg text-base-content/90">${body}</blockquote>`;
  };

  if (source.numberedReferences) {
    renderer.list = function (token: Tokens.List) {
      const html = Renderer.prototype.list.call(this, token);
      if (!token.ordered || section !== 'References') return html;
      let n = token.start === '' ? 1 : token.start;
      return html.replace(/<li>/g, () => `<li id="ref${n++}" class="scroll-mt-24">`);
    };
  }

  marked.use({ renderer });
  return { marked, toc };
}

function sourceFor(slug: string): PaperSource | undefined {
  return PAPERS.find((p) => p.slug === slug);
}

function readMeta(source: PaperSource, markdown: string, marked: Marked): PaperMeta {
  const lines = markdown.split('\n');
  const titleAt = lines.findIndex((l) => l.startsWith('# '));
  const title = lines[titleAt].slice(2).trim();

  const head: string[] = [];
  for (const line of lines.slice(titleAt + 1)) {
    if (line.trim() === '---') break;
    head.push(line.trim());
  }
  const subtitleLine = head.find((l) => /^\*\*.+\*\*$/.test(l) && !FIELD_LINE.test(l)) ?? '';
  const fields = new Map(
    head.flatMap((l) => {
      const m = FIELD_LINE.exec(l);
      return m ? [[m[1].toLowerCase(), m[2]] as const] : [];
    })
  );

  const abstractAt = lines.findIndex((l) => /^##\s+Abstract\s*$/.test(l));
  const abstractLines: string[] = [];
  if (abstractAt >= 0) {
    for (const line of lines.slice(abstractAt + 1)) {
      if (line.trim() === '---' || line.startsWith('#')) break;
      if (line.trim() === '' && abstractLines.length > 0) break;
      if (line.trim() !== '') abstractLines.push(line.trim());
    }
  }

  const subtitle = marked.parseInline(subtitleLine.replace(/^\*\*|\*\*$/g, '')) as string;
  return {
    slug: source.slug,
    title,
    subtitle,
    author: (fields.get('author') ?? '').split(' · ')[0],
    date: fields.get('date') ?? '',
    abstract: marked.parseInline(abstractLines.join(' ')) as string,
    description: `${title}. ${htmlToText(subtitle)}`
  };
}

async function readSource(source: PaperSource): Promise<string> {
  return readFile(findDoc(source.file), 'utf-8');
}

export async function loadPaper(slug: string): Promise<Paper | undefined> {
  const source = sourceFor(slug);
  if (!source) return undefined;
  const markdown = await readSource(source);
  const { marked, toc } = createMarked(source);
  const html = (await marked.parse(markdown)) as string;
  return { meta: readMeta(source, markdown, marked), html, toc };
}

export async function loadPaperIndex(): Promise<PaperMeta[]> {
  return Promise.all(
    PAPERS.map(async (source) => readMeta(source, await readSource(source), createMarked(source).marked))
  );
}
