import { describe, it, expect } from 'vitest';
import { ASSISTANT_NAME, TRIGGER_PATTERN, escapeRegex } from './config.js';

describe('escapeRegex', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegex('Andy+')).toBe('Andy\\+');
    expect(escapeRegex('Andy.')).toBe('Andy\\.');
    expect(escapeRegex('Andy*')).toBe('Andy\\*');
    expect(escapeRegex('Andy?')).toBe('Andy\\?');
    expect(escapeRegex('Andy^')).toBe('Andy\\^');
    expect(escapeRegex('Andy$')).toBe('Andy\\$');
    expect(escapeRegex('Andy{')).toBe('Andy\\{');
    expect(escapeRegex('Andy}')).toBe('Andy\\}');
    expect(escapeRegex('Andy(')).toBe('Andy\\(');
    expect(escapeRegex('Andy)')).toBe('Andy\\)');
    expect(escapeRegex('Andy|')).toBe('Andy\\|');
    expect(escapeRegex('Andy[')).toBe('Andy\\[');
    expect(escapeRegex('Andy]')).toBe('Andy\\]');
    expect(escapeRegex('Andy\\')).toBe('Andy\\\\');
  });

  it('does not escape normal characters', () => {
    expect(escapeRegex('Andy123')).toBe('Andy123');
    expect(escapeRegex('Andy-Space')).toBe('Andy-Space');
  });

  it('handles empty string', () => {
    expect(escapeRegex('')).toBe('');
  });
});

describe('TRIGGER_PATTERN', () => {
  it('matches @ASSISTANT_NAME at start of message', () => {
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME} hello`)).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME.toLowerCase()} hello`)).toBe(true);
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME.toUpperCase()} hello`)).toBe(true);
  });

  it('does not match when not at start of message', () => {
    expect(TRIGGER_PATTERN.test(`hello @${ASSISTANT_NAME}`)).toBe(false);
  });

  it('does not match partial name (word boundary)', () => {
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME}Suffix hello`)).toBe(false);
  });

  it('matches with word boundary before apostrophe', () => {
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME}'s thing`)).toBe(true);
  });

  it('matches alone (end of string is a word boundary)', () => {
    expect(TRIGGER_PATTERN.test(`@${ASSISTANT_NAME}`)).toBe(true);
  });

  it('is constructed correctly with escaped name', () => {
    const escapedName = escapeRegex(ASSISTANT_NAME);
    // Use .source to check the regex pattern itself
    // Note: TRIGGER_PATTERN is /^@Andy\b/i
    expect(TRIGGER_PATTERN.source).toBe(`^@${escapedName}\\b`);
    expect(TRIGGER_PATTERN.flags).toContain('i');
  });
});
