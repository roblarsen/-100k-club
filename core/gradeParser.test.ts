import { describe, it, expect } from 'vitest';
import { parseLegacyGrade } from './grade-parser';

describe('parseLegacyGrade Engine Verification', () => {
  it('should parse valid explicit strings matching standard floats', () => {
    expect(parseLegacyGrade('9.4')).toBe(9.4);
    expect(parseLegacyGrade('6.5')).toBe(6.5);
  });

  it('should resolve standard alpha descriptors to canonical metrics', () => {
    expect(parseLegacyGrade('VF-')).toBe(7.5);
    expect(parseLegacyGrade('FN+')).toBe(6.5);
    expect(parseLegacyGrade('NM/M')).toBe(9.8);
  });

  it('should parse highest candidate out of nested split values', () => {
    expect(parseLegacyGrade('9.0/ 9.2/ 9.4')).toBe(9.4);
    expect(parseLegacyGrade('9.6/9.8')).toBe(9.8);
    expect(parseLegacyGrade('9.4/9.4')).toBe(9.4);
  });

  it('should successfully strip legacy prefixes and provenance annotations', () => {
    expect(parseLegacyGrade('Now: CGC 8.5')).toBe(8.5);
    expect(parseLegacyGrade('7.0 (MP)')).toBe(7.0);
    expect(parseLegacyGrade('9.0 (SP)')).toBe(9.0);
  });

  it('should safely render invalid parameters or placeholder characters as null', () => {
    expect(parseLegacyGrade('X')).toBeNull();
    expect(parseLegacyGrade('')).toBeNull();
    expect(parseLegacyGrade(null)).toBeNull();
  });
});
