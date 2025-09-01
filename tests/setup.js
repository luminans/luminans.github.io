// Jest setup file

// Mock browser globals
global.window = global.window || {};
global.document = global.document || {};

// Mock jQuery if not available
if (!global.$) {
  global.$ = jest.fn();
}

// Mock Audio API
if (!global.Audio) {
  global.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn()
  }));
}

// Mock Speech Synthesis API
if (!global.SpeechSynthesisUtterance) {
  global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
    text: '',
    volume: 0,
    rate: 0,
    pitch: 0,
    voice: null
  }));

  global.speechSynthesis = {
    speak: jest.fn(),
    getVoices: jest.fn().mockReturnValue([])
  };
}
