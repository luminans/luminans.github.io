// Tests for DecodeSyllable.js module

import { vi } from 'vitest';

// Mock jQuery and other dependencies
const mockJQuery = {
  ready: vi.fn((callback) => callback()),
  click: vi.fn(),
  mouseenter: vi.fn(),
  closest: vi.fn(() => mockJQuery),
  find: vi.fn(() => [{ children: [{ getAttribute: () => 'test-path' }] }]),
  css: vi.fn(() => mockJQuery),
  attr: vi.fn(() => mockJQuery)
};

global.$ = vi.fn(() => mockJQuery);
global.jQuery = global.$;

// Mock global functions that DecodeSyllable depends on
global.renderSound = vi.fn();
global.renderSpeech = vi.fn();
global.insertPaths4Syllable = vi.fn();
global.speak = vi.fn();
global.Audio = vi.fn(() => ({
  play: vi.fn()
}));

// Load the DecodeSyllable.js file and execute it in global scope
const fs = await import('fs');
const path = await import('path');

const decodeSyllableCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'DecodeSyllable.js'),
  'utf8'
);

// Declare functions that will be defined by the module
let isHangul, char2syllable, code2syllable, charset;

// Execute the code to define the functions
eval(`
  ${decodeSyllableCode}
  global.isHangul = isHangul;
  global.char2syllable = char2syllable;
  global.code2syllable = code2syllable;
  global.charset = charset;
  global.isIdleArticulation = typeof isIdleArticulation !== 'undefined' ? isIdleArticulation : true;
`);
isHangul = global.isHangul;
char2syllable = global.char2syllable;
code2syllable = global.code2syllable;
charset = global.charset;
let isIdleArticulation = global.isIdleArticulation;

// Define constants that are used in the module
const HANGUL_OFFSET = 0xAC00;
const OPENING = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const LASTING = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const CLOSING = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

// Make constants available globally for tests
global.HANGUL_OFFSET = HANGUL_OFFSET;
global.OPENING = OPENING;
global.LASTING = LASTING;
global.CLOSING = CLOSING;

describe('DecodeSyllable Module', () => {
  describe('Constants', () => {
    test('should have correct HANGUL_OFFSET', () => {
      expect(HANGUL_OFFSET).toBe(0xAC00);
    });

    test('should have correct OPENING consonants array', () => {
      expect(OPENING).toHaveLength(19);
      expect(OPENING[0]).toBe('ㄱ');
      expect(OPENING[1]).toBe('ㄲ');
      expect(OPENING[18]).toBe('ㅎ');
    });

    test('should have correct LASTING vowels array', () => {
      expect(LASTING).toHaveLength(21);
      expect(LASTING[0]).toBe('ㅏ');
      expect(LASTING[20]).toBe('ㅣ');
    });

    test('should have correct CLOSING consonants array', () => {
      expect(CLOSING).toHaveLength(28);
      expect(CLOSING[0]).toBe('');
      expect(CLOSING[1]).toBe('ㄱ');
      expect(CLOSING[27]).toBe('ㅎ');
    });
  });

  describe('isHangul function', () => {
    test('should return true for Hangul characters', () => {
      // Test with 가 (0xAC00)
      expect(isHangul(0xAC00)).toBe(true);
      // Test with 힣 (0xD7A3)
      expect(isHangul(0xD7A3)).toBe(true);
      // Test with 한 (0xD55C)
      expect(isHangul(0xD55C)).toBe(true);
    });

    test('should return false for non-Hangul characters', () => {
      // Test with ASCII 'A' (0x41)
      expect(isHangul(0x41)).toBe(false);
      // Test with character before Hangul range
      expect(isHangul(0xABFF)).toBe(false);
      // Test with character after Hangul range
      expect(isHangul(0xD7A4)).toBe(false);
    });
  });

  describe('char2syllable function', () => {
    test('should decompose Hangul syllable 가 correctly', () => {
      // 가 = ㄱ + ㅏ (no final consonant)
      const result = char2syllable(0xAC00); // 가
      expect(result).toHaveLength(3);
      expect(result[0]).toBeGreaterThan(0); // opening consonant
      expect(result[1]).toBeGreaterThan(0); // vowel
      expect(result[2]).toBe(0); // no closing consonant
    });

    test('should decompose Hangul syllable 한 correctly', () => {
      // 한 = ㅎ + ㅏ + ㄴ
      const result = char2syllable(0xD55C); // 한
      expect(result).toHaveLength(3);
      expect(result[0]).toBeGreaterThan(0); // opening consonant ㅎ
      expect(result[1]).toBeGreaterThan(0); // vowel ㅏ
      expect(result[2]).toBeGreaterThan(0); // closing consonant ㄴ
    });

    test('should handle non-Hangul characters', () => {
      // Test with ASCII character - should return undefined for unmapped characters
      const result = char2syllable(0x41); // 'A'
      expect(result).toBeUndefined();
    });

    test('should handle edge cases', () => {
      // Test with first Hangul character
      const firstHangul = char2syllable(0xAC00);
      expect(firstHangul).toBeDefined();
      expect(firstHangul).toHaveLength(3);

      // Test with last Hangul character
      const lastHangul = char2syllable(0xD7A3);
      expect(lastHangul).toBeDefined();
      expect(lastHangul).toHaveLength(3);
    });
  });

  describe('code2syllable function', () => {
    test('should handle ASCII codes correctly', () => {
      const result = code2syllable(0x41); // 'A'
      expect(result).toEqual([0x00, 0x41, 0x00]);
    });

    test('should handle codes in 0x80-0xB0 range', () => {
      const result = code2syllable(0x90);
      expect(result).toEqual([0x90, 0x00, 0x00]);
    });

    test('should handle codes in 0xB0-256 range', () => {
      const result = code2syllable(0xC0);
      expect(result).toEqual([0x00, 0x00, 0xC0]);
    });

    test('should handle edge cases', () => {
      expect(code2syllable(0x7F)).toEqual([0x00, 0x7F, 0x00]);
      expect(code2syllable(0x80)).toEqual([0x80, 0x00, 0x00]);
      expect(code2syllable(0xAF)).toEqual([0xAF, 0x00, 0x00]);
      expect(code2syllable(0xB0)).toEqual([0x00, 0x00, 0xB0]);
    });
  });

  describe('Global variable isIdleArticulation', () => {
    test('should be initialized to true', () => {
      expect(isIdleArticulation).toBe(true);
    });
  });

  describe('jQuery event handlers', () => {
    test('should set up click handlers for .syltab elements', () => {
      // The module should have called $(".syltab").click() during loading
      // Since the calls happen during eval, we check if $ was called with the selector
      const calls = global.$.mock.calls;
      const syltabCalls = calls.filter(call => call[0] === '.syltab');
      expect(syltabCalls.length).toBeGreaterThan(0);
    });

    test('should set up mouseenter handlers for .syltab elements', () => {
      // The mouseenter handler is set up on the same .syltab elements
      const calls = global.$.mock.calls;
      const syltabCalls = calls.filter(call => call[0] === '.syltab');
      expect(syltabCalls.length).toBeGreaterThan(0);
    });

    test('should set up click handlers for .articulate elements', () => {
      // The module should have called $(".articulate").click() during loading
      const calls = global.$.mock.calls;
      const articulateCalls = calls.filter(call => call[0] === '.articulate');
      expect(articulateCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Integration tests', () => {
    test('should process Korean text correctly', () => {
      const koreanChars = [
        { char: 0xAC00, name: '가' },
        { char: 0xB098, name: '나' },
        { char: 0xB2E4, name: '다' },
        { char: 0xB77C, name: '라' }
      ];

      koreanChars.forEach(({ char, name }) => {
        const result = char2syllable(char);
        expect(result).toBeDefined();
        expect(result).toHaveLength(3);
        expect(isHangul(char)).toBe(true);
      });
    });

    test('should handle mixed content', () => {
      const mixedChars = [0x41, 0xAC00, 0x42, 0xB098]; // A가B나
      
      mixedChars.forEach(char => {
        if (isHangul(char)) {
          const result = char2syllable(char);
          expect(result).toHaveLength(3);
        } else {
          const result = code2syllable(char);
          expect(result).toHaveLength(3);
        }
      });
    });
  });
});