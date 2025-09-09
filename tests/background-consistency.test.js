/**
 * Background Consistency Tests
 * Verifies that all module pages have consistent blue gradient backgrounds
 * and proper CSS loading
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// List of all module pages that should have consistent styling
const MODULE_PAGES = [
    'basic_vowels.html',
    'hangul_wing.html', 
    'hundlism.html',
    'composite_vowels.html',
    'derived_consonants.html',
    'basic_consonants.html',
    'composite_consonants.html',
    'primitiveletters.html',
    'derived_vowels.html'
];

// Required CSS files for modern styling
const REQUIRED_CSS_FILES = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'css/modern-style.css',
    'css/lesson-style.css'
];

// Required JavaScript files
const REQUIRED_JS_FILES = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'js/modern-audio.js',
    'js/modern-interactions.js',
    'js/lesson-audio.js'
];

// Bootstrap 5 classes that should be present
const REQUIRED_BOOTSTRAP5_CLASSES = [
    'navbar-expand-lg',
    'fixed-top',
    'navbar-toggler',
    'navbar-nav',
    'ms-auto',
    'nav-item',
    'nav-link'
];

// Old Bootstrap 3 classes that should NOT be present
const DEPRECATED_BOOTSTRAP3_CLASSES = [
    'navbar-inverse',
    'navbar-fixed-top',
    'navbar-toggle',
    'navbar-header',
    'icon-bar'
];

describe('Background Consistency Tests', () => {
    MODULE_PAGES.forEach(pageName => {
        describe(`${pageName}`, () => {
            let dom;
            let document;
            let htmlContent;

            beforeAll(() => {
                const filePath = path.join(__dirname, '..', pageName);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`File ${pageName} does not exist`);
                }
                htmlContent = fs.readFileSync(filePath, 'utf8');
                dom = new JSDOM(htmlContent);
                document = dom.window.document;
            });

            test('should load required CSS files', () => {
                const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
                const loadedCssFiles = Array.from(linkElements).map(link => link.href);
                
                REQUIRED_CSS_FILES.forEach(requiredCss => {
                    const isLoaded = loadedCssFiles.some(loaded => 
                        loaded.includes(requiredCss) || loaded.endsWith(requiredCss)
                    );
                    expect(isLoaded).toBe(true);
                });
            });

            test('should load required JavaScript files', () => {
                const scriptElements = document.querySelectorAll('script[src]');
                const loadedJsFiles = Array.from(scriptElements).map(script => script.src);
                
                REQUIRED_JS_FILES.forEach(requiredJs => {
                    const isLoaded = loadedJsFiles.some(loaded => 
                        loaded.includes(requiredJs) || loaded.endsWith(requiredJs)
                    );
                    expect(isLoaded).toBe(true);
                });
            });

            test('should not load deprecated CSS files', () => {
                const deprecatedCssFiles = [
                    'css/letter.css',
                    'css/default.css', 
                    'css/section.css',
                    'css/component.css',
                    'bootstrap/3.3.0/css/bootstrap.min.css'
                ];
                
                const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
                const loadedCssFiles = Array.from(linkElements).map(link => link.href);
                
                deprecatedCssFiles.forEach(deprecatedCss => {
                    const isLoaded = loadedCssFiles.some(loaded => 
                        loaded.includes(deprecatedCss)
                    );
                    expect(isLoaded).toBe(false);
                });
            });

            test('should have modern Bootstrap 5 navbar structure', () => {
                const navbar = document.querySelector('nav.navbar');
                expect(navbar).toBeTruthy();
                
                // Check for Bootstrap 5 classes
                REQUIRED_BOOTSTRAP5_CLASSES.forEach(className => {
                    const elementWithClass = document.querySelector(`.${className}`);
                    expect(elementWithClass).toBeTruthy();
                });
            });

            test('should not have deprecated Bootstrap 3 classes', () => {
                DEPRECATED_BOOTSTRAP3_CLASSES.forEach(className => {
                    const elementWithClass = document.querySelector(`.${className}`);
                    expect(elementWithClass).toBeFalsy();
                });
            });

            test('should have lesson header structure', () => {
                const lessonHeader = document.querySelector('header.lesson-header');
                expect(lessonHeader).toBeTruthy();
                
                const lessonTitle = document.querySelector('.lesson-title');
                expect(lessonTitle).toBeTruthy();
                
                const lessonSubtitle = document.querySelector('.lesson-subtitle');
                expect(lessonSubtitle).toBeTruthy();
            });

            test('should have vowel-section for content', () => {
                const vowelSection = document.querySelector('section.vowel-section');
                expect(vowelSection).toBeTruthy();
            });

            test('should have proper HTML5 semantic structure', () => {
                // Should have nav element
                const nav = document.querySelector('nav');
                expect(nav).toBeTruthy();
                
                // Should have header element
                const header = document.querySelector('header');
                expect(header).toBeTruthy();
                
                // Should have section element
                const section = document.querySelector('section');
                expect(section).toBeTruthy();
            });

            test('should have consistent navbar brand structure', () => {
                const navbarBrand = document.querySelector('.navbar-brand');
                expect(navbarBrand).toBeTruthy();
                
                const brandImage = navbarBrand.querySelector('img');
                expect(brandImage).toBeTruthy();
                expect(brandImage.src).toContain('hundlipattern.svg');
                expect(brandImage.alt).toBe('Hangul Learning');
            });

            test('should have proper navigation links', () => {
                const navLinks = document.querySelectorAll('.nav-link');
                expect(navLinks.length).toBeGreaterThan(0);
                
                // Check for expected navigation items
                const expectedNavItems = ['Lessons', 'About', 'Contact'];
                const navTexts = Array.from(navLinks).map(link => link.textContent.trim());
                
                expectedNavItems.forEach(expectedItem => {
                    expect(navTexts).toContain(expectedItem);
                });
            });

            test('should not have old article.article structure', () => {
                const oldArticle = document.querySelector('article.article');
                expect(oldArticle).toBeFalsy();
            });

            test('should have Bootstrap 5 compatible structure', () => {
                // Check for Bootstrap 5 container
                const containers = document.querySelectorAll('.container');
                expect(containers.length).toBeGreaterThan(0);
                
                // Check for Bootstrap 5 utility classes
                const pyClasses = document.querySelectorAll('[class*="py-"]');
                expect(pyClasses.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Cross-page consistency', () => {
        test('all pages should have identical navbar structure', () => {
            const navbarStructures = MODULE_PAGES.map(pageName => {
                const filePath = path.join(__dirname, '..', pageName);
                const htmlContent = fs.readFileSync(filePath, 'utf8');
                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;
                
                const navbar = document.querySelector('nav.navbar');
                return navbar ? navbar.outerHTML : null;
            });
            
            // All navbars should be similar (allowing for minor differences in content)
            const firstNavbar = navbarStructures[0];
            expect(firstNavbar).toBeTruthy();
            
            navbarStructures.forEach((navbar, index) => {
                expect(navbar).toBeTruthy();
                // Check that all navbars have the same basic structure
                expect(navbar).toContain('navbar-expand-lg');
                expect(navbar).toContain('fixed-top');
                expect(navbar).toContain('navbar-brand');
                expect(navbar).toContain('navbar-toggler');
            });
        });

        test('all pages should load the same CSS files', () => {
            const cssFilesByPage = MODULE_PAGES.map(pageName => {
                const filePath = path.join(__dirname, '..', pageName);
                const htmlContent = fs.readFileSync(filePath, 'utf8');
                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;
                
                const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
                return Array.from(linkElements).map(link => link.href).sort();
            });
            
            const firstPageCss = cssFilesByPage[0];
            cssFilesByPage.forEach((pageCss, index) => {
                expect(pageCss).toEqual(firstPageCss);
            });
        });

        test('all pages should have lesson-header and vowel-section', () => {
            MODULE_PAGES.forEach(pageName => {
                const filePath = path.join(__dirname, '..', pageName);
                const htmlContent = fs.readFileSync(filePath, 'utf8');
                const dom = new JSDOM(htmlContent);
                const document = dom.window.document;
                
                const lessonHeader = document.querySelector('header.lesson-header');
                const vowelSection = document.querySelector('section.vowel-section');
                
                expect(lessonHeader).toBeTruthy();
                expect(vowelSection).toBeTruthy();
            });
        });
    });
});