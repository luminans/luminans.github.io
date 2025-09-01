// Vitest test file - mocks are handled in vitest-setup.js

describe('Simple Test Suite', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have jQuery available', () => {
    expect($).toBeDefined();
    expect(jQuery).toBeDefined();
  });

  test('should have Audio mock available', () => {
    const audio = new Audio();
    expect(audio.play).toBeDefined();
    expect(typeof audio.play).toBe('function');
  });

  test('should have SpeechSynthesis mock available', () => {
    expect(speechSynthesis).toBeDefined();
    expect(speechSynthesis.speak).toBeDefined();
  });
});
