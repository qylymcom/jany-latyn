// SPDX-License-Identifier: MIT
/**
 * The Tian-Shan inscription database (corpus/tianshan, PolyForm Noncommercial):
 * loading, checking, reading the transcriptions, and counting the forms each
 * grapheme takes on the stones. This module holds no database material; it reads
 * the directory it is given. The web testbed and the scripts beside it share it.
 * Types: db.d.mts.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { rune, RUNE_NAMES, TWO_DOT } from 'jany-latyn/runes';

export const EVIDENCE = ['summary', 'record', 'page', 'publication', 'tracing'];
export const ACCESS = ['open', 'abstract', 'print', 'web'];
export const OBJECTS = ['boulder', 'rock', 'stick', 'vessel', 'statue', 'unknown'];
export const LEAD_STATUS = ['unconfirmed', 'conflicts', 'supported'];
/** What a transcription was read from. */
export const READ_FROM = ['tracing', 'photograph', 'squeeze', 'publication'];
/** Tags a source's `about` may carry besides inscription and region ids. */
const ABOUT_TAGS = ['signs', 'places', 'leads'];
/** Kyrgyzstan with a margin: coordinates outside it are a typing error. */
const BOUNDS = { south: 39.1, north: 43.4, west: 69.2, east: 80.3 };
export const ONE_DOT = '⸱';

const readJson = (dir, name) => JSON.parse(readFileSync(join(dir, 'db', name), 'utf8'));

/** Reads the database in `dir` (corpus/tianshan): the JSON tables and every transcription. */
export function loadDatabase(dir) {
  const places = readJson(dir, 'places.json');
  const tdir = join(dir, 'transcriptions');
  const transcriptions = {};
  if (existsSync(tdir)) {
    for (const f of readdirSync(tdir).sort()) {
      if (f.endsWith('.txt')) transcriptions[f.slice(0, -4)] = readFileSync(join(tdir, f), 'utf8');
    }
  }
  return {
    inscriptions: readJson(dir, 'inscriptions.json'),
    sources: readJson(dir, 'sources.json').sources,
    regions: places.regions,
    sites: places.sites,
    counts: readJson(dir, 'counts.json').counts,
    leads: readJson(dir, 'leads.json').leads,
    graphemes: readJson(dir, 'signs.json').graphemes,
    phonemes: readJson(dir, 'phonemes.json').phonemes,
    transcriptions,
  };
}

/** Glyph id → { glyph, grapheme }, and grapheme id → grapheme. */
export function signIndex(graphemes) {
  const glyphs = new Map();
  const byId = new Map();
  for (const g of graphemes) {
    byId.set(g.id, g);
    for (const gl of g.glyphs) glyphs.set(gl.id, { glyph: gl, grapheme: g });
  }
  return { glyphs, graphemes: byId };
}

/** The character a glyph is written with: its own, or the nearest one for a shape Unicode lacks. */
export const glyphChar = (glyph) => rune(glyph.unicode ?? glyph.nearest);

/**
 * Parses one transcription (format in corpus/tianshan/transcriptions/README.md).
 * Returns { meta, lines, errors }; each line has its label, its signs, and the
 * runes as Unicode text with ⁚ and ⸱ for the dividers.
 */
export function parseTranscription(text, graphemes) {
  const { glyphs, graphemes: byId } = signIndex(graphemes);
  const meta = { images: [], readFrom: null, direction: 'rtl', by: null, date: null };
  const lines = [];
  const errors = [];
  text.split('\n').forEach((raw, i) => {
    const at = `line ${i + 1}`;
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    if (line.startsWith('@')) {
      const [key, ...rest] = line.slice(1).split(/\s+/);
      const value = rest.join(' ');
      if (key === 'image') {
        const [source, ...where] = rest;
        if (!source) errors.push(`${at}: @image needs a source id`);
        else meta.images.push({ source, where: where.join(' ') });
      } else if (key === 'read-from') {
        if (!READ_FROM.includes(value)) errors.push(`${at}: @read-from must be one of ${READ_FROM.join(', ')}`);
        meta.readFrom = value;
      } else if (key === 'direction') {
        if (value !== 'rtl' && value !== 'ltr') errors.push(`${at}: @direction must be rtl or ltr`);
        meta.direction = value;
      } else if (key === 'by') meta.by = value;
      else if (key === 'date') meta.date = value;
      else errors.push(`${at}: unknown key @${key}`);
      return;
    }
    const m = line.match(/^([^:]+?)\s*:\s+(.*)$/);
    if (!m) { errors.push(`${at}: expected "<label>: <signs>"`); return; }
    const signs = [];
    let runes = '';
    for (const tok of m[2].split(/\s+/)) {
      if (tok === ':') { runes += TWO_DOT; continue; }
      if (tok === '.' || tok === '·' || tok === ONE_DOT) { runes += ONE_DOT; continue; }
      if (tok === '...' || tok === '…') { runes += '...'; continue; }
      if (tok === '_') { runes += ' '; continue; }
      const t = tok.match(/^(~?)([a-z0-9]+(?:\.\d+)?)(\??)$/);
      const hit = t && (glyphs.get(t[2]) ?? (byId.has(t[2]) ? { grapheme: byId.get(t[2]), glyph: null } : null));
      if (!hit) { errors.push(`${at}: unknown sign "${tok}"`); continue; }
      const glyph = hit.glyph ?? hit.grapheme.glyphs[0];
      const char = glyphChar(glyph);
      signs.push({
        glyph: glyph.id, grapheme: hit.grapheme.id, char,
        formKnown: hit.glyph !== null, unclear: t[3] === '?', mirrored: t[1] === '~',
      });
      runes += char;
    }
    lines.push({ label: m[1], signs, runes: runes.replace(/ *([⁚⸱]) */g, '$1').trim() });
  });
  return { meta, lines, errors };
}

/** Every transcription, parsed, by inscription id. */
export function parseAll(db) {
  const out = {};
  for (const [id, text] of Object.entries(db.transcriptions)) out[id] = parseTranscription(text, db.graphemes);
  return out;
}

/**
 * Occurrences of each glyph and grapheme over the transcribed inscriptions:
 * { glyphs: id → { signs, inscriptions }, graphemes: id → { signs, inscriptions } }.
 */
export function attestation(db, parsed = parseAll(db)) {
  const glyphs = {}, graphemes = {};
  const add = (table, key, ins) => {
    const e = (table[key] ??= { signs: 0, inscriptions: [] });
    e.signs++;
    if (!e.inscriptions.includes(ins)) e.inscriptions.push(ins);
  };
  for (const [ins, t] of Object.entries(parsed)) {
    for (const line of t.lines) {
      for (const s of line.signs) {
        add(graphemes, s.grapheme, ins);
        if (s.formKnown) add(glyphs, s.glyph, ins);
      }
    }
  }
  return { glyphs, graphemes };
}

/**
 * The attested-majority form of each engine letter (RUNES-SPEC §6, as for the
 * Yenisei stones): the Unicode character that writes it on the most inscriptions,
 * ties going to the most occurrences, then to the first glyph listed. Only signs
 * whose shape the transcription gives count. null where no inscription has it.
 * Returns { forms: engineKey → Unicode name | null, basis: engineKey → { inscriptions, signs } }.
 */
export function attestedForms(db, parsed = parseAll(db)) {
  const forms = {}, basis = {};
  const tally = {};
  const nameOf = (gl) => gl.unicode ?? gl.nearest;
  for (const [ins, t] of Object.entries(parsed)) {
    for (const line of t.lines) {
      for (const s of line.signs) {
        if (!s.formKnown) continue;
        const g = db.graphemes.find((x) => x.id === s.grapheme);
        if (!g.engineKey) continue;
        const name = nameOf(g.glyphs.find((x) => x.id === s.glyph));
        const e = ((tally[g.engineKey] ??= {})[name] ??= { inscriptions: new Set(), signs: 0 });
        e.inscriptions.add(ins);
        e.signs++;
      }
    }
  }
  for (const g of db.graphemes) {
    if (!g.engineKey || g.engineKey in forms) continue;
    const t = tally[g.engineKey] ?? {};
    const order = db.graphemes.filter((x) => x.engineKey === g.engineKey).flatMap((x) => x.glyphs.map(nameOf));
    const ranked = Object.entries(t).sort(([a, x], [b, y]) =>
      y.inscriptions.size - x.inscriptions.size || y.signs - x.signs || order.indexOf(a) - order.indexOf(b));
    forms[g.engineKey] = ranked.length ? ranked[0][0] : null;
    basis[g.engineKey] = ranked.length
      ? { inscriptions: ranked[0][1].inscriptions.size, signs: ranked[0][1].signs }
      : { inscriptions: 0, signs: 0 };
  }
  return { forms, basis };
}

/** The engine module packages/engine/src/runes/tianshanForms.ts for these forms. */
export function formsModule(db, parsed = parseAll(db)) {
  const { forms } = attestedForms(db, parsed);
  const transcribed = Object.values(parsed).filter((t) => t.lines.some((l) => l.signs.length)).length;
  const keys = Object.keys(forms);
  const body = keys.map((k) => `  '${k}': ${forms[k] === null ? 'null' : `'${forms[k]}'`},`).join('\n');
  return `// SPDX-License-Identifier: MIT
/**
 * GENERATED by corpus/scripts/tianshan/build.mjs from the Tian-Shan inscription
 * database (corpus/tianshan); do not edit. For each letter, the Unicode form the
 * transcribed inscriptions use most (RUNES-SPEC §6), or null where none of them
 * has the letter yet, in which case the Yenisei form stands in. Facts only: no
 * transcription text is copied here.
 */
import type { RuneName } from './inventory.js';

/** Inscriptions with a transcription that the forms are counted from. */
export const TIANSHAN_TRANSCRIBED = ${transcribed};

export type TianShanFormKey =
${keys.map((k) => `  | '${k}'`).join('\n')};

export const TIANSHAN_FORMS: Readonly<Record<TianShanFormKey, RuneName | null>> = Object.freeze({
${body}
});
`;
}

const inBounds = (lat, lon) =>
  typeof lat === 'number' && typeof lon === 'number' &&
  lat >= BOUNDS.south && lat <= BOUNDS.north && lon >= BOUNDS.west && lon <= BOUNDS.east;

/** Every inconsistency in the database, as messages; an empty list means it checks. */
export function checkDatabase(db) {
  const errors = [];
  const err = (m) => errors.push(m);
  const unique = (list, what) => {
    const seen = new Set();
    for (const x of list) {
      if (seen.has(x.id)) err(`${what}: duplicate id ${x.id}`);
      seen.add(x.id);
    }
    return seen;
  };
  const sources = unique(db.sources, 'sources');
  const regions = unique(db.regions, 'regions');
  const sites = unique(db.sites, 'sites');
  const inscriptions = unique(db.inscriptions.inscriptions, 'inscriptions');
  const phonemes = unique(db.phonemes, 'phonemes');
  unique(db.graphemes, 'graphemes');
  const fields = db.inscriptions.meta.fields;
  if (!EVIDENCE.includes(db.inscriptions.meta.defaultEvidence)) err('inscriptions: bad defaultEvidence');
  const cite = (where, ids) => {
    if (!Array.isArray(ids) || !ids.length) err(`${where}: no sources`);
    for (const id of ids ?? []) if (!sources.has(id)) err(`${where}: unknown source ${id}`);
  };
  const url = (where, u) => { if (u !== undefined && !/^https?:\/\/\S+$/.test(u)) err(`${where}: bad URL ${u}`); };

  for (const s of db.sources) {
    if (!ACCESS.includes(s.access) && s.type !== 'brief') err(`source ${s.id}: bad access ${s.access}`);
    if (!EVIDENCE.includes(s.consulted)) err(`source ${s.id}: bad consulted ${s.consulted}`);
    if (!s.title) err(`source ${s.id}: no title`);
    url(`source ${s.id}`, s.url);
    url(`source ${s.id}`, s.download);
    if (s.download && s.access !== 'open') err(`source ${s.id}: a download must be open access`);
    for (const a of s.about ?? []) {
      if (!inscriptions.has(a) && !regions.has(a) && !ABOUT_TAGS.includes(a)) err(`source ${s.id}: about unknown ${a}`);
    }
  }
  for (const r of db.regions) {
    cite(`region ${r.id}`, r.sources);
    if (r.area && (!inBounds(r.area.lat, r.area.lon) || !(r.area.radiusKm > 0))) err(`region ${r.id}: bad area`);
  }
  for (const s of db.sites) {
    if (!regions.has(s.region)) err(`site ${s.id}: unknown region ${s.region}`);
    cite(`site ${s.id}`, s.sources);
    if (s.coords && (!inBounds(s.coords.lat, s.coords.lon) || !(s.coords.radiusKm > 0))) err(`site ${s.id}: bad coordinates`);
    if (s.coords && !s.basis) err(`site ${s.id}: coordinates need a basis`);
  }
  for (const ins of db.inscriptions.inscriptions) {
    const w = `inscription ${ins.id}`;
    if (!ins.label || !ins.names?.en) err(`${w}: needs a label and an English name`);
    if (!regions.has(ins.region)) err(`${w}: unknown region ${ins.region}`);
    if (ins.site !== null) {
      const site = db.sites.find((s) => s.id === ins.site);
      if (!site) err(`${w}: unknown site ${ins.site}`);
      else if (site.region !== ins.region) err(`${w}: site ${ins.site} is in another region`);
    }
    if (!OBJECTS.includes(ins.object)) err(`${w}: bad object ${ins.object}`);
    if (!ins.claims?.length) err(`${w}: no claims`);
    for (const [k, c] of (ins.claims ?? []).entries()) {
      if (!fields.includes(c.field)) err(`${w}: claim ${k + 1} has unknown field ${c.field}`);
      if (typeof c.value !== 'string' || !c.value) err(`${w}: claim ${k + 1} has no value`);
      if (c.evidence !== undefined && !EVIDENCE.includes(c.evidence)) err(`${w}: claim ${k + 1} has bad evidence`);
      cite(`${w} claim ${k + 1}`, c.sources);
    }
    for (const other of ins.possiblySame ?? []) {
      const o = db.inscriptions.inscriptions.find((x) => x.id === other);
      if (!o) err(`${w}: possiblySame unknown ${other}`);
      else if (!(o.possiblySame ?? []).includes(ins.id)) err(`${w}: possiblySame ${other} is not mutual`);
    }
  }
  for (const c of db.counts) {
    if (!sources.has(c.source)) err(`count: unknown source ${c.source}`);
    if (c.via && !sources.has(c.via)) err(`count: unknown source ${c.via}`);
    for (const r of Object.keys(c.regions ?? {})) if (!regions.has(r)) err(`count ${c.source}: unknown region ${r}`);
  }
  for (const l of db.leads) {
    if (!sources.has(l.from)) err(`lead: unknown source ${l.from}`);
    if (!LEAD_STATUS.includes(l.status)) err(`lead: bad status ${l.status}`);
  }

  // Signs: every Unicode Old Turkic character is exactly one glyph.
  const names = new Set(RUNE_NAMES);
  const used = new Map();
  const keys = new Set();
  for (const g of db.graphemes) {
    for (const p of g.phonemes) if (!phonemes.has(p)) err(`grapheme ${g.id}: unknown phoneme ${p}`);
    if (g.engineKey) {
      if (keys.has(g.engineKey)) err(`grapheme ${g.id}: engineKey ${g.engineKey} used twice`);
      keys.add(g.engineKey);
    }
    g.glyphs.forEach((gl, k) => {
      if (gl.id !== `${g.id}.${k + 1}`) err(`grapheme ${g.id}: glyph ${k + 1} should be ${g.id}.${k + 1}`);
      if (gl.unicode !== null) {
        if (!names.has(gl.unicode)) err(`glyph ${gl.id}: unknown Unicode name ${gl.unicode}`);
        if (used.has(gl.unicode)) err(`glyph ${gl.id}: ${gl.unicode} is also ${used.get(gl.unicode)}`);
        used.set(gl.unicode, gl.id);
      } else if (!names.has(gl.nearest) || !gl.description) err(`glyph ${gl.id}: a variant needs nearest and description`);
    });
  }
  for (const n of RUNE_NAMES) if (!used.has(n)) err(`signs: no glyph for ${n}`);

  for (const [id, text] of Object.entries(db.transcriptions)) {
    const w = `transcription ${id}`;
    if (!inscriptions.has(id)) err(`${w}: no inscription with this id`);
    const t = parseTranscription(text, db.graphemes);
    for (const e of t.errors) err(`${w}: ${e}`);
    if (!t.meta.images.length) err(`${w}: needs at least one @image`);
    for (const im of t.meta.images) if (!sources.has(im.source)) err(`${w}: unknown source ${im.source}`);
    if (!t.meta.readFrom) err(`${w}: needs @read-from`);
    if (!t.lines.length) err(`${w}: no lines`);
  }
  return errors;
}
