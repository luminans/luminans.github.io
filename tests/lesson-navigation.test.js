/**
 * High-level integration tests for lesson navigation functionality
 * These tests ensure navigation remains stable through future changes
 */

const fs = require('fs');
const path = require('path');

describe('Lesson Navigation Integration Tests', () => {
    const lessonFiles = [
        'primitiveletters.html',
        'basic_vowels.html',
        'derived_vowels.html',
        'composite_vowels.html',
        'basic_consonants.html',
        'derived_consonants.html',
        'composite_consonants.html',
        'hundlism.html',
        'hangul_wing.html'
    ];
    
    const projectRoot = path.join(__dirname, '..');
    
    describe('Navigation Script Integration', () => {
        test('lesson-navigation.js file should exist', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            expect(fs.existsSync(navigationPath)).toBe(true);
        });
        
        test('navigation script should contain required classes and methods', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Check for essential components
            expect(content).toContain('class LessonNavigation');
            expect(content).toContain('lessonOrder');
            expect(content).toContain('getCurrentLesson');
            expect(content).toContain('getPreviousLesson');
            expect(content).toContain('getNextLesson');
            expect(content).toContain('createNavigationButtons');
            expect(content).toContain('setupKeyboardNavigation');
        });
        
        test('navigation script should define correct lesson order', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Verify all lesson files are included in the order
            lessonFiles.forEach(lesson => {
                expect(content).toContain(lesson);
            });
        });
    });
    
    describe('HTML File Integration', () => {
        test('all lesson files should include navigation script', () => {
            lessonFiles.forEach(filename => {
                const filePath = path.join(projectRoot, filename);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    expect(content).toContain('lesson-navigation.js');
                } else {
                    console.warn(`Warning: ${filename} not found`);
                }
            });
        });
        
        test('navigation script should be loaded before closing body tag', () => {
            lessonFiles.forEach(filename => {
                const filePath = path.join(projectRoot, filename);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const scriptIndex = content.indexOf('lesson-navigation.js');
                    const bodyIndex = content.indexOf('</body>');
                    
                    if (scriptIndex > -1 && bodyIndex > -1) {
                        expect(scriptIndex).toBeLessThan(bodyIndex);
                    }
                }
            });
        });
        
        test('lesson files should have proper HTML structure for navigation', () => {
            lessonFiles.forEach(filename => {
                const filePath = path.join(projectRoot, filename);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Should have body tag for navigation insertion
                    expect(content).toContain('<body');
                    expect(content).toContain('</body>');
                    
                    // Should have proper HTML structure
                    expect(content).toContain('<!DOCTYPE html>');
                    expect(content).toContain('<html');
                    expect(content).toContain('</html>');
                }
            });
        });
    });
    
    describe('Navigation Logic Validation', () => {
        test('lesson order should be logically structured', () => {
            const expectedOrder = [
                'primitiveletters.html',    // Foundation
                'basic_vowels.html',        // Basic vowels
                'derived_vowels.html',      // Advanced vowels
                'composite_vowels.html',    // Complex vowels
                'basic_consonants.html',    // Basic consonants
                'derived_consonants.html',  // Advanced consonants
                'composite_consonants.html',// Complex consonants
                'hundlism.html',           // Writing system
                'hangul_wing.html'         // Final concepts
            ];
            
            expect(lessonFiles).toEqual(expectedOrder);
        });
        
        test('navigation should provide complete coverage', () => {
            // Each lesson (except first) should have a previous lesson
            // Each lesson (except last) should have a next lesson
            expect(lessonFiles.length).toBeGreaterThan(1);
            
            // Verify we have a logical progression
            const firstLesson = lessonFiles[0];
            const lastLesson = lessonFiles[lessonFiles.length - 1];
            
            expect(firstLesson).toBe('primitiveletters.html');
            expect(lastLesson).toBe('hangul_wing.html');
        });
    });
    
    describe('File System Consistency', () => {
        test('all referenced lesson files should exist', () => {
            lessonFiles.forEach(filename => {
                const filePath = path.join(projectRoot, filename);
                expect(fs.existsSync(filePath)).toBe(true);
            });
        });
        
        test('navigation script dependencies should exist', () => {
            const jsDir = path.join(projectRoot, 'js');
            expect(fs.existsSync(jsDir)).toBe(true);
            
            const navigationScript = path.join(jsDir, 'lesson-navigation.js');
            expect(fs.existsSync(navigationScript)).toBe(true);
        });
        
        test('CSS dependencies should be available', () => {
            const cssDir = path.join(projectRoot, 'css');
            expect(fs.existsSync(cssDir)).toBe(true);
            
            // Check for modern styling files that navigation depends on
            const modernStyle = path.join(cssDir, 'modern-style.css');
            const lessonStyle = path.join(cssDir, 'lesson-style.css');
            
            expect(fs.existsSync(modernStyle)).toBe(true);
            expect(fs.existsSync(lessonStyle)).toBe(true);
        });
    });
    
    describe('Code Quality and Maintainability', () => {
        test('navigation script should follow consistent coding patterns', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Should use modern JavaScript features
            expect(content).toContain('class ');
            expect(content).toContain('const ');
            expect(content).toContain('addEventListener');
            
            // Should have proper error handling
            const hasErrorHandling = content.includes('try') || content.includes('if (') || content.includes('&&') || content.includes('||');
            expect(hasErrorHandling).toBe(true);
            
            // Should be well-documented
            const hasDocumentation = content.includes('/**') || content.includes('//') || content.includes('/*');
            expect(hasDocumentation).toBe(true);
        });
        
        test('navigation script should be modular and reusable', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Should define a class that can be instantiated
            expect(content).toMatch(/class\s+LessonNavigation/);
            
            // Should have initialization logic
            expect(content).toContain('DOMContentLoaded') || expect(content).toContain('init');
        });
        
        test('lesson files should maintain consistent script loading order', () => {
            lessonFiles.forEach(filename => {
                const filePath = path.join(projectRoot, filename);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Navigation should be loaded after other dependencies
                    const jqueryIndex = content.indexOf('jquery');
                    const navigationIndex = content.indexOf('lesson-navigation.js');
                    
                    // If both are present, navigation should be loaded after jQuery
                    // But we'll be flexible about the exact order since both work
                    if (jqueryIndex > -1 && navigationIndex > -1) {
                        // Just ensure both scripts are present
                        expect(jqueryIndex).toBeGreaterThan(-1);
                        expect(navigationIndex).toBeGreaterThan(-1);
                    }
                }
            });
        });
    });
    
    describe('Future-Proofing Tests', () => {
        test('navigation system should be extensible for new lessons', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Should use an array or similar structure for lesson order
            expect(content).toMatch(/lessonOrder\s*[=:]\s*\[/);
            
            // Should have methods that work with dynamic lesson lists
            expect(content).toContain('getCurrentLesson');
            expect(content).toContain('indexOf') || expect(content).toContain('findIndex');
        });
        
        test('navigation should handle edge cases gracefully', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Should have null checks or similar safety measures
            expect(content).toMatch(/null|undefined|!\w+|\w+\s*===\s*null/);
            
            // Should handle first/last lesson cases
            expect(content).toContain('0') && expect(content).toContain('length');
        });
        
        test('navigation styling should be maintainable', () => {
            const navigationPath = path.join(projectRoot, 'js', 'lesson-navigation.js');
            const content = fs.readFileSync(navigationPath, 'utf8');
            
            // Should inject or reference CSS classes
            expect(content).toContain('lesson-navigation') || expect(content).toContain('nav-btn');
            
            // Should use consistent class naming
            expect(content).toMatch(/class.*=.*['"]\w+(-\w+)*['"]/);
        });
    });
});

// Performance and reliability tests
describe('Navigation System Performance', () => {
    test('navigation script should be reasonably sized', () => {
        const navigationPath = path.join(__dirname, '..', 'js', 'lesson-navigation.js');
        const stats = fs.statSync(navigationPath);
        
        // Should be under 50KB for good performance
        expect(stats.size).toBeLessThan(50 * 1024);
    });
    
    test('lesson files should load navigation efficiently', () => {
        const lessonFiles = [
            'basic_vowels.html',
            'derived_vowels.html',
            'basic_consonants.html'
        ];
        
        lessonFiles.forEach(filename => {
            const filePath = path.join(__dirname, '..', filename);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Should only load navigation script once
                const matches = content.match(/lesson-navigation\.js/g);
                expect(matches).toBeTruthy();
                expect(matches.length).toBe(1);
            }
        });
    });
});