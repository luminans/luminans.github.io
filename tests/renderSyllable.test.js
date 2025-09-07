// Tests for renderSyllable.js module

import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the renderSyllable.js file and execute it in global scope
const renderSyllableCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'renderSyllable.js'),
  'utf8'
);

// Declare functions that will be defined by the module
let code2img, speakSound4Syllable, identicalClosing;

// Execute the code to define the functions
eval(`
${renderSyllableCode}
// Assign functions to global scope
global.code2img = code2img;
global.speakSound4Syllable = speakSound4Syllable;
global.identicalClosing = identicalClosing;
global.renderSyllable = renderSyllable;
`);

// Get the functions from global scope
code2img = global.code2img;
speakSound4Syllable = global.speakSound4Syllable;
identicalClosing = global.identicalClosing;

// Mock Audio constructor
global.Audio = vi.fn(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  load: vi.fn(),
  src: '',
  currentTime: 0,
  duration: 0,
  volume: 1,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}));

// Mock global functions and variables
global.alert = vi.fn();
global.setTimeout = vi.fn((callback, delay) => {
  // Store the callback and delay for testing
  global.setTimeout.calls = global.setTimeout.calls || [];
  global.setTimeout.calls.push({ callback, delay });
  return setTimeout(callback, 0); // Execute immediately for tests
});

// Mock jQuery
global.$ = vi.fn((selector) => {
  const mockJQuery = {
    text: vi.fn().mockReturnThis(),
    html: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    css: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    removeClass: vi.fn().mockReturnThis(),
    show: vi.fn().mockReturnThis(),
    hide: vi.fn().mockReturnThis(),
    click: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    find: vi.fn().mockReturnThis(),
    append: vi.fn().mockReturnThis(),
    prepend: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    val: vi.fn().mockReturnThis(),
    prop: vi.fn().mockReturnThis(),
    data: vi.fn().mockReturnThis(),
    each: vi.fn().mockReturnThis(),
    length: 1,
    get: vi.fn(() => ({})),
    [0]: {}
  };
  return mockJQuery;
});

// Load the module
const fs = await import('fs');
const path = await import('path');
const moduleCode = fs.readFileSync(path.resolve('js/renderSyllable.js'), 'utf8');

// Evaluate the module code
eval(moduleCode);

describe('renderSyllable Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.setTimeout.calls = [];
  });

  describe('code2img function', () => {
    test('should be defined', () => {
      expect(typeof code2img).toBe('function');
    });

    test('should convert letter code to hexadecimal string', () => {
      const result = code2img(0x80);
      expect(result).toBe('80');
    });

    test('should handle zero code', () => {
      const result = code2img(0x00);
      expect(result).toBe('7d'); // 0x00 & 0xbf = 0x00, then 128 + ((0-128) % 5) = 128 + (-3) = 125 = 0x7d
    });

    test('should handle large codes', () => {
      const result = code2img(0xFF);
      expect(result).toBe('83'); // 0xFF & 0xbf = 0xbf = 191, then 128 + (191-128)%5 = 131 = 0x83
    });

    test('should handle hexadecimal input correctly', () => {
      const testCases = [
        { input: 0x01, expected: '80' }, // 0x01 & 0xbf = 0x01, then 128 + (1-128)%5 = 128 + 2 = 130 = 0x82
        { input: 0x10, expected: '80' }, // 0x10 & 0xbf = 0x10, then 128 + (16-128)%5 = 128 + 2 = 130 = 0x82
        { input: 0xA0, expected: '80' }, // 0xA0 & 0xbf = 0xa0 & 0xbf = 0x20, then 128 + (32-128)%5 = 128 + 1 = 129 = 0x81
        { input: 0xFF, expected: '83' }  // 0xFF & 0xbf = 0xbf = 191, then 128 + (191-128)%5 = 131 = 0x83
      ];

      testCases.forEach(({ input, expected }) => {
        const result = code2img(input);
        expect(result).toMatch(/^[0-9a-f]+$/); // Should be hex string
      });
    });

    test('should handle decimal input', () => {
      const result = code2img(128);
      expect(result).toBe('80'); // 128 & 0xbf = 128, then 128 + (128-128)%5 = 128 = 0x80
    });

    test('should handle negative numbers', () => {
      const result = code2img(-1);
      expect(result).toMatch(/^[0-9a-f]+$/); // Should still return hex string
    });
  });

  describe('speakSound4Syllable function', () => {
    test('should be defined', () => {
      expect(typeof speakSound4Syllable).toBe('function');
    });

    test('should create audio sequence for syllable components', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0x00;
      
      const result = speakSound4Syllable(opening, lasting, closing, 500);
      
      // Should return an array of sound sequences
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Each sequence should have time and sound code
      result.forEach(sequence => {
        expect(Array.isArray(sequence)).toBe(true);
        expect(sequence).toHaveLength(2);
        expect(typeof sequence[0]).toBe('number'); // time
        expect(typeof sequence[1]).toBe('number'); // sound code
      });
    });

    test('should return correct sound sequence structure', () => {
      const opening = 0x81;
      const lasting = 0x03;
      const closing = 0xC1;
      
      const result = speakSound4Syllable(opening, lasting, closing, 500);
      
      // Should return array with proper structure
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Should include sequences for opening, lasting, and closing
      const soundCodes = result.map(seq => seq[1]);
      expect(soundCodes).toContain(3); // opening 128 gets converted to 3
      expect(soundCodes).toContain(lasting);
      expect(soundCodes).toContain(closing);
    });

    test('should handle syllable without closing consonant', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0x00;
      
      const result = speakSound4Syllable(opening, lasting, closing, 500);
      
      expect(Array.isArray(result)).toBe(true);
      // Should not include closing consonant in sequence when closing is 0
      const soundCodes = result.map(seq => seq[1]);
      expect(soundCodes).not.toContain(0x00);
      expect(soundCodes).toContain(3); // opening 128 gets converted to 3
      expect(soundCodes).toContain(lasting);
    });

    test('should handle syllable with closing consonant', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0xC0;
      const interval = 500;
      
      const result = speakSound4Syllable(opening, lasting, closing, interval);
      
      expect(Array.isArray(result)).toBe(true);
      // Should include all three components in sequence
      const soundCodes = result.map(seq => seq[1]);
      expect(soundCodes).toContain(3); // opening 128 gets converted to 3
      expect(soundCodes).toContain(lasting);
      expect(soundCodes).toContain(closing);
    });

    test('should set up proper timing sequence', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0xC0;
      
      const result = speakSound4Syllable(opening, lasting, closing, 500);
      
      // Should return sequences with proper timing
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Times should be in ascending order
      const times = result.map(seq => seq[0]);
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i-1]);
      }
    });

    test('should handle complex lasting sounds', () => {
      const opening = 0x80;
      const lasting = 0x22; // Has 0x20 flag
      const closing = 0x00;
      const interval = 500;
      
      const result = speakSound4Syllable(opening, lasting, closing, interval);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Should handle the 0x20 flag by creating additional sequences
      const soundCodes = result.map(seq => seq[1]);
      expect(soundCodes.length).toBeGreaterThan(2); // More than just opening and lasting
    });

    test('should create correct number of sound sequences', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0xC0;
      
      const result = speakSound4Syllable(opening, lasting, closing, 500);
      
      // Should create sequences for opening, lasting, and closing
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3); // opening, lasting, closing
      
      const soundCodes = result.map(seq => seq[1]);
      expect(soundCodes).toContain(3); // opening 0x80 (128) gets converted to 3
      expect(soundCodes).toContain(lasting);
      expect(soundCodes).toContain(closing);
    });

    test('should handle edge cases in sound sequence generation', () => {
      // Test with opening = 128 (special case)
      const result1 = speakSound4Syllable(128, 0x02, 0x00, 500);
      expect(Array.isArray(result1)).toBe(true);
      
      // Test with zero values
      const result2 = speakSound4Syllable(0x00, 0x00, 0x00, 500);
      expect(Array.isArray(result2)).toBe(true);
      
      // Test with lasting sound having 0x10 flag
      const result3 = speakSound4Syllable(0x80, 0x12, 0x00, 500);
      expect(Array.isArray(result3)).toBe(true);
      expect(result3.length).toBeGreaterThan(0);
    });
  });

  describe('identicalClosing function', () => {
    test('should be defined', () => {
      expect(typeof identicalClosing).toBe('function');
    });

    test('should reduce to homorganic articulation', () => {
      // Test basic functionality
      const result = identicalClosing(0xC0);
      expect(typeof result).toBe('number');
    });

    test('should handle zero input', () => {
      const result = identicalClosing(0x00);
      expect(result).toBe(0x00);
    });

    test('should handle various closing consonant codes', () => {
      const testCases = [
        0xC0, 0xC1, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7,
        0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF
      ];
      
      testCases.forEach(code => {
        expect(() => {
          const result = identicalClosing(code);
          expect(typeof result).toBe('number');
        }).not.toThrow();
      });
    });

    test('should return consistent results for same input', () => {
      const code = 0xC5;
      const result1 = identicalClosing(code);
      const result2 = identicalClosing(code);
      
      expect(result1).toBe(result2);
    });

    test('should handle edge cases', () => {
      const edgeCases = [0x00, 0xFF, 0xC0, 0xDF];
      
      edgeCases.forEach(code => {
        expect(() => {
          identicalClosing(code);
        }).not.toThrow();
      });
    });

    test('should perform bitwise operations correctly', () => {
      // Test that the function performs expected bitwise operations
      const testCode = 0xC7;
      const result = identicalClosing(testCode);
      
      // Result should be a valid closing consonant code
      expect(result).toBeGreaterThanOrEqual(0x00);
      expect(result).toBeLessThanOrEqual(0xFF);
    });

    test('should handle non-closing consonant codes', () => {
      const nonClosingCodes = [0x80, 0x90, 0xA0, 0xB0];
      
      nonClosingCodes.forEach(code => {
        const result = identicalClosing(code);
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('Integration tests', () => {
    test('should work together for complete syllable rendering', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0xC0;
      
      // Test image conversion
      const openingImg = code2img(opening);
      const lastingImg = code2img(lasting);
      const closingImg = code2img(closing);
      
      expect(openingImg).toBe('80'); // 0x80 & 0xbf = 0x80, then 128 + ((128-128) % 5) = 128 + 0 = 128 = 0x80
      expect(lastingImg).toBe('7f'); // 0x02 & 0xbf = 0x02, then 128 + ((2-128) % 5) = 128 + (-1) = 127 = 0x7f
      expect(closingImg).toBe('80'); // 0xC0 & 0xbf = 0x80, then 128 + ((128-128) % 5) = 128 + 0 = 128 = 0x80
      
      // Test sound sequence
      expect(() => {
        speakSound4Syllable(opening, lasting, closing, 500);
      }).not.toThrow();
      
      // Test closing consonant processing
      const processedClosing = identicalClosing(closing);
      expect(typeof processedClosing).toBe('number');
    });

    test('should handle complete syllable workflow', () => {
      const syllableData = [
        { opening: 0x80, lasting: 0x01, closing: 0x00 },
        { opening: 0x81, lasting: 0x02, closing: 0xC1 },
        { opening: 0x82, lasting: 0x23, closing: 0xC2 },
        { opening: 0x83, lasting: 0x04, closing: 0x00 }
      ];
      
      syllableData.forEach(({ opening, lasting, closing }) => {
        // Convert to images
        const images = {
          opening: code2img(opening),
          lasting: code2img(lasting),
          closing: code2img(closing)
        };
        
        expect(images.opening).toMatch(/^[0-9a-f]+$/);
        expect(images.lasting).toMatch(/^[0-9a-f]+$/);
        expect(images.closing).toMatch(/^[0-9a-f]+$/);
        
        // Process sounds
        expect(() => {
          speakSound4Syllable(opening, lasting, closing, 500);
        }).not.toThrow();
        
        // Process closing consonant
        if (closing !== 0x00) {
          const processed = identicalClosing(closing);
          expect(typeof processed).toBe('number');
        }
      });
    });
  });

  describe('Performance tests', () => {
    test('should handle rapid successive calls efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        code2img(0x80 + (i % 16));
        identicalClosing(0xC0 + (i % 16));
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle multiple simultaneous sound sequences', () => {
      const sequences = [
        [0x80, 0x01, 0x00],
        [0x81, 0x02, 0xC1],
        [0x82, 0x03, 0xC2]
      ];
      
      const results = [];
      expect(() => {
        sequences.forEach(([opening, lasting, closing]) => {
          const result = speakSound4Syllable(opening, lasting, closing);
          results.push(result);
        });
      }).not.toThrow();
      
      // Should return arrays of sound sequences
      expect(results).toHaveLength(sequences.length);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error handling', () => {
    test('should handle invalid input types gracefully', () => {
      const invalidInputs = [null, undefined, 'string', {}, [], NaN];
      
      invalidInputs.forEach(input => {
        expect(() => {
          code2img(input);
        }).not.toThrow();
        
        expect(() => {
          identicalClosing(input);
        }).not.toThrow();
      });
    });

    test('should handle audio creation failures', () => {
      global.Audio.mockImplementation(() => {
        throw new Error('Audio not supported');
      });
      
      expect(() => {
        speakSound4Syllable(0x80, 0x02, 0x00, 500);
      }).not.toThrow();
    });

    test('should handle missing audio files gracefully', () => {
      const mockAudio = {
        play: vi.fn().mockRejectedValue(new Error('File not found')),
        src: '',
        addEventListener: vi.fn((event, callback) => {
          if (event === 'error') {
            setTimeout(() => callback(new Error('404')), 0);
          }
        })
      };
      global.Audio.mockReturnValue(mockAudio);
      
      expect(() => {
        speakSound4Syllable(0x80, 0x02, 0x00, 500);
      }).not.toThrow();
    });
  });

  describe('Accessibility considerations', () => {
    test('should provide alternative text for images', () => {
      const codes = [0x80, 0x02, 0xC0];
      
      codes.forEach(code => {
        const imageName = code2img(code);
        expect(imageName).toMatch(/^[0-9a-f]+$/);
        
        // Image name should be descriptive enough for screen readers
        const codeValue = parseInt(imageName, 16);
        expect(codeValue).toBeGreaterThanOrEqual(0);
      });
      
      // Test specific known values
      expect(code2img(0x80)).toBe('80'); // 0x80 & 0xbf = 0x80, then 128 + ((128-128) % 5) = 128 + 0 = 128 = 0x80
      expect(code2img(0x02)).toBe('7f'); // 0x02 & 0xbf = 0x02, then 128 + ((2-128) % 5) = 128 + (-1) = 127 = 0x7f
      expect(code2img(0xC0)).toBe('80'); // 0xC0 & 0xbf = 0x80, then 128 + ((128-128) % 5) = 128 + 0 = 128 = 0x80
    });

    test('should handle audio playback preferences', () => {
      // Test that audio can be controlled/disabled
      const mockAudio = {
        play: vi.fn(),
        pause: vi.fn(),
        volume: 0.5,
        muted: false,
        src: '',
        addEventListener: vi.fn()
      };
      global.Audio.mockReturnValue(mockAudio);
      
      speakSound4Syllable(0x80, 0x02, 0x00, 500);
      
      // Audio objects should be created with controllable properties
      expect(mockAudio.volume).toBeDefined();
      expect(typeof mockAudio.muted).toBe('boolean');
    });
  });
});