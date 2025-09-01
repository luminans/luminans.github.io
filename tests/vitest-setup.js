import { vi } from 'vitest';

// Mock Audio API
global.Audio = vi.fn(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  duration: 0,
  paused: true,
  volume: 1
}));

// Mock SpeechSynthesis API
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => [])
};

global.SpeechSynthesisUtterance = vi.fn(() => ({
  text: '',
  lang: 'en-US',
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}));

// Simple jQuery mock
const createJQuery = () => {
  const jq = vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    click: vi.fn().mockReturnThis(),
    val: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    html: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    removeClass: vi.fn().mockReturnThis(),
    css: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    prop: vi.fn().mockReturnThis(),
    show: vi.fn().mockReturnThis(),
    hide: vi.fn().mockReturnThis(),
    fadeIn: vi.fn().mockReturnThis(),
    fadeOut: vi.fn().mockReturnThis(),
    animate: vi.fn().mockReturnThis(),
    each: vi.fn().mockReturnThis()
  }));
  
  jq.ajax = vi.fn();
  jq.get = vi.fn();
  jq.post = vi.fn();
  
  return jq;
};

const $ = createJQuery();
const jQuery = $;

global.$ = $;
global.jQuery = jQuery;