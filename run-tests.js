/**
 * Test runner script
 * 
 * This script runs the Jest tests and generates a coverage report.
 * It can be used as an alternative to running npm test directly.
 */

const { execSync } = require('child_process');

console.log('Running tests with coverage report...');

try {
  // Run Jest with coverage
  execSync('npx jest --coverage', { stdio: 'inherit' });
  console.log('\nTests completed successfully!');
  console.log('Coverage report is available in the coverage directory.');
} catch (error) {
  console.error('\nTests failed with errors.');
  process.exit(1);
}