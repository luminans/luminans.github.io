// Lesson-specific audio functionality for Hangul Learning

// Lesson introduction audio
function playLessonIntro() {
    if (window.audioManager) {
        audioManager.speak('Welcome to Basic Vowels. You\'ll learn the four fundamental Korean vowel sounds: ㅏ, ㅓ, ㅗ, ㅜ. Each vowel represents a different mouth position, making them easy to remember and pronounce.', {
            rate: 0.9,
            volume: 0.9
        });
    }
}

// Individual vowel audio
function playVowelAudio(vowel) {
    if (window.audioManager) {
        const vowelDescriptions = {
            'ㅏ': 'ㅏ - Open your mouth wide and say "ah" as in "father"',
            'ㅓ': 'ㅓ - Open your mouth and say "uh" as in "up"',
            'ㅗ': 'ㅗ - Round your lips and say "oh" as in "go"',
            'ㅜ': 'ㅜ - Round your lips tightly and say "oo" as in "moon"'
        };
        
        const description = vowelDescriptions[vowel] || `${vowel} - Listen carefully and repeat`;
        audioManager.speak(description, {
            rate: 0.9,
            volume: 0.9
        });
    }
}

// Play all vowels in sequence
function playAllVowels() {
    if (window.audioManager) {
        const vowels = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'];
        let index = 0;
        
        function playNext() {
            if (index < vowels.length) {
                playVowelAudio(vowels[index]);
                index++;
                setTimeout(playNext, 2000); // Wait 2 seconds between vowels
            }
        }
        
        playNext();
    }
}

// Syllable audio
function playSyllableAudio(syllable) {
    if (window.audioManager) {
        audioManager.speak(syllable, {
            rate: 0.7,
            volume: 0.9
        });
    }
}

// Show mouth guide information
function showMouthGuide() {
    if (window.audioManager) {
        audioManager.speak('Watch how your mouth moves for each vowel. ㅏ opens wide, ㅓ opens slightly, ㅗ rounds forward, and ㅜ rounds tightly.', {
            rate: 0.8,
            volume: 0.9
        });
    }
}

// Lesson completion tracking
function markLessonComplete() {
    if (window.progressManager) {
        progressManager.markLessonComplete('basic_vowels');
        
        // Show completion message
        if (window.audioManager) {
            audioManager.speak('Congratulations! You have completed the Basic Vowels lesson. You can now pronounce the four fundamental Korean vowel sounds.', {
                rate: 0.8,
                volume: 0.9
            });
        }
    }
}

// Interactive practice functions
function startVowelPractice() {
    if (window.audioManager) {
        audioManager.speak('Let\'s practice the vowels together. I will say each vowel, and you repeat after me.', {
            rate: 0.8,
            volume: 0.9
        });
        
        setTimeout(() => {
            playAllVowels();
        }, 3000);
    }
}

function practiceVowelSequence() {
    const sequences = [
        ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'],
        ['ㅜ', 'ㅗ', 'ㅓ', 'ㅏ'],
        ['ㅏ', 'ㅗ', 'ㅓ', 'ㅜ']
    ];
    
    const randomSequence = sequences[Math.floor(Math.random() * sequences.length)];
    let index = 0;
    
    function playSequence() {
        if (index < randomSequence.length) {
            playVowelAudio(randomSequence[index]);
            index++;
            setTimeout(playSequence, 1500);
        }
    }
    
    playSequence();
}

// Audio feedback for interactions
function provideAudioFeedback(action) {
    if (window.audioManager) {
        const feedback = {
            'correct': 'Good job!',
            'incorrect': 'Try again.',
            'complete': 'Excellent! You got it right.',
            'hint': 'Remember the mouth position for this vowel.'
        };
        
        const message = feedback[action] || 'Keep practicing!';
        audioManager.speak(message, {
            rate: 0.8,
            volume: 0.8
        });
    }
}

// Lesson navigation audio
function announceSection(sectionName) {
    if (window.audioManager) {
        const announcements = {
            'vowels': 'Now let\'s learn the individual vowel sounds.',
            'practice': 'Time to practice what you\'ve learned.',
            'syllables': 'Let\'s combine vowels with consonants to form syllables.'
        };
        
        const message = announcements[sectionName] || `Moving to ${sectionName} section.`;
        audioManager.speak(message, {
            rate: 0.8,
            volume: 0.9
        });
    }
}

// Initialize lesson-specific features
document.addEventListener('DOMContentLoaded', function() {
    // Add lesson progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'lesson-progress';
    progressBar.innerHTML = '<div class="lesson-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Track lesson progress
    let progress = 0;
    const sections = document.querySelectorAll('section');
    const totalSections = sections.length;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progress += 100 / totalSections;
                const progressFill = document.querySelector('.lesson-progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${Math.min(progress, 100)}%`;
                }
                
                // Announce section when it comes into view
                const sectionName = entry.target.className.split('-')[0];
                announceSection(sectionName);
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add keyboard shortcuts for lesson navigation
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    playVowelAudio('ㅏ');
                    break;
                case '2':
                    e.preventDefault();
                    playVowelAudio('ㅓ');
                    break;
                case '3':
                    e.preventDefault();
                    playVowelAudio('ㅗ');
                    break;
                case '4':
                    e.preventDefault();
                    playVowelAudio('ㅜ');
                    break;
                case 'p':
                    e.preventDefault();
                    playAllVowels();
                    break;
                case 'i':
                    e.preventDefault();
                    playLessonIntro();
                    break;
            }
        }
    });
    
    // Add touch gestures for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;
        
        // Swipe up to play all vowels
        if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
            playAllVowels();
        }
        
        // Swipe down to repeat lesson intro
        if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
            playLessonIntro();
        }
    });
    
    // Auto-play lesson intro after a delay
    setTimeout(() => {
        if (!window.audioManager || !window.audioManager.isPlaying) {
            playLessonIntro();
        }
    }, 2000);
});

// Export functions for global use
window.playLessonIntro = playLessonIntro;
window.playVowelAudio = playVowelAudio;
window.playAllVowels = playAllVowels;
window.playSyllableAudio = playSyllableAudio;
window.showMouthGuide = showMouthGuide;
window.markLessonComplete = markLessonComplete;
window.startVowelPractice = startVowelPractice;
window.practiceVowelSequence = practiceVowelSequence;
window.provideAudioFeedback = provideAudioFeedback;
