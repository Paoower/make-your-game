class AudioManager {
    constructor() {
        this.bgMusic = new Audio();
        this.bgMusic.src = 'assets/Tetris.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.preload = 'auto'; // Preload the audio file
        this.isPlaying = false;
        this.isInitialized = false;
        
        // Start loading the audio file immediately
        this.bgMusic.load();
        
        // Add event listener for user interaction
        document.addEventListener('click', () => {
            if (!this.isInitialized) {
                this.initializeAudio();
            }
        }, { once: true });

        // Add loading event listeners
        this.bgMusic.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play');
            this.isLoaded = true;
        });

        this.bgMusic.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
        });
    }

    initializeAudio() {
        this.isInitialized = true;
        // Only try to play if the audio is loaded
        if (this.isLoaded) {
            this.startMusic();
        } else {
            // If not loaded, wait for it
            this.bgMusic.addEventListener('canplaythrough', () => {
                this.startMusic();
            }, { once: true });
        }
    }

    startMusic() {
        if (this.isInitialized) {
            this.bgMusic.currentTime = 0;
            const playPromise = this.bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.isPlaying = true;
                    })
                    .catch(error => {
                        console.log("Audio playback failed:", error);
                    });
            }
        }
    }

    pauseMusic() {
        if (this.isPlaying) {
            this.bgMusic.pause();
            this.isPlaying = false;
        }
    }

    resumeMusic() {
        if (this.isInitialized && !this.isPlaying) {
            const playPromise = this.bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.isPlaying = true;
                    })
                    .catch(error => {
                        console.log("Audio playback failed:", error);
                    });
            }
        }
    }
}