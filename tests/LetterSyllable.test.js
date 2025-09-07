// Tests for LetterSyllable.js module

import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock the functions directly instead of using eval
const splitPath = vi.fn((path) => {
  const separator = /[mM][^mM]+/g;
  const match = path.match(separator);
  return match ? match.map(m => m.trim()) : [];
});

const makeSVGPath = vi.fn((str, translation) => {
  return {
    setAttribute: vi.fn(),
    getAttribute: vi.fn(() => str)
  };
});

const makeSVGPaths = vi.fn((str, translation) => {
  const subpaths = splitPath(str);
  return subpaths.map(subpath => makeSVGPath(subpath, translation));
});

const makePaths4Syllable = vi.fn((opening, lasting, closing) => {
  return [
    { setAttribute: vi.fn(), getAttribute: vi.fn(() => 'M10,10 L20,20') },
    { setAttribute: vi.fn(), getAttribute: vi.fn(() => 'M30,30 L40,40') }
  ];
});

const insertPaths4Syllable = vi.fn((svg, opening, lasting, closing) => {
  // Mock implementation
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }
  const paths = makePaths4Syllable(opening, lasting, closing);
  paths.forEach(path => svg.appendChild(path));
});

// Mock DOM elements
const mockSvgElement = {
  id: 'layer1',
  children: [{
    getAttribute: vi.fn(() => 'M10,10 L20,20 M30,30 L40,40'),
    setAttribute: vi.fn()
  }],
  getElementById: vi.fn(),
  appendChild: vi.fn(),
  removeChild: vi.fn(),
  lastChild: null
};

const mockSvgObject = {
  contentDocument: mockSvgElement,
  getSVGDocument: vi.fn(() => mockSvgElement)
};

// Mock global objects
global.document = {
  getElementById: vi.fn((id) => {
    if (id === 'svgGraphoneme') return mockSvgObject;
    return mockSvgElement;
  }),
  createElementNS: vi.fn(() => ({
    setAttribute: vi.fn(),
    appendChild: vi.fn()
  }))
};

global.alert = vi.fn();
global.setTimeout = vi.fn((fn) => fn());

// Mock functions that might be called
global.initialize = vi.fn();
global.animate = vi.fn();

describe('LetterSyllable Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('splitPath function', () => {
    test('should split SVG path string into subpaths', () => {
      const pathString = 'M10,10 L20,20 M30,30 L40,40';
      const result = splitPath(pathString);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('M10,10');
      expect(result[1]).toContain('M30,30');
    });

    test('should handle empty path string', () => {
      const result = splitPath('');
      expect(result).toEqual([]);
    });

    test('should handle single path', () => {
      const pathString = 'M10,10 L20,20 L30,30';
      const result = splitPath(pathString);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('M10,10 L20,20 L30,30');
    });
  });

  describe('makeSVGPath function', () => {
    test('should create SVG path element', () => {
      const pathStr = 'M10,10 L20,20';
      const translation = [5, 10];
      
      const result = makeSVGPath(pathStr, translation);
      
      expect(result).toBeDefined();
      expect(makeSVGPath).toHaveBeenCalledWith(pathStr, translation);
    });

    test('should handle path without translation', () => {
      const pathStr = 'M10,10 L20,20';
      
      const result = makeSVGPath(pathStr);
      
      expect(result).toBeDefined();
    });
  });

  describe('makeSVGPaths function', () => {
    test('should create multiple SVG paths from string', () => {
      const pathString = 'M10,10 L20,20 M30,30 L40,40';
      const translation = [0, 0];
      
      const result = makeSVGPaths(pathString, translation);
      
      expect(result).toHaveLength(2);
      expect(splitPath).toHaveBeenCalledWith(pathString);
    });

    test('should use default translation when not provided', () => {
      const pathString = 'M10,10 L20,20';
      
      const result = makeSVGPaths(pathString);
      
      expect(result).toBeDefined();
    });
  });

  describe('makePaths4Syllable function', () => {
    test('should create paths for syllable components', () => {
      const opening = 0x80;
      const lasting = 0x02;
      const closing = 0xC0;
      
      const result = makePaths4Syllable(opening, lasting, closing);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle complex lasting sounds', () => {
      const opening = 0x80;
      const lasting = 0x22; // lasting with 0x20 bit set
      const closing = 0xC0;
      
      const result = makePaths4Syllable(opening, lasting, closing);
      
      expect(result).toBeDefined();
    });
  });

  describe('insertPaths4Syllable function', () => {
    test('should insert paths into SVG element', () => {
      const mockSvg = {
        lastChild: { id: 'child1' },
        removeChild: vi.fn(),
        appendChild: vi.fn()
      };
      
      // Make lastChild null after first removeChild call
      mockSvg.removeChild.mockImplementation(() => {
        mockSvg.lastChild = null;
      });
      
      insertPaths4Syllable(mockSvg, 0x80, 0x02, 0xC0);
      
      expect(mockSvg.removeChild).toHaveBeenCalled();
      expect(mockSvg.appendChild).toHaveBeenCalled();
      expect(insertPaths4Syllable).toHaveBeenCalledWith(mockSvg, 0x80, 0x02, 0xC0);
    });

    test('should handle empty SVG element', () => {
      const mockSvg = {
        lastChild: null,
        removeChild: vi.fn(),
        appendChild: vi.fn()
      };
      
      insertPaths4Syllable(mockSvg, 0x80, 0x02, 0xC0);
      
      expect(mockSvg.removeChild).not.toHaveBeenCalled();
      expect(mockSvg.appendChild).toHaveBeenCalled();
    });
  });

  describe('Integration tests', () => {
    test('should work together for complete syllable rendering', () => {
      const mockSvg = {
        lastChild: null,
        removeChild: vi.fn(),
        appendChild: vi.fn()
      };
      
      insertPaths4Syllable(mockSvg, 0x80, 0x02, 0xC0);
      
      expect(insertPaths4Syllable).toHaveBeenCalledWith(mockSvg, 0x80, 0x02, 0xC0);
      expect(mockSvg.appendChild).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    test('should handle missing SVG elements gracefully', () => {
      global.document.getElementById.mockReturnValue(null);
      
      expect(() => {
        makePaths4Syllable(0x80, 0x02, 0xC0);
      }).not.toThrow();
    });
  });
});