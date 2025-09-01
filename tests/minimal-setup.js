/**
 * Minimal test setup that avoids conflicts with Jest's expect module
 * This setup provides only essential browser globals and jQuery mock
 */

// Mock basic browser globals
global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  location: {
    href: 'http://localhost/',
    pathname: '/'
  },
  document: global.document
};

// Mock Audio API
global.Audio = jest.fn(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  duration: 0,
  paused: true,
  volume: 1
}));

// Mock SpeechSynthesis API
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [])
};

global.SpeechSynthesisUtterance = jest.fn(() => ({
  text: '',
  lang: 'en-US',
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));

// Simple jQuery mock without extend method to avoid conflicts
const createSimpleJQuery = (selector) => {
  const mockElement = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    click: jest.fn(),
    focus: jest.fn(),
    blur: jest.fn(),
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false)
    }
  };

  return {
    length: 1,
    0: mockElement,
    each: jest.fn(function(callback) {
      callback.call(mockElement, 0, mockElement);
      return this;
    }),
    on: jest.fn(function() { return this; }),
    off: jest.fn(function() { return this; }),
    click: jest.fn(function(handler) {
      if (handler) handler.call(mockElement);
      return this;
    }),
    val: jest.fn(function(value) {
      if (value !== undefined) {
        mockElement.value = value;
        return this;
      }
      return mockElement.value;
    }),
    text: jest.fn(function(value) {
      if (value !== undefined) {
        mockElement.textContent = value;
        return this;
      }
      return mockElement.textContent;
    }),
    html: jest.fn(function(value) {
      if (value !== undefined) {
        mockElement.innerHTML = value;
        return this;
      }
      return mockElement.innerHTML;
    }),
    addClass: jest.fn(function() { return this; }),
    removeClass: jest.fn(function() { return this; }),
    css: jest.fn(function() { return this; }),
    attr: jest.fn(function() { return this; }),
    prop: jest.fn(function() { return this; }),
    show: jest.fn(function() { return this; }),
    hide: jest.fn(function() { return this; }),
    fadeIn: jest.fn(function() { return this; }),
    fadeOut: jest.fn(function() { return this; }),
    animate: jest.fn(function() { return this; })
  };
};

// Create jQuery function
const $ = jest.fn(createSimpleJQuery);

// Add static methods to jQuery
$.ajax = jest.fn();
$.get = jest.fn();
$.post = jest.fn();

// Make jQuery available globally
global.$ = $;
global.jQuery = $;