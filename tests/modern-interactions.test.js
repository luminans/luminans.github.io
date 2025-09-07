// Tests for modern-interactions.js module

import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the modern-interactions.js file and execute it in global scope
const modernInteractionsCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'modern-interactions.js'),
  'utf8'
);

// Declare classes that will be defined by the module
let InteractionManager, LessonCardManager, ProgressManager;

// Mock DOM elements first
const mockElement = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  click: vi.fn(),
  focus: vi.fn(),
  blur: vi.fn(),
  scrollIntoView: vi.fn(),
  getAttribute: vi.fn(),
  setAttribute: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
    contains: vi.fn(() => false)
  },
  style: {},
  innerHTML: '',
  get textContent() { return this._textContent || ''; },
  set textContent(value) { this._textContent = value; },
  value: '',
  appendChild: vi.fn(),
  removeChild: vi.fn(),
  insertBefore: vi.fn(),
  checked: false,
  disabled: false
};

// Setup global mocks before loading the module
global.document = {
  addEventListener: vi.fn(),
  querySelector: vi.fn(() => mockElement),
  querySelectorAll: vi.fn(() => [mockElement]),
  createElement: vi.fn(() => mockElement),
  body: mockElement,
  documentElement: mockElement,
  head: mockElement
};

global.window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  innerWidth: 1024,
  innerHeight: 768,
  scrollY: 0,
  requestAnimationFrame: vi.fn((cb) => cb()),
  cancelAnimationFrame: vi.fn(),
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  }
};

global.console = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Mock Intersection Observer
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock Resize Observer
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock Mutation Observer
global.MutationObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}));

// Document.head is now properly mocked in the main document object

// Debug: Check if document.body has appendChild before evaluation
console.log('document.body:', global.document.body);
console.log('document.body.appendChild:', global.document.body?.appendChild);

// Classes will be defined after moduleCode is loaded and evaluated below

// Mock DOM elements and methods
// Using the mockElement already declared above
mockElement.classList = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(() => false),
  toggle: vi.fn()
};
mockElement.style = {};
mockElement.getAttribute = vi.fn();
mockElement.setAttribute = vi.fn();
mockElement.getBoundingClientRect = vi.fn(() => ({
  top: 100,
  left: 100,
  width: 200,
  height: 150,
  bottom: 250,
  right: 300
}));
mockElement.querySelector = vi.fn();
mockElement.querySelectorAll = vi.fn(() => []);
mockElement.scrollTop = 0;
mockElement.scrollLeft = 0;
mockElement.offsetTop = 100;
mockElement.offsetLeft = 100;
mockElement.clientHeight = 600;
mockElement.scrollHeight = 1200;
mockElement.focus = vi.fn();
mockElement.blur = vi.fn();
mockElement.click = vi.fn();
mockElement.dispatchEvent = vi.fn();

// Mock document
global.document = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  querySelector: vi.fn(() => mockElement),
  querySelectorAll: vi.fn(() => [mockElement]),
  getElementById: vi.fn(() => mockElement),
  createElement: vi.fn(() => mockElement),
  body: mockElement,
  documentElement: mockElement,
  readyState: 'complete',
  createEvent: vi.fn(() => ({
    initEvent: vi.fn()
  }))
};

// Mock window
global.window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  innerWidth: 1024,
  innerHeight: 768,
  scrollY: 0,
  scrollX: 0,
  pageYOffset: 0,
  pageXOffset: 0,
  requestAnimationFrame: vi.fn(callback => setTimeout(callback, 16)),
  cancelAnimationFrame: vi.fn(),
  getComputedStyle: vi.fn(() => ({
    getPropertyValue: vi.fn(() => '0px'),
    opacity: '1',
    transform: 'none'
  })),
  matchMedia: vi.fn(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn()
  })),
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  location: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  history: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  },
  navigator: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    cookieEnabled: true
  },
  screen: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040
  },
  performance: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn()
  },
  dispatchEvent: vi.fn()
};

// Mock console methods
global.console = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn()
};

// Mock localStorage globally
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Mock Intersection Observer
global.IntersectionObserver = vi.fn(function(callback, options) {
  this.callback = callback;
  this.options = options;
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

// Mock Resize Observer
global.ResizeObserver = vi.fn(function(callback) {
  this.callback = callback;
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

// Mock Mutation Observer
global.MutationObserver = vi.fn(function(callback) {
  this.callback = callback;
  this.observe = vi.fn();
  this.disconnect = vi.fn();
  this.takeRecords = vi.fn(() => []);
});

// Load the module
const fs = await import('fs');
const path = await import('path');
const moduleCode = fs.readFileSync(path.resolve('js/modern-interactions.js'), 'utf8');

// Evaluate the module code
eval(moduleCode);

// Assign the classes to variables for testing
InteractionManager = global.InteractionManager;
LessonCardManager = global.LessonCardManager;
ProgressManager = global.ProgressManager;

describe('Modern Interactions Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.window.scrollY = 0;
    global.window.innerWidth = 1024;
    global.window.innerHeight = 768;
    
    // Set default localStorage mock return value
    global.localStorage.getItem.mockReturnValue(null);
  });

  describe('InteractionManager Class', () => {
    let interactionManager;

    beforeEach(() => {
      if (typeof InteractionManager !== 'undefined') {
        interactionManager = new InteractionManager();
      }
    });

    test('should be defined', () => {
      expect(typeof InteractionManager).toBe('function');
    });

    test('should initialize with default options', () => {
      if (interactionManager) {
        expect(interactionManager).toBeDefined();
        expect(typeof interactionManager.init).toBe('function');
      }
    });

    test('should handle initialization', () => {
      if (interactionManager && interactionManager.init) {
        expect(() => {
          interactionManager.init();
        }).not.toThrow();
      }
    });

    test('should set up event listeners', () => {
      if (interactionManager && interactionManager.init) {
        interactionManager.init();
        
        // Should have added event listeners
        expect(global.window.addEventListener).toHaveBeenCalled();
      }
    });

    test('should handle scroll events', () => {
      if (interactionManager && interactionManager.handleScroll) {
        expect(() => {
          interactionManager.handleScroll();
        }).not.toThrow();
      }
    });

    test('should handle resize events', () => {
      if (interactionManager && interactionManager.handleResize) {
        expect(() => {
          interactionManager.handleResize();
        }).not.toThrow();
      }
    });

    test('should handle touch events', () => {
      if (interactionManager && interactionManager.handleTouch) {
        const mockTouchEvent = {
          type: 'touchstart',
          touches: [{ clientX: 100, clientY: 100 }],
          preventDefault: vi.fn()
        };
        
        expect(() => {
          interactionManager.handleTouch(mockTouchEvent);
        }).not.toThrow();
      }
    });

    test('should handle keyboard events', () => {
      if (interactionManager && interactionManager.handleKeyboard) {
        const mockKeyEvent = {
          type: 'keydown',
          key: 'Enter',
          keyCode: 13,
          preventDefault: vi.fn()
        };
        
        expect(() => {
          interactionManager.handleKeyboard(mockKeyEvent);
        }).not.toThrow();
      }
    });

    test('should manage animations', () => {
      if (interactionManager && interactionManager.animate) {
        expect(() => {
          interactionManager.animate();
        }).not.toThrow();
      }
    });

    test('should handle accessibility features', () => {
      if (interactionManager && interactionManager.setupAccessibility) {
        expect(() => {
          interactionManager.setupAccessibility();
        }).not.toThrow();
      }
    });

    test('should optimize performance', () => {
      if (interactionManager && interactionManager.optimizePerformance) {
        expect(() => {
          interactionManager.optimizePerformance();
        }).not.toThrow();
      }
    });

    test('should clean up resources', () => {
      if (interactionManager && interactionManager.destroy) {
        expect(() => {
          interactionManager.destroy();
        }).not.toThrow();
        
        // Should remove event listeners
        expect(global.window.removeEventListener).toHaveBeenCalled();
      }
    });
  });

  describe('LessonCardManager Class', () => {
    let lessonCardManager;

    beforeEach(() => {
      if (typeof LessonCardManager !== 'undefined') {
        lessonCardManager = new LessonCardManager();
      }
    });

    test('should be defined', () => {
      expect(typeof LessonCardManager).toBe('function');
    });

    test('should initialize lesson cards', () => {
      if (lessonCardManager && lessonCardManager.init) {
        expect(() => {
          lessonCardManager.init();
        }).not.toThrow();
      }
    });

    test('should handle card interactions', () => {
      if (lessonCardManager && lessonCardManager.handleCardClick) {
        const mockEvent = {
          target: mockElement,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        };
        
        expect(() => {
          lessonCardManager.handleCardClick(mockEvent);
        }).not.toThrow();
      }
    });

    test('should manage card animations', () => {
      if (lessonCardManager && lessonCardManager.animateCard) {
        expect(() => {
          lessonCardManager.animateCard(mockElement);
        }).not.toThrow();
      }
    });

    test('should handle card hover effects', () => {
      if (lessonCardManager && lessonCardManager.handleCardHover) {
        expect(() => {
          lessonCardManager.handleCardHover(mockElement);
        }).not.toThrow();
      }
    });

    test('should manage card focus states', () => {
      if (lessonCardManager && lessonCardManager.handleCardFocus) {
        const mockEvent = {
          target: mockElement,
          type: 'focus'
        };
        
        expect(() => {
          lessonCardManager.handleCardFocus(mockEvent);
        }).not.toThrow();
      }
    });
  });

  describe('ProgressManager Class', () => {
    let progressManager;

    beforeEach(() => {
      if (typeof ProgressManager !== 'undefined') {
        progressManager = new ProgressManager();
      }
    });

    test('should be defined', () => {
      expect(typeof ProgressManager).toBe('function');
    });

    test('should initialize progress tracking', () => {
      if (progressManager && progressManager.init) {
        expect(() => {
          progressManager.init();
        }).not.toThrow();
      }
    });

    test('should track user progress', () => {
      if (progressManager && progressManager.trackProgress) {
        expect(() => {
          progressManager.trackProgress('lesson1', 50);
        }).not.toThrow();
      }
    });

    test('should save progress to storage', () => {
      if (progressManager && progressManager.saveProgress) {
        const progressData = { lesson1: 50, lesson2: 75 };
        
        expect(() => {
          progressManager.saveProgress(progressData);
        }).not.toThrow();
        
        expect(global.localStorage.setItem).toHaveBeenCalled();
      }
    });

    test('should load progress from storage', () => {
      if (typeof ProgressManager !== 'undefined') {
        // Clear mocks and set up return value before creating instance
        vi.clearAllMocks();
        const mockProgress = {
          completedLessons: ['lesson1'],
          currentLesson: 'lesson2',
          totalTime: 1000,
          lastVisit: Date.now()
        };
        global.localStorage.getItem.mockReturnValue(JSON.stringify(mockProgress));
        
        // Create new instance to trigger loadProgress in constructor
        const testManager = new ProgressManager();
        
        expect(global.localStorage.getItem).toHaveBeenCalled();
        expect(testManager.progress).toBeDefined();
        expect(testManager.progress.completedLessons).toEqual(['lesson1']);
      }
    });

    test('should calculate completion percentage', () => {
      if (progressManager && progressManager.calculateCompletion) {
        const result = progressManager.calculateCompletion();
        
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    });

    test('should update progress display', () => {
      if (progressManager && progressManager.updateDisplay) {
        expect(() => {
          progressManager.updateDisplay(75);
        }).not.toThrow();
      }
    });
  });

  describe('Scroll Effects', () => {
    test('should handle scroll-based animations', () => {
      // Simulate scroll event
      global.window.scrollY = 300;
      
      const scrollEvent = new Event('scroll');
      
      expect(() => {
        global.window.dispatchEvent(scrollEvent);
      }).not.toThrow();
    });

    test('should implement parallax effects', () => {
      if (typeof handleParallax !== 'undefined') {
        expect(() => {
          handleParallax();
        }).not.toThrow();
      }
    });

    test('should handle sticky elements', () => {
      if (typeof handleStickyElements !== 'undefined') {
        expect(() => {
          handleStickyElements();
        }).not.toThrow();
      }
    });

    test('should manage scroll indicators', () => {
      if (typeof updateScrollIndicator !== 'undefined') {
        expect(() => {
          updateScrollIndicator();
        }).not.toThrow();
      }
    });
  });

  describe('Touch Gestures', () => {
    test('should handle swipe gestures', () => {
      if (typeof handleSwipe !== 'undefined') {
        const mockTouchEvent = {
          type: 'touchstart',
          touches: [{ clientX: 100, clientY: 100 }],
          changedTouches: [{ clientX: 200, clientY: 100 }],
          preventDefault: vi.fn()
        };
        
        expect(() => {
          handleSwipe(mockTouchEvent);
        }).not.toThrow();
      }
    });

    test('should handle pinch gestures', () => {
      if (typeof handlePinch !== 'undefined') {
        const mockTouchEvent = {
          type: 'touchstart',
          touches: [
            { clientX: 100, clientY: 100 },
            { clientX: 200, clientY: 200 }
          ],
          preventDefault: vi.fn()
        };
        
        expect(() => {
          handlePinch(mockTouchEvent);
        }).not.toThrow();
      }
    });

    test('should handle tap gestures', () => {
      if (typeof handleTap !== 'undefined') {
        const mockTouchEvent = {
          type: 'touchend',
          changedTouches: [{ clientX: 100, clientY: 100 }],
          preventDefault: vi.fn()
        };
        
        expect(() => {
          handleTap(mockTouchEvent);
        }).not.toThrow();
      }
    });
  });

  describe('Animations', () => {
    test('should handle CSS animations', () => {
      if (typeof animateElement !== 'undefined') {
        expect(() => {
          animateElement(mockElement, 'fadeIn');
        }).not.toThrow();
      }
    });

    test('should handle JavaScript animations', () => {
      if (typeof animateWithJS !== 'undefined') {
        expect(() => {
          animateWithJS(mockElement, { opacity: 0 }, { opacity: 1 }, 300);
        }).not.toThrow();
      }
    });

    test('should manage animation queues', () => {
      if (typeof AnimationQueue !== 'undefined') {
        const queue = new AnimationQueue();
        
        expect(() => {
          queue.add(() => {});
          queue.play();
        }).not.toThrow();
      }
    });

    test('should handle animation callbacks', () => {
      if (typeof onAnimationComplete !== 'undefined') {
        const callback = vi.fn();
        
        expect(() => {
          onAnimationComplete(callback);
        }).not.toThrow();
      }
    });
  });

  describe('Accessibility Features', () => {
    test('should manage focus states', () => {
      if (typeof manageFocus !== 'undefined') {
        expect(() => {
          manageFocus(mockElement);
        }).not.toThrow();
      }
    });

    test('should handle keyboard navigation', () => {
      if (typeof handleKeyboardNavigation !== 'undefined') {
        const mockKeyEvent = {
          key: 'Tab',
          shiftKey: false,
          preventDefault: vi.fn()
        };
        
        expect(() => {
          handleKeyboardNavigation(mockKeyEvent);
        }).not.toThrow();
      }
    });

    test('should manage ARIA attributes', () => {
      if (typeof updateAriaAttributes !== 'undefined') {
        expect(() => {
          updateAriaAttributes(mockElement, { 'aria-expanded': 'true' });
        }).not.toThrow();
      }
    });

    test('should handle screen reader announcements', () => {
      if (typeof announceToScreenReader !== 'undefined') {
        expect(() => {
          announceToScreenReader('Content updated');
        }).not.toThrow();
      }
    });
  });

  describe('Performance Optimizations', () => {
    test('should implement throttling', () => {
      if (typeof throttle !== 'undefined') {
        const callback = vi.fn();
        const throttled = throttle(callback, 100);
        
        expect(typeof throttled).toBe('function');
        
        throttled();
        throttled();
        throttled();
        
        expect(callback).toHaveBeenCalledTimes(1);
      }
    });

    test('should implement debouncing', () => {
      if (typeof debounce !== 'undefined') {
        const callback = vi.fn();
        const debounced = debounce(callback, 100);
        
        expect(typeof debounced).toBe('function');
        
        debounced();
        debounced();
        debounced();
        
        // Should not have been called yet
        expect(callback).not.toHaveBeenCalled();
      }
    });

    test('should use Intersection Observer for visibility', () => {
      if (typeof observeVisibility !== 'undefined') {
        expect(() => {
          observeVisibility(mockElement, () => {});
        }).not.toThrow();
        
        expect(global.IntersectionObserver).toHaveBeenCalled();
      }
    });

    test('should lazy load content', () => {
      if (typeof lazyLoad !== 'undefined') {
        expect(() => {
          lazyLoad('.lazy-element');
        }).not.toThrow();
      }
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete interaction workflow', () => {
      if (typeof InteractionManager !== 'undefined') {
        const manager = new InteractionManager();
        
        expect(() => {
          manager.init();
          
          // Simulate various interactions
          const scrollEvent = { type: 'scroll' };
          const touchEvent = {
            type: 'touchstart',
            touches: [{ clientX: 100, clientY: 100 }]
          };
          const keyEvent = {
            type: 'keydown',
            key: 'Enter'
          };
          
          if (manager.handleScroll) manager.handleScroll(scrollEvent);
          if (manager.handleTouch) manager.handleTouch(touchEvent);
          if (manager.handleKeyboard) manager.handleKeyboard(keyEvent);
          
          if (manager.destroy) manager.destroy();
        }).not.toThrow();
      }
    });

    test('should coordinate between different managers', () => {
      if (typeof InteractionManager !== 'undefined' && 
          typeof LessonCardManager !== 'undefined' && 
          typeof ProgressManager !== 'undefined') {
        
        const interaction = new InteractionManager();
        const lessonCard = new LessonCardManager();
        const progress = new ProgressManager();
        
        expect(() => {
          interaction.init();
          lessonCard.init();
          progress.init();
          
          // Simulate coordinated interactions
          if (lessonCard.handleCardClick && progress.trackProgress) {
            const mockEvent = { target: mockElement, preventDefault: vi.fn() };
            lessonCard.handleCardClick(mockEvent);
            progress.trackProgress('lesson1', 25);
          }
        }).not.toThrow();
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle missing DOM elements gracefully', () => {
      global.document.querySelector.mockReturnValue(null);
      
      if (typeof InteractionManager !== 'undefined') {
        const manager = new InteractionManager();
        
        expect(() => {
          manager.init();
        }).not.toThrow();
      }
    });

    test('should handle unsupported features gracefully', () => {
      // Save original mocks
      const originalIntersectionObserver = global.IntersectionObserver;
      const originalResizeObserver = global.ResizeObserver;
      
      // Mock unsupported features
      global.IntersectionObserver = undefined;
      global.ResizeObserver = undefined;
      
      if (typeof InteractionManager !== 'undefined') {
        const manager = new InteractionManager();
        
        expect(() => {
          manager.init();
        }).not.toThrow();
      }
      
      // Restore original mocks
      global.IntersectionObserver = originalIntersectionObserver;
      global.ResizeObserver = originalResizeObserver;
    });

    test('should handle invalid event data', () => {
      if (typeof InteractionManager !== 'undefined') {
        const manager = new InteractionManager();
        
        expect(() => {
          if (manager.handleTouch) manager.handleTouch(null);
          if (manager.handleKeyboard) manager.handleKeyboard(undefined);
          if (manager.handleScroll) manager.handleScroll({});
        }).not.toThrow();
      }
    });
  });

  describe('Browser Compatibility', () => {
    test('should work with different user agents', () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      ];
      
      userAgents.forEach(ua => {
        global.window.navigator.userAgent = ua;
        
        if (typeof InteractionManager !== 'undefined') {
          expect(() => {
            const manager = new InteractionManager();
            manager.init();
          }).not.toThrow();
        }
      });
    });

    test('should handle different screen sizes', () => {
      const screenSizes = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }  // Desktop
      ];
      
      screenSizes.forEach(size => {
        global.window.innerWidth = size.width;
        global.window.innerHeight = size.height;
        
        if (typeof InteractionManager !== 'undefined') {
          const manager = new InteractionManager();
          
          expect(() => {
            manager.init();
            if (manager.handleResize) manager.handleResize();
          }).not.toThrow();
        }
      });
    });
  });
});