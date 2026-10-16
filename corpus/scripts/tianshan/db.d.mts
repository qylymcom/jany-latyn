// SPDX-License-Identifier: MIT
// Types for db.mjs, the Tian-Shan inscription database module.

export type Evidence = 'summary' | 'record' | 'page' | 'publication' | 'tracing';
export type Access = 'open' | 'abstract' | 'print' | 'web';
export type ObjectKind = 'boulder' | 'rock' | 'stick' | 'vessel' | 'statue' | 'unknown';
export type LeadStatus = 'unconfirmed' | 'conflicts' | 'supported';
export type ReadFrom = 'tracing' | 'photograph' | 'squeeze' | 'publication';
export type Names = { en: string } & Partial<Record<'ru' | 'ky' | 'tr', string>>;

export interface Claim { field: string; value: string; sources: string[]; evidence?: Evidence; note?: string }
export interface Inscription {
  id: string; label: string; names: Names; region: string; site: string | null; object: ObjectKind;
  possiblySame?: string[]; claims: Claim[];
}
export interface Source {
  id: string; type: string; title: string; authors?: string[]; year?: number; container?: string;
  volume?: string; issue?: string; pages?: string; publisher?: string; place?: string; isbn?: string; doi?: string;
  url?: string; download?: string; access?: Access; consulted: Evidence; about?: string[]; covers?: string[]; notes?: string;
}
export interface Coords { lat: number; lon: number; radiusKm: number }
export interface Region { id: string; name: Names; admin: string; area: (Coords & { basis: string }) | null; sources: string[]; summary: string }
export interface Site { id: string; region: string; name: Names; coords: Coords | null; basis?: string; sources: string[]; summary?: string }
export interface Count {
  source: string; via?: string; upTo?: number; total?: number | string;
  regions?: Record<string, number | string>; scope: string;
}
export interface Lead { claim: string; from: string; status: LeadStatus; note: string }
export interface Glyph { id: string; unicode: string | null; nearest?: string; description?: string }
export interface Grapheme {
  id: string; value: string; symbol: string; kind: 'vowel' | 'consonant' | 'syllabic' | 'ligature';
  series?: 'back' | 'front'; phonemes: string[]; engineKey?: string; glyphs: Glyph[];
}
export interface Phoneme { id: string; ipa: string; kind: 'vowel' | 'consonant'; series?: 'back' | 'front'; features: string }
export interface Database {
  inscriptions: { meta: { defaultEvidence: Evidence; fields: string[] }; inscriptions: Inscription[] };
  sources: Source[]; regions: Region[]; sites: Site[]; counts: Count[]; leads: Lead[];
  graphemes: Grapheme[]; phonemes: Phoneme[];
  /** Transcription text by inscription id. */
  transcriptions: Record<string, string>;
}

export interface Sign { glyph: string; grapheme: string; char: string; formKnown: boolean; unclear: boolean; mirrored: boolean }
export interface Line { label: string; signs: Sign[]; runes: string }
export interface TranscriptionMeta {
  images: { source: string; where: string }[]; readFrom: ReadFrom | null; direction: 'rtl' | 'ltr'; by: string | null; date: string | null;
}
export interface Transcription { meta: TranscriptionMeta; lines: Line[]; errors: string[] }
export interface Tally { signs: number; inscriptions: string[] }
export interface Attestation { glyphs: Record<string, Tally>; graphemes: Record<string, Tally> }
export interface AttestedForms {
  forms: Record<string, string | null>;
  basis: Record<string, { inscriptions: number; signs: number }>;
}

export declare const EVIDENCE: readonly Evidence[];
export declare const ACCESS: readonly Access[];
export declare const OBJECTS: readonly ObjectKind[];
export declare const LEAD_STATUS: readonly LeadStatus[];
export declare const READ_FROM: readonly ReadFrom[];
export declare const ONE_DOT: string;

export declare function loadDatabase(dir: string): Database;
export declare function signIndex(graphemes: Grapheme[]): {
  glyphs: Map<string, { glyph: Glyph; grapheme: Grapheme }>; graphemes: Map<string, Grapheme>;
};
export declare function glyphChar(glyph: Glyph): string;
export declare function parseTranscription(text: string, graphemes: Grapheme[]): Transcription;
export declare function parseAll(db: Database): Record<string, Transcription>;
export declare function attestation(db: Database, parsed?: Record<string, Transcription>): Attestation;
export declare function attestedForms(db: Database, parsed?: Record<string, Transcription>): AttestedForms;
export declare function formsModule(db: Database, parsed?: Record<string, Transcription>): string;
export declare function checkDatabase(db: Database): string[];
