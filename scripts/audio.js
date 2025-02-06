class AudioManager {
    constructor() {
        // Background Music Setup
        this.bgMusic = new Audio();
        this.bgMusic.src = 'assets/Tetris.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.preload = 'auto';
        
        // Add crossfade to smooth loop transition
        this.bgMusic.addEventListener('timeupdate', () => {
            const buffer = 0.44; // Buffer time before end of track
            if (this.bgMusic.currentTime > this.bgMusic.duration - buffer) {
                this.bgMusic.currentTime = 0;
                this.bgMusic.play();
            }
        });
        
        // Line Clear Sound Effect Setup
        this.lineClearSound = new Audio();
        this.lineClearSound.src = 'assets/tetris-line-clear-sound.mp3';
        this.lineClearSound.preload = 'auto';
        
        // State tracking
        this.isPlaying = false;
        this.isInitialized = false;
        this.isLoaded = false;
        
        // Start loading audio files
        this.bgMusic.load();
        this.lineClearSound.load();
        
        // Initialize on first click
        document.addEventListener('click', () => {
            if (!this.isInitialized) {
                this.initializeAudio();
            }
        }, { once: true });

        // Add loading event listeners
        this.bgMusic.addEventListener('canplaythrough', () => {
            console.log('Background music ready to play');
            this.isLoaded = true;
        });

        this.bgMusic.addEventListener('error', (e) => {
            console.error('Background music loading error:', e);
        });
    }

    initializeAudio() {
        this.isInitialized = true;
        if (this.isLoaded) {
            this.startMusic();
        } else {
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

    playLineClearSound() {
        if (this.isInitialized) {
            // Reset and play the line clear sound
            this.lineClearSound.currentTime = 0;
            const playPromise = this.lineClearSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Line clear sound playback failed:", error);
                });
            }
        }
    }
}