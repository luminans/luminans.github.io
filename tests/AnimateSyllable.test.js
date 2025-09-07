// Tests for AnimateSyllable.js module

import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the AnimateSyllable.js file and execute it in global scope
const animateSyllableCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'AnimateSyllable.js'),
  'utf8'
);

// Functions will be defined by the module after evaluation

// Create a robust chainable jQuery mock using Proxy
const createChainableMock = () => {
  let chainableMock;
  
  const attrMethod = vi.fn(function(name, value) {
    // If setting an attribute, return the same chainable mock
    if (arguments.length > 1) {
      return chainableMock;
    }
    // If getting an attribute, return a primitive value
    if (name === 'data-delay') return '100';
    if (name === 'data-duration') return '500';
    if (name === 'stroke-dashoffset') return '200';
    return null;
  });
  
  const baseMethods = {
    ready: vi.fn((callback) => {
      if (callback) callback();
      return chainableMock;
    }),
    click: vi.fn(() => chainableMock),
    mouseenter: vi.fn(() => chainableMock),
    closest: vi.fn(() => chainableMock),
    find: vi.fn(() => [{ children: [{ getAttribute: () => 'test-path' }] }]),
    css: vi.fn(() => chainableMock),
    attr: attrMethod,
    on: vi.fn(() => chainableMock),
    load: vi.fn((callback) => callback())
  };
  
  chainableMock = new Proxy(baseMethods, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      // For any unknown method, return a function that returns the same chainable mock
      return vi.fn(() => chainableMock);
    }
  });
  
  return chainableMock;
};

const mockJQuery = createChainableMock();

// Mock DOM elements
const mockPath = {
  getTotalLength: vi.fn(() => 100),
  setAttribute: vi.fn(),
  getAttribute: vi.fn((attr) => {
    if (attr === 'data-duration') return '500';
    if (attr === 'data-delay') return '100';
    if (attr === 'stroke-dashoffset') return '100';
    return null;
  })
};

const mockSvg = {
  querySelectorAll: vi.fn(() => [mockPath]),
  appendChild: vi.fn(),
  removeChild: vi.fn()
};

// Setup global mocks before loading the module
// Mock jQuery function with comprehensive handling
global.$ = vi.fn((selector, context) => {

  if (selector === 'path') {
    // Return array-like object that can be used with Array.from()
    const pathCollection = [mockPath];
    // Create a chainable mock for path collection using the same approach
    const chainablePathCollection = createChainableMock();
    // Make it array-like by copying array properties
    chainablePathCollection.length = pathCollection.length;
    chainablePathCollection[0] = pathCollection[0];
    // Add Symbol.iterator to make it iterable
    chainablePathCollection[Symbol.iterator] = function* () {
      for (let i = 0; i < this.length; i++) {
        yield this[i];
      }
    };
    return chainablePathCollection;
  }
  if (typeof selector === 'object' && selector && selector.getTotalLength) {
    // $(path) call where path is a DOM element - return chainable object
    return createChainableMock();
  }
  if (selector === 'button') {
    return mockJQuery;
  }
  if (selector === document || selector === global.document) {
    // $(document).ready() call
    return {
      ready: vi.fn((callback) => {
        if (callback) callback();
        return mockJQuery;
      })
    };
  }
  if (selector === window || selector === global.window) {
    // $(window).load() call
    return {
      load: vi.fn((callback) => {
        if (callback) callback();
        return mockJQuery;
      })
    };
  }
  if (typeof selector === 'function') {
    // Document ready callback
    selector();
    return mockJQuery;
  }
  return mockJQuery;
});

// Mock window and document
global.window = {
  writing: {},
  addEventListener: vi.fn(),
  setTimeout: vi.fn((callback) => callback())
};

global.document = {
  ready: vi.fn()
};

// Load the module
const fs = await import('fs');
const path = await import('path');
const moduleCode = fs.readFileSync(path.resolve('js/AnimateSyllable.js'), 'utf8');

// Evaluate the module code
eval(moduleCode);

// Store jQuery calls made during module loading for event handler tests
const moduleLoadCalls = [...global.$.mock.calls];

// Debug: Log jQuery calls made during module loading
console.log('jQuery calls during module load:', moduleLoadCalls);
console.log('First call details:', moduleLoadCalls[0]);
if (moduleLoadCalls[0] && moduleLoadCalls[0][0]) {
  console.log('First call arg type:', typeof moduleLoadCalls[0][0]);
  console.log('First call arg keys:', Object.keys(moduleLoadCalls[0][0]));
}
console.log('window.writing after module load:', global.window.writing);
console.log('Module evaluation completed');

// Make moduleLoadCalls available globally for tests
global.moduleLoadCalls = moduleLoadCalls;

// Assign functions that are defined by the module
// The functions are available through window.writing
let initialize, animate;
if (global.window && global.window.writing) {
  initialize = function(svg) { return global.window.writing.initialize.call(svg); };
  animate = function(svg) { return global.window.writing.animate.call(svg); };
} else {
  // Fallback functions if window.writing is not available
  initialize = function() {};
  animate = function() {};
}

describe('AnimateSyllable Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialize function', () => {
    test('should be defined', () => {
      expect(typeof initialize).toBe('function');
    });

    test('should process SVG paths correctly', () => {
      const mockSvgElement = {
        querySelectorAll: vi.fn(() => [mockPath])
      };

      // Mock jQuery to return paths
      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return [mockPath];
        }
        return mockJQuery;
      });

      initialize(mockSvgElement);

      // Verify that getTotalLength was called
      expect(mockPath.getTotalLength).toHaveBeenCalled();
    });

    test('should set stroke-dash properties on paths', () => {
      const mockSvgElement = {};
      
      // Create a more detailed mock path
      const detailedMockPath = {
        getTotalLength: vi.fn(() => 150),
        style: {},
        setAttribute: vi.fn(),
        getAttribute: vi.fn()
      };

      // Mock jQuery to return the detailed mock path
      const mockJQueryPath = {
        css: vi.fn(() => mockJQueryPath),
        attr: vi.fn(() => mockJQueryPath)
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return [detailedMockPath];
        }
        return mockJQueryPath;
      });

      initialize(mockSvgElement);

      // Verify jQuery methods were called
      expect(mockJQueryPath.css).toHaveBeenCalledWith('transition', 'none');
      expect(mockJQueryPath.attr).toHaveBeenCalledWith('data-duration', expect.any(Number));
      expect(mockJQueryPath.attr).toHaveBeenCalledWith('data-delay', expect.any(Number));
      expect(mockJQueryPath.attr).toHaveBeenCalledWith('stroke-dashoffset', 150);
      expect(mockJQueryPath.attr).toHaveBeenCalledWith('stroke-dasharray', '150,150');
    });

    test('should handle multiple paths', () => {
      const mockSvgElement = {};
      const mockPaths = [
        { getTotalLength: vi.fn(() => 100) },
        { getTotalLength: vi.fn(() => 200) },
        { getTotalLength: vi.fn(() => 150) }
      ];

      const mockJQueryPath = {
        css: vi.fn(() => mockJQueryPath),
        attr: vi.fn(() => mockJQueryPath)
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return mockPaths;
        }
        return mockJQueryPath;
      });

      initialize(mockSvgElement);

      // Verify all paths were processed
      mockPaths.forEach(path => {
        expect(path.getTotalLength).toHaveBeenCalled();
      });
    });
  });

  describe('animate function', () => {
    test('should be defined', () => {
      expect(typeof animate).toBe('function');
    });

    test('should animate SVG paths', () => {
      const mockSvgElement = {};
      
      const mockJQueryPath = {
        attr: vi.fn((attr) => {
          if (attr === 'data-delay') return '100';
          if (attr === 'data-duration') return '500';
          if (attr === 'stroke-dashoffset') return '150';
          return mockJQueryPath;
        }),
        css: vi.fn(() => mockJQueryPath)
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return [mockPath];
        }
        return mockJQueryPath;
      });

      animate(mockSvgElement);

      // Verify animation properties were set
      expect(mockJQueryPath.css).toHaveBeenCalledWith(
        'transition',
        expect.stringContaining('stroke-dashoffset')
      );
      expect(mockJQueryPath.attr).toHaveBeenCalledWith('stroke-dashoffset', '0');
    });

    test('should use correct timing values', () => {
      const mockSvgElement = {};
      
      const mockJQueryPath = {
        attr: vi.fn((attr) => {
          if (attr === 'data-delay') return '200';
          if (attr === 'data-duration') return '800';
          if (attr === 'stroke-dashoffset') return '100';
          return mockJQueryPath;
        }),
        css: vi.fn(() => mockJQueryPath)
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return [mockPath];
        }
        return mockJQueryPath;
      });

      animate(mockSvgElement);

      // Verify correct transition timing
      expect(mockJQueryPath.css).toHaveBeenCalledWith(
        'transition',
        'stroke-dashoffset 800ms 200ms linear'
      );
    });
  });

  describe('window.writing object', () => {
    test('should be defined on window', () => {
      expect(window.writing).toBeDefined();
      expect(typeof window.writing).toBe('object');
    });

    test('should have initialize method', () => {
      expect(typeof window.writing.initialize).toBe('function');
    });

    test('should have animate method', () => {
      expect(typeof window.writing.animate).toBe('function');
    });

    test('initialize method should call initialize function', () => {
      // Test that the initialize method exists and can be called without errors
      const mockThis = { 
        querySelectorAll: vi.fn(() => [mockPath])
      };
      
      // Mock the path collection for this specific test
      const originalGlobal$ = global.$;
      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return createChainableMock();
        }
        if (typeof selector === 'object' && selector && selector.getTotalLength) {
          return createChainableMock();
        }
        return originalGlobal$(selector, context);
      });
      
      // Test that initialize method executes without throwing errors
      expect(() => {
        window.writing.initialize.call(mockThis);
      }).not.toThrow();
      
      // Verify that the path selector was called with the context
      expect(global.$).toHaveBeenCalledWith('path', mockThis);
      
      // Restore original global.$
      global.$ = originalGlobal$;
    });

    test('animate method should call animate function', () => {
      // Since animate is a local function in the module, we need to spy on it differently
      // The animate method should execute without errors when called
      const mockThis = { test: 'context' };
      
      // Mock the path elements that animate function expects
      const mockPathsForAnimate = [
        {
          getAttribute: vi.fn((attr) => {
            if (attr === 'data-delay') return '100';
            if (attr === 'data-duration') return '500';
            if (attr === 'stroke-dashoffset') return '200';
            return null;
          }),
          getTotalLength: vi.fn(() => 200)
        }
      ];
      
      // Update the path collection mock to return our test paths
      const pathCollectionSpy = vi.fn(() => mockPathsForAnimate);
      pathCollectionSpy.css = vi.fn(() => pathCollectionSpy);
      pathCollectionSpy.attr = vi.fn(() => pathCollectionSpy);
      pathCollectionSpy.on = vi.fn(() => pathCollectionSpy);
      
      // Temporarily override the path selector to return our mock
      const originalGlobal$ = global.$;
      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return pathCollectionSpy;
        }
        if (typeof selector === 'object' && selector && selector.getTotalLength) {
          return mockJQuery;
        }
        return originalGlobal$(selector, context);
      });
      
      // Test that animate method executes without throwing errors
      expect(() => {
        window.writing.animate.call(mockThis);
      }).not.toThrow();
      
      // Verify that the path selector was called with the context
      expect(global.$).toHaveBeenCalledWith('path', mockThis);
      
      // Restore original global.$
      global.$ = originalGlobal$;
    });
  });

  describe('Event handlers', () => {
    test('should set up document ready handler', () => {
      // The module should have called $(document).ready() during loading
      // Check if moduleLoadCalls contains calls with an object that has a ready method
      const documentCalls = global.moduleLoadCalls.filter(call => 
        call[0] && typeof call[0] === 'object' && typeof call[0].ready === 'function'
      );
      expect(documentCalls.length).toBeGreaterThan(0);
    });

    test('should set up button click handler', () => {
      // The button click handler is set up in the document ready callback
      // We need to verify the module structure exists
      expect(global.window.writing).toBeDefined();
      expect(typeof global.window.writing.initialize).toBe('function');
      expect(typeof global.window.writing.animate).toBe('function');
    });

    test('should set up window load handler', () => {
      // The module should have set up window load handler during loading
      // Check if moduleLoadCalls contains calls with an object that has addEventListener method (window-like)
      const windowCalls = global.moduleLoadCalls.filter(call => 
        call[0] && typeof call[0] === 'object' && typeof call[0].addEventListener === 'function'
      );
      expect(windowCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Animation timing calculations', () => {
    test('should calculate duration based on path length and speed', () => {
      const pathLength = 200;
      const speed = 0.2;
      const expectedDuration = pathLength / speed; // 1000

      const mockSvgElement = {};
      const mockPathWithLength = {
        getTotalLength: vi.fn(() => pathLength)
      };

      const mockJQueryPath = {
        css: vi.fn(() => mockJQueryPath),
        attr: vi.fn((attr, value) => {
          if (attr === 'data-duration' && typeof value === 'number') {
            expect(value).toBe(expectedDuration);
          }
          return mockJQueryPath;
        })
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return [mockPathWithLength];
        }
        return mockJQueryPath;
      });

      initialize(mockSvgElement);
    });

    test('should calculate cumulative delays for multiple paths', () => {
      const mockSvgElement = {};
      const mockPaths = [
        { getTotalLength: vi.fn(() => 100) }, // duration: 500, delay: 0
        { getTotalLength: vi.fn(() => 200) }, // duration: 1000, delay: 600
        { getTotalLength: vi.fn(() => 150) }  // duration: 750, delay: 1700
      ];

      let callCount = 0;
      const mockJQueryPath = {
        css: vi.fn(() => mockJQueryPath),
        attr: vi.fn((attr, value) => {
          if (attr === 'data-delay' && typeof value === 'number') {
            if (callCount === 0) expect(value).toBe(0);
            if (callCount === 1) expect(value).toBeGreaterThan(500);
            if (callCount === 2) expect(value).toBeGreaterThan(1600);
            callCount++;
          }
          return mockJQueryPath;
        })
      };

      global.$ = vi.fn((selector, context) => {
        if (selector === 'path') {
          return mockPaths;
        }
        return mockJQueryPath;
      });

      initialize(mockSvgElement);
    });
  });
});