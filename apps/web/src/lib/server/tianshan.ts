// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The Tian-Shan inscription database (corpus/tianshan), read once at build time for
// the prerendered /runic/tianshan/ pages: every table, each transcription with the
// reader's output per line, and the attestation counts.
import { dirname } from 'node:path';
import { readInscription } from 'jany-latyn/runes';
import {
  loadDatabase, checkDatabase, parseAll, attestation, attestedForms,
  type Line, type TranscriptionMeta,
} from '$corpus/scripts/tianshan/db.mjs';
import { findRepoFile } from './markdown';

export interface ReadLine extends Line { reader: string }

function build() {
  const dir = dirname(dirname(findRepoFile('corpus/tianshan/db/inscriptions.json')));
  const db = loadDatabase(dir);
  const errors = checkDatabase(db);
  if (errors.length) throw new Error(`corpus/tianshan does not check:\n${errors.join('\n')}`);
  const parsed = parseAll(db);
  const { transcriptions: _text, inscriptions, ...tables } = db;
  const transcribed: Record<string, { meta: TranscriptionMeta; lines: ReadLine[] }> = Object.fromEntries(
    Object.entries(parsed).map(([id, t]) => [id, { meta: t.meta, lines: t.lines.map((l) => ({ ...l, reader: readInscription(l.runes) })) }]),
  );
  return {
    ...tables,
    inscriptions: inscriptions.inscriptions,
    defaultEvidence: inscriptions.meta.defaultEvidence,
    fields: inscriptions.meta.fields,
    transcribed,
    attestation: attestation(db, parsed),
    forms: attestedForms(db, parsed),
  };
}

export type TianShanData = ReturnType<typeof build>;

let cached: TianShanData | null = null;

/** The database, checked; a build fails rather than publish a database that does not check. */
export function tianshanData(): TianShanData {
  return (cached ??= build());
}
