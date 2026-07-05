/**
 * Standard Overstreet alpha-to-numeric grade mapping dictionary.
 */
const ALPHA_GRADE_MAP: Record<string, number> = {
  'GM': 10.0, 'M': 9.9, 'NM/M': 9.8, 'NM+': 9.6, 'NM': 9.4, 'NM-': 9.2,
  'VF/NM': 9.0, 'VF+': 8.5, 'VF': 8.0, 'VF-': 7.5, 'FN/VF': 7.0,
  'FN+': 6.5, 'FN': 6.0, 'FN-': 5.5, 'VG/FN': 5.0, 'VG+': 4.5,
  'VG': 4.0, 'VG-': 3.5, 'G/VG': 3.0, 'G': 2.5, 'G-': 2.0,
  'FA/G': 1.8, 'FA': 1.5, 'PR/FA': 1.0, 'PR': 0.5
};

/**
 * Normalizes an unstructured vintage grade string into a safe numeric value.
 * Handles split grades (takes max), alpha scales, and common legacy ledger notations.
 * * @param rawGrade - The uncleaned string representation of the grade (e.g., "Now: CGC 8.5", "VF-", "9.2/ 9.6")
 * @returns A safe number matching the 0.5 - 10.0 scale, or null if unparseable/missing ("X")
 */
export function parseLegacyGrade(rawGrade: string | undefined | null): number | null {
  if (!rawGrade) return null;

  // 1. Sanitize input: clean whitespaces, uppercase it, extract wrapped parentheses like (MP) or (SP)
  let clean = rawGrade.trim().toUpperCase().replace(/\s*\([^)]*\)/g, '');

  // 2. Strip standard contextual prefix notes like "NOW: CGC " or "NOW: "
  clean = clean.replace(/^NOW:\s*(CGC\s*)?/, '');

  if (clean === 'X' || clean === '') return null;

  // 3. Handle split grades or multi-grade listings (e.g., "9.0/ 9.2/ 9.4" or "9.4/9.4")
  if (clean.includes('/')) {
    const parts = clean.split('/').map(p => parseLegacyGrade(p.trim())).filter((g): g is number => g !== null);
    return parts.length > 0 ? Math.max(...parts) : null;
  }

  // 4. Try parsing directly as a float (e.g., "9.4")
  const numericParsed = parseFloat(clean);
  if (!isNaN(numericParsed) && numericParsed >= 0.5 && numericParsed <= 10.0) {
    return numericParsed;
  }

  // 5. Fallback to Alpha Map lookups (e.g., "VF-")
  return ALPHA_GRADE_MAP[clean] ?? null;
}
