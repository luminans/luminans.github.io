// Modern Interactions for Hangul Learning

class InteractionManager {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupTouchGestures();
        this.setupAnimations();
        this.setupAccessibility();
        this.setupPerformance();
    }

    setupScrollEffects() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.getElementById('mainNav');
        
        // Navbar background effect
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = scrollTop * 0.5;
            heroSection.style.transform = `translateY(${scrolled}px)`;
        }

        // Fade in elements on scroll
        this.animateOnScroll();

        this.lastScrollTop = scrollTop;
    }

    setupTouchGestures() {
        // Touch gestures for mobile
        let touchStartY = 0;
        let touchStartX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            if (!touchStartY || !touchStartX) return;

            const touchEndY = e.touches[0].clientY;
            const touchEndX = e.touches[0].clientX;
            const diffY = touchStartY - touchEndY;
            const diffX = touchStartX - touchEndX;

            // Swipe up gesture
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
                this.handleSwipeUp();
            }

            // Swipe down gesture
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
                this.handleSwipeDown();
            }
        });

        document.addEventListener('touchend', () => {
            touchStartY = 0;
            touchStartX = 0;
        });
    }

    handleSwipeUp() {
        // Navigate to next section
        const currentSection = this.getCurrentSection();
        const nextSection = currentSection.nextElementSibling;
        if (nextSection && nextSection.tagName === 'SECTION') {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleSwipeDown() {
        // Navigate to previous section
        const currentSection = this.getCurrentSection();
        const prevSection = currentSection.previousElementSibling;
        if (prevSection && prevSection.tagName === 'SECTION') {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollTop = window.pageYOffset;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                return section;
            }
        }
        
        return sections[0];
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.lesson-card, .section-title, .about-section img').forEach(el => {
            observer.observe(el);
        });
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.scrollToPreviousSection();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.scrollToNextSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'End':
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    break;
            }
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('lesson-card')) {
                e.target.classList.add('focused');
            }
        });

        document.addEventListener('focusout', (e) => {
            if (e.target.classList.contains('lesson-card')) {
                e.target.classList.remove('focused');
            }
        });
    }

    scrollToPreviousSection() {
        const currentSection = this.getCurrentSection();
        const prevSection = currentSection.previousElementSibling;
        if (prevSection && prevSection.tagName === 'SECTION') {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToNextSection() {
        const currentSection = this.getCurrentSection();
        const nextSection = currentSection.nextElementSibling;
        if (nextSection && nextSection.tagName === 'SECTION') {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupPerformance() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        });

        // Lazy load images
        this.setupLazyLoading();
    }

    handleScrollEnd() {
        // Handle scroll end events
        this.isScrolling = false;
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Lesson Card Interactions
class LessonCardManager {
    constructor() {
        this.activeCard = null;
        this.init();
    }

    init() {
        this.setupCardInteractions();
        this.setupAudioPreview();
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.lesson-card');
        
        cards.forEach(card => {
            // Hover effects
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.handleCardLeave(card);
            });

            // Touch interactions
            card.addEventListener('touchstart', (e) => {
                this.handleCardTouchStart(card, e);
            });

            card.addEventListener('touchend', (e) => {
                this.handleCardTouchEnd(card, e);
            });

            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardActivation(card);
                }
            });
        });
    }

    handleCardHover(card) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
    }

    handleCardLeave(card) {
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    handleCardTouchStart(card, e) {
        card.style.transform = 'scale(0.98)';
        this.touchStartTime = Date.now();
    }

    handleCardTouchEnd(card, e) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        if (touchDuration < 200) {
            // Quick tap - activate card
            this.handleCardActivation(card);
        }
        
        card.style.transform = '';
    }

    handleCardActivation(card) {
        // Add activation animation
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.transition = '';
            
            // Navigate to lesson
            const lessonLink = card.getAttribute('onclick');
            if (lessonLink) {
                const page = lessonLink.match(/['"]([^'"]+)['"]/)[1];
                window.location.href = page;
            }
        }, 100);
    }

    setupAudioPreview() {
        const audioButtons = document.querySelectorAll('.btn[onclick*="playLessonAudio"]');
        
        audioButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Add button feedback
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }
}

// Progress Tracking
class ProgressManager {
    constructor() {
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupProgressTracking();
        this.updateProgressDisplay();
    }

    loadProgress() {
        const saved = localStorage.getItem('hangulProgress');
        return saved ? JSON.parse(saved) : {
            completedLessons: [],
            currentLesson: null,
            totalTime: 0,
            lastVisit: null
        };
    }

    saveProgress() {
        localStorage.setItem('hangulProgress', JSON.stringify(this.progress));
    }

    setupProgressTracking() {
        // Track lesson completion
        document.querySelectorAll('.lesson-card').forEach(card => {
            const lessonId = this.getLessonId(card);
            if (this.progress.completedLessons.includes(lessonId)) {
                card.classList.add('completed');
                this.addCompletionBadge(card);
            }
        });

        // Track time spent
        this.startTimeTracking();
    }

    getLessonId(card) {
        const onclick = card.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/['"]([^'"]+)['"]/);
            return match ? match[1].replace('.html', '') : null;
        }
        return null;
    }

    addCompletionBadge(card) {
        const badge = document.createElement('div');
        badge.className = 'completion-badge';
        badge.innerHTML = '<i class="fas fa-check"></i>';
        card.appendChild(badge);
    }

    startTimeTracking() {
        this.visitStartTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.visitStartTime;
            this.progress.totalTime += timeSpent;
            this.saveProgress();
        });
    }

    updateProgressDisplay() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
        `;
        
        // Add to page if not exists
        if (!document.querySelector('.progress-bar')) {
            document.body.appendChild(progressBar);
        }
    }

    getProgressPercentage() {
        const totalLessons = 9; // Total number of lessons
        return Math.round((this.progress.completedLessons.length / totalLessons) * 100);
    }

    markLessonComplete(lessonId) {
        if (!this.progress.completedLessons.includes(lessonId)) {
            this.progress.completedLessons.push(lessonId);
            this.saveProgress();
            this.updateProgressDisplay();
        }
    }
}

// Initialize all managers
document.addEventListener('DOMContentLoaded', () => {
    window.interactionManager = new InteractionManager();
    window.lessonCardManager = new LessonCardManager();
    window.progressManager = new ProgressManager();
});

// Add CSS for new features
const additionalStyles = `
    .scrolled {
        background: rgba(74, 144, 226, 0.95) !important;
        backdrop-filter: blur(10px);
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .lesson-card.completed {
        border-color: var(--success-color);
    }

    .completion-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--success-color);
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }

    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        z-index: 1001;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        transition: width 0.3s ease;
    }

    .lesson-card.focused {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
