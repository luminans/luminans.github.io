/**
 * Deployment script to remove test files from production deployment
 * 
 * This script removes test-related files and directories that are not needed
 * in the production environment.
 */

const fs = require('fs');
const path = require('path');

// Files and directories to remove during deployment
const testFilesToRemove = [
  // Test directories
  'tests',
  'coverage',
  'node_modules',
  
  // Test configuration files
  'jest.config.js',
  'package.json',
  'package-lock.json',
  
  // This deployment script itself
  'deploy.js'
];

// Function to recursively delete a directory
function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call for directories
        deleteDirectory(curPath);
      } else {
        // Delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
    console.log(`Removed directory: ${directoryPath}`);
  }
}

// Function to delete a file
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Removed file: ${filePath}`);
  }
}

// Main function to clean up test files
function cleanupTestFiles() {
  console.log('Starting deployment cleanup...');
  
  testFilesToRemove.forEach((item) => {
    const itemPath = path.join(__dirname, item);
    
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        deleteDirectory(itemPath);
      } else {
        deleteFile(itemPath);
      }
    } else {
      console.log(`Item not found: ${itemPath}`);
    }
  });
  
  console.log('Deployment cleanup completed!');
}

// Run the cleanup
cleanupTestFiles();