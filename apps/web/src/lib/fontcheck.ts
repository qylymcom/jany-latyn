// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Fail-open coverage probe: returns true unless the Font Loading API
// confidently says this family cannot render the special letters.
export function fontCovers(family: string, test = 'öüíŋçşÖÜÍŊÇŞä'): boolean {
  if (typeof document === 'undefined' || !document.fonts?.check) return true;
  try {
    return document.fonts.check(`16px "${family}"`, test);
  } catch {
    return true;
  }
}

export function getProbeForVowelMode(mode?: string): string {
  if (mode === 'cyrillic-u') return 'өұӨҰíÍŋŊçşÇŞä';
  if (mode === 'hybrid') return 'өüӨÜíÍŋŊçşÇŞä';
  if (mode === 'draft-macron') return 'өūӨŪíÍŋŊçşÇŞä';
  return 'öüíŋçşÖÜÍŊÇŞä'; // Jany-Latyn default
}

