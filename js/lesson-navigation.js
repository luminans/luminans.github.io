// Lesson Navigation Component

class LessonNavigation {
    constructor() {
        this.lessonOrder = [
            'hundlism.html',
            'primitiveletters.html', 
            'basic_vowels.html',
            'basic_consonants.html',
            'derived_vowels.html',
            'derived_consonants.html',
            'composite_vowels.html',
            'composite_consonants.html',
            'hangul_wing.html'
        ];
        
        this.init();
    }

    init() {
        this.createNavigationButtons();
        this.setupKeyboardNavigation();
    }

    getCurrentLesson() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        return currentFile;
    }

    getCurrentIndex() {
        const currentLesson = this.getCurrentLesson();
        return this.lessonOrder.indexOf(currentLesson);
    }

    getPreviousLesson() {
        const currentIndex = this.getCurrentIndex();
        if (currentIndex > 0) {
            return this.lessonOrder[currentIndex - 1];
        }
        return null;
    }

    getNextLesson() {
        const currentIndex = this.getCurrentIndex();
        if (currentIndex < this.lessonOrder.length - 1) {
            return this.lessonOrder[currentIndex + 1];
        }
        return null;
    }

    getLessonTitle(filename) {
        const titles = {
            'hundlism.html': 'Hundlism',
            'primitiveletters.html': 'Primitive Letters',
            'basic_vowels.html': 'Basic Vowels',
            'basic_consonants.html': 'Basic Consonants',
            'derived_vowels.html': 'Derived Vowels',
            'derived_consonants.html': 'Derived Consonants',
            'composite_vowels.html': 'Composite Vowels',
            'composite_consonants.html': 'Composite Consonants',
            'hangul_wing.html': 'Hangul Wing'
        };
        return titles[filename] || filename;
    }

    createNavigationButtons() {
        const previousLesson = this.getPreviousLesson();
        const nextLesson = this.getNextLesson();
        
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'lesson-navigation py-4';
        navContainer.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-6">
                        ${previousLesson ? `
                            <button class="btn btn-outline-light btn-lg lesson-nav-btn" onclick="navigateToLesson('${previousLesson}')">
                                <i class="fas fa-chevron-left me-2"></i>
                                <div class="nav-text">
                                    <small class="d-block">Previous</small>
                                    <span>${this.getLessonTitle(previousLesson)}</span>
                                </div>
                            </button>
                        ` : ''}
                    </div>
                    <div class="col-6 text-end">
                        ${nextLesson ? `
                            <button class="btn btn-primary btn-lg lesson-nav-btn" onclick="navigateToLesson('${nextLesson}')">
                                <div class="nav-text">
                                    <small class="d-block">Next</small>
                                    <span>${this.getLessonTitle(nextLesson)}</span>
                                </div>
                                <i class="fas fa-chevron-right ms-2"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 text-center">
                        <div class="lesson-progress">
                            <span class="progress-text">Lesson ${this.getCurrentIndex() + 1} of ${this.lessonOrder.length}</span>
                            <div class="progress mt-2">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${((this.getCurrentIndex() + 1) / this.lessonOrder.length) * 100}%"
                                     aria-valuenow="${this.getCurrentIndex() + 1}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="${this.lessonOrder.length}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.getElementById('footer_pane');
        if (footer) {
            footer.parentNode.insertBefore(navContainer, footer);
        } else {
            // If no footer, append to body
            document.body.appendChild(navContainer);
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + Left Arrow = Previous lesson
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                const previousLesson = this.getPreviousLesson();
                if (previousLesson) {
                    this.navigateToLesson(previousLesson);
                }
            }
            
            // Alt + Right Arrow = Next lesson
            if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                const nextLesson = this.getNextLesson();
                if (nextLesson) {
                    this.navigateToLesson(nextLesson);
                }
            }
        });
    }

    navigateToLesson(lesson) {
        // Add transition effect
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = lesson;
        }, 150);
    }
}

// Global navigation function
function navigateToLesson(lesson) {
    if (window.lessonNav) {
        window.lessonNav.navigateToLesson(lesson);
    } else {
        window.location.href = lesson;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lessonNav = new LessonNavigation();
});

// CSS Styles for navigation
const navigationStyles = `
    .lesson-navigation {
        background: rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .lesson-nav-btn {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        transition: all 0.3s ease;
        text-decoration: none;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        width: 100%;
        justify-content: center;
    }
    
    .lesson-nav-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
    }
    
    .lesson-nav-btn.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: white;
    }
    
    .lesson-nav-btn.btn-primary:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        transform: translateY(-3px);
    }
    
    .nav-text {
        text-align: left;
    }
    
    .nav-text small {
        opacity: 0.8;
        font-size: 0.75rem;
    }
    
    .nav-text span {
        font-weight: 600;
        font-size: 1rem;
    }
    
    .lesson-progress {
        max-width: 300px;
        margin: 0 auto;
    }
    
    .progress-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
    }
    
    .progress {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .progress-bar {
        background: linear-gradient(90deg, #667eea, #764ba2);
        transition: width 0.6s ease;
    }
    
    @media (max-width: 768px) {
        .lesson-nav-btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
        }
        
        .nav-text span {
            font-size: 0.9rem;
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = navigationStyles;
    document.head.appendChild(styleSheet);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LessonNavigation, navigateToLesson };
}