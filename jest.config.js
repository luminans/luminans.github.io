module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '.'],
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Disable coverage collection temporarily to avoid conflicts
  collectCoverage: false,
  
  // No setup files to avoid conflicts with Jest's expect module
  // setupFilesAfterEnv: [],
  
  // Transform files with babel-jest
  transform: {},
  
  // Enable verbose output for detailed test results
  verbose: true,
  
  // Run all test files
  testMatch: ['**/tests/**/*.test.js'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetModules: true
};