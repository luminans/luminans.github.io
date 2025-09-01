// Modern Audio System for Hangul Learning

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        this.isPlaying = false;
        this.volume = 0.8;
        this.rate = 1.0;
        this.audioCache = new Map();
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        
        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load speech synthesis voices
            this.loadVoices();
            
            // Preload common audio files
            await this.preloadAudio();
            
            console.log('Audio Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Audio Manager:', error);
        }
    }

    loadVoices() {
        // Load available voices
        const loadVoices = () => {
            this.voices = this.speechSynthesis.getVoices();
            
            // Prefer natural English voices
            const englishVoice = this.voices.find(voice => 
                (voice.lang.includes('en-US') && voice.name.includes('Google')) ||
                (voice.lang.includes('en-GB') && voice.name.includes('Google')) ||
                (voice.lang.includes('en-US') && voice.name.includes('Natural')) ||
                (voice.lang.includes('en-GB') && voice.name.includes('Natural'))
            );
            
            if (englishVoice) {
                console.log('Natural English voice found:', englishVoice.name);
                this.preferredVoice = englishVoice;
            } else {
                // Fallback to any English voice
                const fallbackVoice = this.voices.find(voice => 
                    voice.lang.includes('en-US') || voice.lang.includes('en-GB')
                );
                if (fallbackVoice) {
                    console.log('Fallback English voice found:', fallbackVoice.name);
                    this.preferredVoice = fallbackVoice;
                }
            }
        };

        // Load voices immediately if available
        loadVoices();
        
        // Load voices when they become available
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    async preloadAudio() {
        const audioFiles = [
            'sounds/sound01.mp3',
            'sounds/sound02.mp3',
            'sounds/sound03.mp3',
            'sounds/sound04.ogg',
            'sounds/sound05.ogg',
            'sounds/sound06.ogg',
            'sounds/sound07.ogg'
        ];

        for (const file of audioFiles) {
            try {
                const audio = new Audio(file);
                audio.preload = 'auto';
                this.audioCache.set(file, audio);
            } catch (error) {
                console.warn(`Failed to preload ${file}:`, error);
            }
        }
    }

    // Play audio file with visual feedback
    async playAudio(audioFile, options = {}) {
        try {
            // Stop current audio if playing
            this.stopAudio();

            let audio;
            if (this.audioCache.has(audioFile)) {
                audio = this.audioCache.get(audioFile);
            } else {
                audio = new Audio(audioFile);
                this.audioCache.set(audioFile, audio);
            }

            // Configure audio
            audio.volume = options.volume || this.volume;
            audio.playbackRate = options.rate || this.rate;
            audio.loop = options.loop || false;

            // Add visual feedback
            this.addAudioVisualizer(audio);

            // Play audio
            await audio.play();
            this.currentAudio = audio;
            this.isPlaying = true;

            // Handle audio end
            audio.onended = () => {
                this.isPlaying = false;
                this.removeAudioVisualizer();
            };

            return audio;
        } catch (error) {
            console.error('Failed to play audio:', error);
            throw error;
        }
    }

    // Play speech synthesis with natural English voice
    speak(text, options = {}) {
        try {
            // Stop current speech
            this.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure speech
            utterance.volume = options.volume || this.volume;
            utterance.rate = options.rate || 0.9; // Natural pace
            utterance.pitch = options.pitch || 1.0;
            
            // Use preferred English voice
            if (this.preferredVoice) {
                utterance.voice = this.preferredVoice;
            }

            // Add visual feedback
            this.addSpeechVisualizer(utterance);

            // Speak
            this.speechSynthesis.speak(utterance);
            this.isPlaying = true;

            utterance.onend = () => {
                this.isPlaying = false;
                this.removeAudioVisualizer();
            };

            return utterance;
        } catch (error) {
            console.error('Failed to speak:', error);
            throw error;
        }
    }

    // Stop current audio/speech
    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        this.isPlaying = false;
        this.removeAudioVisualizer();
    }

    // Add audio visualizer
    addAudioVisualizer(audio) {
        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visualizer';
        visualizer.innerHTML = `
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
        `;
        
        // Add to active button or create floating visualizer
        const activeButton = document.querySelector('.btn:active, .btn:hover');
        if (activeButton) {
            activeButton.appendChild(visualizer);
        } else {
            document.body.appendChild(visualizer);
            visualizer.style.position = 'fixed';
            visualizer.style.top = '20px';
            visualizer.style.right = '20px';
            visualizer.style.zIndex = '1000';
        }
        
        this.currentVisualizer = visualizer;
    }

    // Add speech visualizer
    addSpeechVisualizer(utterance) {
        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visualizer';
        visualizer.innerHTML = `
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
            <div class="audio-bar"></div>
        `;
        
        document.body.appendChild(visualizer);
        visualizer.style.position = 'fixed';
        visualizer.style.top = '20px';
        visualizer.style.right = '20px';
        visualizer.style.zIndex = '1000';
        
        this.currentVisualizer = visualizer;
    }

    // Remove audio visualizer
    removeAudioVisualizer() {
        if (this.currentVisualizer) {
            this.currentVisualizer.remove();
            this.currentVisualizer = null;
        }
    }

    // Set volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }

    // Set playback rate
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2, rate));
        if (this.currentAudio) {
            this.currentAudio.playbackRate = this.rate;
        }
    }
}

// Initialize Audio Manager
const audioManager = new AudioManager();

// Global audio functions
function playWelcomeAudio() {
    audioManager.speak('Welcome to Hangul Learning! Let\'s master Korean pronunciation together.', {
        rate: 0.9,
        volume: 0.9
    });
}

function playAboutAudio() {
    audioManager.speak('King Sejong the Great invented Hangul in 1443. Each letter represents the shape of your mouth when making the sound. This makes Hangul uniquely intuitive for learners.', {
        rate: 0.9,
        volume: 0.9
    });
}

function playLessonAudio(lessonType) {
    const lessonAudioMap = {
        'hundlism': 'Hundlism introduces the phonetic foundations that make Hangul so logical and easy to learn.',
        'primitive': 'Primitive letters are the fundamental building blocks that form the basis of all Hangul characters.',
        'vowels': 'Basic vowels: ㅏ, ㅓ, ㅗ, ㅜ. These four sounds form the foundation of Korean pronunciation.',
        'consonants': 'Basic consonants: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ, ㅈ, ㅎ. Master these essential sounds.',
        'derived-vowels': 'Derived vowels combine basic vowels to create more complex and nuanced sounds.',
        'derived-consonants': 'Derived consonants add strength and emphasis to the basic consonant sounds.',
        'composite-vowels': 'Composite vowels blend multiple vowel sounds to create rich, expressive pronunciation.',
        'composite-consonants': 'Composite consonants are tensed versions that add intensity to your Korean speech.',
        'wing': 'Hangul Wing brings everything together, giving you a complete mastery of the Korean writing system.'
    };

    const text = lessonAudioMap[lessonType] || 'This lesson will help you master Hangul pronunciation with clear, natural guidance.';
    audioManager.speak(text, {
        rate: 0.9,
        volume: 0.9
    });
}

function startLesson() {
    // Scroll to lessons section
    document.getElementById('lessons').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Play welcome audio after a short delay
    setTimeout(() => {
        playWelcomeAudio();
    }, 500);
}

function navigateToLesson(lessonPage) {
    // Add loading animation
    const button = event.target.closest('.lesson-card');
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
            window.location.href = lessonPage;
        }, 150);
    } else {
        window.location.href = lessonPage;
    }
}

// Audio controls for lesson pages
function playSyllableAudio(syllable) {
    audioManager.speak(syllable, {
        rate: 0.7,
        volume: 0.9
    });
}

function playLetterAudio(letter) {
    audioManager.speak(letter, {
        rate: 0.6,
        volume: 0.9
    });
}

// Touch-friendly audio controls
function addTouchAudioControls() {
    // Add touch feedback to audio buttons
    const audioButtons = document.querySelectorAll('.btn[onclick*="Audio"]');
    audioButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize touch controls when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addTouchAudioControls();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    audioManager.stopAudio();
                    break;
                case 'h':
                    e.preventDefault();
                    playWelcomeAudio();
                    break;
            }
        }
    });
});

// Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export for use in other modules
window.AudioManager = AudioManager;
window.audioManager = audioManager;
