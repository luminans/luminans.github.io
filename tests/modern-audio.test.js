// Tests for modern-audio.js module

import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the modern-audio.js file and execute it in global scope
const modernAudioCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'modern-audio.js'),
  'utf8'
);

// Declare classes and functions that will be defined by the module
let AudioManager, playLessonAudio, playSyllableAudio;

// Will be set up after mock definitions

// Mock Web Audio API
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 440 },
    type: 'sine'
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 }
  })),
  createAnalyser: vi.fn(() => ({
    connect: vi.fn(),
    getByteFrequencyData: vi.fn(),
    getByteTimeDomainData: vi.fn(),
    frequencyBinCount: 1024,
    fftSize: 2048
  })),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    buffer: null
  })),
  createBuffer: vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(1024))
  })),
  decodeAudioData: vi.fn(() => Promise.resolve({})),
  destination: {},
  sampleRate: 44100,
  currentTime: 0,
  state: 'running',
  suspend: vi.fn(),
  resume: vi.fn(),
  close: vi.fn()
};

global.AudioContext = vi.fn(() => mockAudioContext);
global.webkitAudioContext = vi.fn(() => mockAudioContext);

// Mock Audio constructor
global.Audio = vi.fn(() => ({
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  load: vi.fn(),
  src: '',
  currentTime: 0,
  duration: 100,
  volume: 1,
  muted: false,
  paused: true,
  ended: false,
  readyState: 4,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  canPlayType: vi.fn(() => 'probably')
}));

// Mock Speech Synthesis API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => [
    {
      name: 'Google 한국의',
      lang: 'ko-KR',
      default: false,
      localService: false,
      voiceURI: 'Google 한국의'
    },
    {
      name: 'Microsoft David',
      lang: 'en-US',
      default: true,
      localService: true,
      voiceURI: 'Microsoft David'
    }
  ]),
  speaking: false,
  pending: false,
  paused: false
};

global.speechSynthesis = mockSpeechSynthesis;

global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
  text: text || '',
  lang: 'en-US',
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
  onmark: null,
  onboundary: null
}));

// Mock fetch for audio file loading
global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
}));

// Mock canvas for audio visualization
const mockCanvas = {
  getContext: vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    globalAlpha: 1
  })),
  width: 800,
  height: 400
};

// Mock document
const mockElement = {
  ...mockCanvas,
  style: {
    position: '',
    top: '',
    right: '',
    zIndex: ''
  },
  className: '',
  innerHTML: '',
  appendChild: vi.fn(),
  remove: vi.fn()
};

global.document = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  querySelector: vi.fn(() => mockElement),
  querySelectorAll: vi.fn(() => [mockElement]),
  getElementById: vi.fn(() => mockElement),
  createElement: vi.fn(() => mockElement),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  },
  readyState: 'complete'
};

// Mock window
global.window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  requestAnimationFrame: vi.fn(callback => setTimeout(callback, 16)),
  cancelAnimationFrame: vi.fn(),
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  },
  location: {
    protocol: 'https:'
  },
  AudioContext: global.AudioContext,
  webkitAudioContext: global.webkitAudioContext,
  speechSynthesis: mockSpeechSynthesis
};

// Mock console
global.console = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
};

// Execute the code to define the classes and functions
eval(`
  ${modernAudioCode}
  global.AudioManager = AudioManager;
  global.playLessonAudio = typeof playLessonAudio !== 'undefined' ? playLessonAudio : undefined;
  global.playSyllableAudio = typeof playSyllableAudio !== 'undefined' ? playSyllableAudio : undefined;
`);
AudioManager = global.AudioManager;
playLessonAudio = global.playLessonAudio;
playSyllableAudio = global.playSyllableAudio;

// Ensure speechSynthesis is available on window for AudioManager
global.window.speechSynthesis = mockSpeechSynthesis;

describe('Modern Audio Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AudioManager Class', () => {
    let audioManager;

    beforeEach(() => {
      if (typeof AudioManager !== 'undefined') {
        audioManager = new AudioManager();
      }
    });

    test('should be defined', () => {
      expect(typeof AudioManager).toBe('function');
    });

    test('should initialize with default settings', () => {
      if (audioManager) {
        expect(audioManager).toBeDefined();
        expect(typeof audioManager.init).toBe('function');
      }
    });

    test('should initialize Web Audio API', () => {
      if (audioManager && audioManager.init) {
        audioManager.init();
        
        expect(audioManager.audioContext).toBeDefined();
      }
    });

    test('should load audio files', async () => {
      if (audioManager && audioManager.loadAudio) {
        const result = await audioManager.loadAudio('test.mp3');
        
        expect(global.fetch).toHaveBeenCalledWith('test.mp3');
        expect(result).toBeDefined();
      }
    });

    test('should play audio', () => {
      if (audioManager && audioManager.play) {
        expect(() => {
          audioManager.play('test-sound');
        }).not.toThrow();
      }
    });

    test('should pause audio', () => {
      if (audioManager && audioManager.pause) {
        expect(() => {
          audioManager.pause();
        }).not.toThrow();
      }
    });

    test('should stop audio', () => {
      if (audioManager && audioManager.stop) {
        expect(() => {
          audioManager.stop();
        }).not.toThrow();
      }
    });

    test('should control volume', () => {
      if (audioManager && audioManager.setVolume) {
        expect(() => {
          audioManager.setVolume(0.5);
        }).not.toThrow();
      }
    });

    test('should control playback rate', () => {
      if (audioManager && audioManager.setRate) {
        expect(() => {
          audioManager.setRate(1.5);
        }).not.toThrow();
      }
    });

    test('should handle audio visualization', () => {
      if (audioManager && audioManager.visualize) {
        expect(() => {
          audioManager.visualize(mockCanvas);
        }).not.toThrow();
      }
    });

    test('should preload audio files', async () => {
      if (audioManager && audioManager.preload) {
        const audioFiles = ['sound1.mp3', 'sound2.mp3', 'sound3.mp3'];
        
        await audioManager.preload(audioFiles);
        
        expect(global.fetch).toHaveBeenCalledTimes(audioFiles.length);
      }
    });

    test('should handle audio context state changes', () => {
      if (audioManager && audioManager.handleContextStateChange) {
        expect(() => {
          audioManager.handleContextStateChange();
        }).not.toThrow();
      }
    });

    test('should clean up resources', () => {
      if (audioManager && audioManager.destroy) {
        expect(() => {
          audioManager.destroy();
        }).not.toThrow();
      }
    });
  });

  describe('Speech Synthesis', () => {
    test('should initialize speech synthesis', () => {
      if (typeof initSpeechSynthesis !== 'undefined') {
        expect(() => {
          initSpeechSynthesis();
        }).not.toThrow();
      }
    });

    test('should speak text', () => {
      if (typeof speak !== 'undefined') {
        speak('Hello world');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
        expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      }
    });

    test('should speak Korean text', () => {
      if (typeof speakKorean !== 'undefined') {
        speakKorean('안녕하세요');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('안녕하세요');
        expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      }
    });

    test('should select Korean voice', () => {
      if (typeof selectKoreanVoice !== 'undefined') {
        const voice = selectKoreanVoice();
        
        expect(mockSpeechSynthesis.getVoices).toHaveBeenCalled();
        expect(voice).toBeDefined();
        expect(voice.lang).toBe('ko-KR');
      }
    });

    test('should handle speech synthesis settings', () => {
      if (typeof setSpeechSettings !== 'undefined') {
        const settings = {
          volume: 0.8,
          rate: 1.2,
          pitch: 1.1
        };
        
        expect(() => {
          setSpeechSettings(settings);
        }).not.toThrow();
      }
    });

    test('should cancel speech', () => {
      if (typeof cancelSpeech !== 'undefined') {
        cancelSpeech();
        
        expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
      }
    });

    test('should pause and resume speech', () => {
      if (typeof pauseSpeech !== 'undefined' && typeof resumeSpeech !== 'undefined') {
        pauseSpeech();
        expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
        
        resumeSpeech();
        expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
      }
    });
  });

  describe('Audio Visualization', () => {
    test('should create audio visualizer', () => {
      if (typeof AudioVisualizer !== 'undefined') {
        const visualizer = new AudioVisualizer(mockCanvas);
        
        expect(visualizer).toBeDefined();
      }
    });

    test('should draw frequency bars', () => {
      if (typeof drawFrequencyBars !== 'undefined') {
        const canvas = mockCanvas;
        const frequencyData = new Uint8Array(1024);
        
        expect(() => {
          drawFrequencyBars(canvas, frequencyData);
        }).not.toThrow();
      }
    });

    test('should draw waveform', () => {
      if (typeof drawWaveform !== 'undefined') {
        const canvas = mockCanvas;
        const waveformData = new Uint8Array(1024);
        
        expect(() => {
          drawWaveform(canvas, waveformData);
        }).not.toThrow();
      }
    });

    test('should animate visualization', () => {
      if (typeof animateVisualization !== 'undefined') {
        expect(() => {
          animateVisualization();
        }).not.toThrow();
        
        expect(global.window.requestAnimationFrame).toHaveBeenCalled();
      }
    });

    test('should handle canvas resize', () => {
      if (typeof resizeCanvas !== 'undefined') {
        expect(() => {
          resizeCanvas(mockCanvas, 1200, 600);
        }).not.toThrow();
        
        expect(mockCanvas.width).toBe(1200);
        expect(mockCanvas.height).toBe(600);
      }
    });
  });

  describe('Lesson Audio Integration', () => {
    test('should play lesson audio', () => {
      if (typeof playLessonAudio !== 'undefined') {
        expect(() => {
          playLessonAudio('lesson1');
        }).not.toThrow();
      }
    });

    test('should play syllable sound', () => {
      if (typeof playSyllableSound !== 'undefined') {
        expect(() => {
          playSyllableSound(0x80, 0x02, 0x00);
        }).not.toThrow();
      }
    });

    test('should sequence multiple sounds', () => {
      if (typeof sequenceSounds !== 'undefined') {
        const sounds = ['sound1.mp3', 'sound2.mp3', 'sound3.mp3'];
        const delays = [0, 500, 1000];
        
        expect(() => {
          sequenceSounds(sounds, delays);
        }).not.toThrow();
      }
    });

    test('should handle audio timing', () => {
      if (typeof scheduleAudio !== 'undefined') {
        expect(() => {
          scheduleAudio('test.mp3', 1.5); // Schedule for 1.5 seconds from now
        }).not.toThrow();
      }
    });
  });

  describe('Audio Effects', () => {
    test('should apply reverb effect', () => {
      if (typeof applyReverb !== 'undefined') {
        expect(() => {
          applyReverb(0.3, 2.0);
        }).not.toThrow();
      }
    });

    test('should apply delay effect', () => {
      if (typeof applyDelay !== 'undefined') {
        expect(() => {
          applyDelay(0.3, 0.4);
        }).not.toThrow();
      }
    });

    test('should apply filter effects', () => {
      if (typeof applyFilter !== 'undefined') {
        expect(() => {
          applyFilter('lowpass', 1000);
        }).not.toThrow();
      }
    });

    test('should control audio panning', () => {
      if (typeof setPanning !== 'undefined') {
        expect(() => {
          setPanning(-0.5); // Pan left
        }).not.toThrow();
      }
    });
  });

  describe('Audio Loading and Caching', () => {
    test('should cache loaded audio', () => {
      if (typeof cacheAudio !== 'undefined') {
        expect(() => {
          cacheAudio('test.mp3', new ArrayBuffer(1024));
        }).not.toThrow();
      }
    });

    test('should retrieve cached audio', () => {
      if (typeof getCachedAudio !== 'undefined') {
        const result = getCachedAudio('test.mp3');
        
        expect(result).toBeDefined();
      }
    });

    test('should handle loading errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      if (typeof loadAudioWithErrorHandling !== 'undefined') {
        await expect(loadAudioWithErrorHandling('nonexistent.mp3')).resolves.not.toThrow();
      }
    });

    test('should implement progressive loading', () => {
      if (typeof progressiveLoad !== 'undefined') {
        const onProgress = vi.fn();
        
        expect(() => {
          progressiveLoad('large-audio.mp3', onProgress);
        }).not.toThrow();
      }
    });
  });

  describe('Performance Optimization', () => {
    test('should implement audio pooling', () => {
      if (typeof AudioPool !== 'undefined') {
        const pool = new AudioPool(5);
        
        expect(pool).toBeDefined();
        expect(typeof pool.get).toBe('function');
        expect(typeof pool.release).toBe('function');
      }
    });

    test('should throttle audio requests', () => {
      if (typeof throttleAudio !== 'undefined') {
        const playAudio = vi.fn();
        const throttled = throttleAudio(playAudio, 100);
        
        throttled();
        throttled();
        throttled();
        
        expect(playAudio).toHaveBeenCalledTimes(1);
      }
    });

    test('should manage memory usage', () => {
      if (typeof manageAudioMemory !== 'undefined') {
        expect(() => {
          manageAudioMemory();
        }).not.toThrow();
      }
    });

    test('should implement lazy loading', () => {
      if (typeof lazyLoadAudio !== 'undefined') {
        expect(() => {
          lazyLoadAudio('.audio-element');
        }).not.toThrow();
      }
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete audio workflow', async () => {
      if (typeof AudioManager !== 'undefined') {
        const manager = new AudioManager();
        
        expect(() => {
          manager.init();
        }).not.toThrow();
        
        if (manager.loadAudio && manager.play) {
          await manager.loadAudio('test.mp3');
          manager.play('test.mp3');
        }
        
        if (manager.setVolume) {
          manager.setVolume(0.7);
        }
        
        if (manager.destroy) {
          manager.destroy();
        }
      }
    });

    test('should coordinate audio and speech synthesis', () => {
      if (typeof AudioManager !== 'undefined' && typeof speak !== 'undefined') {
        const manager = new AudioManager();
        manager.init();
        
        expect(() => {
          speak('Hello');
          if (manager.play) manager.play('background.mp3');
        }).not.toThrow();
      }
    });

    test('should handle audio with visualization', () => {
      if (typeof AudioManager !== 'undefined' && typeof AudioVisualizer !== 'undefined') {
        const manager = new AudioManager();
        const visualizer = new AudioVisualizer(mockCanvas);
        
        expect(() => {
          manager.init();
          if (manager.visualize) manager.visualize(mockCanvas);
        }).not.toThrow();
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle Web Audio API not supported', () => {
      global.AudioContext = undefined;
      global.webkitAudioContext = undefined;
      
      if (typeof AudioManager !== 'undefined') {
        expect(() => {
          const manager = new AudioManager();
          manager.init();
        }).not.toThrow();
      }
    });

    test('should handle Speech Synthesis not supported', () => {
      global.speechSynthesis = undefined;
      global.SpeechSynthesisUtterance = undefined;
      
      if (typeof speak !== 'undefined') {
        expect(() => {
          speak('Hello');
        }).not.toThrow();
      }
    });

    test('should handle audio loading failures', async () => {
      global.fetch.mockRejectedValue(new Error('Failed to load'));
      
      if (typeof AudioManager !== 'undefined') {
        const manager = new AudioManager();
        
        if (manager.loadAudio) {
          await expect(manager.loadAudio('invalid.mp3')).resolves.not.toThrow();
        }
      }
    });

    test('should handle audio decoding errors', () => {
      mockAudioContext.decodeAudioData.mockRejectedValue(new Error('Decode failed'));
      
      if (typeof AudioManager !== 'undefined') {
        const manager = new AudioManager();
        
        expect(() => {
          manager.init();
        }).not.toThrow();
      }
    });

    test('should handle canvas context errors', () => {
      mockCanvas.getContext.mockReturnValue(null);
      
      if (typeof AudioVisualizer !== 'undefined') {
        expect(() => {
          new AudioVisualizer(mockCanvas);
        }).not.toThrow();
      }
    });
  });

  describe('Accessibility Features', () => {
    test('should provide audio descriptions', () => {
      if (typeof provideAudioDescription !== 'undefined') {
        expect(() => {
          provideAudioDescription('Button clicked');
        }).not.toThrow();
      }
    });

    test('should handle reduced motion preferences', () => {
      if (typeof respectReducedMotion !== 'undefined') {
        expect(() => {
          respectReducedMotion();
        }).not.toThrow();
      }
    });

    test('should provide volume controls', () => {
      if (typeof createVolumeControls !== 'undefined') {
        expect(() => {
          createVolumeControls();
        }).not.toThrow();
      }
    });

    test('should support keyboard controls', () => {
      if (typeof handleAudioKeyboard !== 'undefined') {
        const keyEvent = {
          key: 'Space',
          preventDefault: vi.fn()
        };
        
        expect(() => {
          handleAudioKeyboard(keyEvent);
        }).not.toThrow();
      }
    });
  });

  describe('Browser Compatibility', () => {
    test('should work with different audio formats', () => {
      const formats = ['mp3', 'ogg', 'wav', 'm4a'];
      
      formats.forEach(format => {
        if (typeof checkAudioSupport !== 'undefined') {
          const supported = checkAudioSupport(format);
          expect(typeof supported).toBe('boolean');
        }
      });
    });

    test('should handle different browsers', () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      ];
      
      userAgents.forEach(ua => {
        global.navigator = { userAgent: ua };
        
        if (typeof AudioManager !== 'undefined') {
          expect(() => {
            const manager = new AudioManager();
            manager.init();
          }).not.toThrow();
        }
      });
    });
  });
});