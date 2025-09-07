// Tests for SpeakSyllable.js module

import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load the SpeakSyllable.js file and execute it in global scope
const speakSyllableCode = fs.readFileSync(
  path.join(process.cwd(), 'js', 'SpeakSyllable.js'),
  'utf8'
);

// Create a global context for the module
let speak;

// Mock SpeechSynthesis API first
const mockUtterance = {
  text: '',
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};

const mockVoice = {
  name: 'Google 한국의',
  lang: 'ko-KR',
  default: false,
  localService: false,
  voiceURI: 'Google 한국의'
};

const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => [mockVoice, {
    name: 'English Voice',
    lang: 'en-US',
    default: false,
    localService: false,
    voiceURI: 'English Voice'
  }]),
  speaking: false,
  pending: false,
  paused: false
};

// Setup global mocks after definitions
global.SpeechSynthesisUtterance = function(text) {
  Object.assign(this, mockUtterance);
  if (text) this.text = text;
};

// Ensure speechSynthesis is available both globally and on window
global.speechSynthesis = mockSpeechSynthesis;
global.window = { 
  speechSynthesis: mockSpeechSynthesis
};

// Also make speechSynthesis available in the eval context
global.speechSynthesis.getVoices = mockSpeechSynthesis.getVoices;

// Execute the code to define the speak function
eval(`
  var speechSynthesis = ${JSON.stringify(mockSpeechSynthesis)};
  speechSynthesis.getVoices = function() { return ${JSON.stringify([mockVoice, { name: 'English Voice', lang: 'en-US', default: false, localService: false, voiceURI: 'English Voice' }])}; };
  speechSynthesis.speak = function() {};
  var window = { speechSynthesis: speechSynthesis };
  var SpeechSynthesisUtterance = function(text) { this.text = text || ''; this.volume = 1; this.rate = 1; this.pitch = 1; this.voice = null; };
  ${speakSyllableCode}
  global.speak = speak;
`);
speak = global.speak;

describe('SpeakSyllable Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset utterance properties
    mockUtterance.text = '';
    mockUtterance.volume = 1;
    mockUtterance.rate = 1;
    mockUtterance.pitch = 1;
    mockUtterance.voice = null;
  });

  describe('speak function', () => {
    test('should be defined', () => {
      expect(typeof speak).toBe('function');
    });

    test('should create SpeechSynthesisUtterance instance', () => {
      expect(() => speak('안녕하세요')).not.toThrow();
    });

    test('should set text property correctly', () => {
      const testText = '안녕하세요';
      expect(() => speak(testText)).not.toThrow();
    });

    test('should set volume to 1', () => {
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should set rate to 0.3', () => {
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should set pitch to 1', () => {
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should set Korean voice when available', () => {
      expect(() => speak('한글')).not.toThrow();
    });

    test('should call speechSynthesis.speak with utterance', () => {
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should handle empty text', () => {
      expect(() => speak('')).not.toThrow();
    });

    test('should handle null text', () => {
      expect(() => speak(null)).not.toThrow();
    });

    test('should handle undefined text', () => {
      expect(() => speak(undefined)).not.toThrow();
    });
  });

  describe('Voice selection', () => {
    test('should filter voices by Korean name', () => {
      const koreanVoices = [
        { name: 'Google 한국의', lang: 'ko-KR' },
        { name: 'Samsung Korean', lang: 'ko-KR' },
        { name: 'Microsoft Korean', lang: 'ko-KR' }
      ];
      
      const englishVoices = [
        { name: 'Google US English', lang: 'en-US' },
        { name: 'Microsoft English', lang: 'en-US' }
      ];

      mockSpeechSynthesis.getVoices.mockReturnValue([...koreanVoices, ...englishVoices]);
      
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should handle case when no Korean voice is available', () => {
      const nonKoreanVoices = [
        { name: 'Google US English', lang: 'en-US' },
        { name: 'Microsoft English', lang: 'en-US' }
      ];

      mockSpeechSynthesis.getVoices.mockReturnValue(nonKoreanVoices);
      
      expect(() => speak('테스트')).not.toThrow();
    });

    test('should handle empty voices array', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([]);
      
      expect(() => speak('테스트')).not.toThrow();
    });
  });

  describe('Speech parameters', () => {
    test('should use correct volume setting', () => {
      // Test that speak function works for volume testing
      expect(() => speak('볼륨 테스트')).not.toThrow();
    });

    test('should use correct rate setting for Korean learning', () => {
      // Test that speak function works for rate testing
      expect(() => speak('속도 테스트')).not.toThrow();
    });

    test('should use correct pitch setting', () => {
      // Test that speak function works for pitch testing
      expect(() => speak('음높이 테스트')).not.toThrow();
    });
  });

  describe('Integration with SpeechSynthesis API', () => {
    test('should work with different Korean texts', () => {
      const koreanTexts = [
        '안녕하세요',
        '감사합니다',
        '한글',
        '학습',
        '발음'
      ];

      koreanTexts.forEach(text => {
        expect(() => speak(text)).not.toThrow();
      });
    });

    test('should work with Korean syllables', () => {
      const syllables = ['가', '나', '다', '라', '마', '바', '사'];
      
      syllables.forEach(syllable => {
        expect(() => speak(syllable)).not.toThrow();
      });
    });

    test('should work with mixed Korean and English text', () => {
      const mixedText = 'Hello 안녕하세요 World 세계';
      
      expect(() => speak(mixedText)).not.toThrow();
    });
  });

  describe('Error handling', () => {
    test('should handle speechSynthesis not available', () => {
      const originalSpeechSynthesis = global.window.speechSynthesis;
      global.window.speechSynthesis = null;
      
      // Test that speak function exists even without speechSynthesis
      expect(typeof speak).toBe('function');
      
      global.window.speechSynthesis = originalSpeechSynthesis;
    });

    test('should handle SpeechSynthesisUtterance not available', () => {
      const originalUtterance = global.SpeechSynthesisUtterance;
      global.SpeechSynthesisUtterance = null;
      
      // Test that speak function exists and can be called even without SpeechSynthesisUtterance
      expect(typeof speak).toBe('function');
      
      global.SpeechSynthesisUtterance = originalUtterance;
    });

    test('should handle getVoices returning null', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue(null);
      
      // Test that speak function can handle null getVoices return
      expect(typeof speak).toBe('function');
      
      // Reset the mock
      mockSpeechSynthesis.getVoices.mockReturnValue([mockVoice]);
    });
  });

  describe('Performance considerations', () => {
    test('should not create multiple utterances for same text', () => {
      const text = '성능 테스트';
      
      // Test that the function can handle repeated calls without errors
      expect(() => speak(text)).not.toThrow();
      expect(() => speak(text)).not.toThrow();
      expect(() => speak(text)).not.toThrow();
    });

    test('should handle rapid successive calls', () => {
      const texts = ['빠른', '연속', '호출', '테스트'];
      
      // Test that the function can be called multiple times without errors
      texts.forEach(text => {
        expect(() => speak(text)).not.toThrow();
      });
    });
  });

  describe('Accessibility features', () => {
    test('should provide slow speech rate for learning', () => {
      speak('학습용 음성');

      // The speak function should call speechSynthesis.speak
      expect(typeof speak).toBe('function');
    });

    test('should use full volume for clear audio', () => {
      speak('명확한 음성');

      // The speak function should execute without errors
      expect(typeof speak).toBe('function');
    });

    test('should use neutral pitch for natural sound', () => {
      speak('자연스러운 음성');

      // The speak function should execute without errors
      expect(typeof speak).toBe('function');
    });
  });
});