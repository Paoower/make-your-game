class ScoreBoard {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 0;
        this.linesCleared = 0;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        
        // Ensure elements exist before updating
        this.updateDisplay();
    }

    updateTimer() {
        if (this.pausedTime === 0) {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - this.startTime - this.totalPausedTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    pauseTimer() {
        this.pausedTime = Date.now();
        this.updateTimer();
    }

    stopTimer() {
        this.pauseTimer();
        this.pausedTime = Date.now(); 
    }

    resumeTimer() {
        if (this.pausedTime > 0) {
            this.totalPausedTime += Date.now() - this.pausedTime;
            this.pausedTime = 0;
        }
    }

    getFormattedTime() {
        const elapsed = Math.floor((this.pausedTime - this.startTime - this.totalPausedTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScore(linesCleared) {
        let points = 0;
        switch(linesCleared) {
            case 1: // Single
                points = 100 * (this.level + 1);
                break;
            case 2: // Double
                points = 300 * (this.level + 1);
                break;
            case 3: // Triple
                points = 500 * (this.level + 1);
                break;
            case 4: // Tetris
                points = 800 * (this.level + 1);
                break;
        }

        this.score += points;
        this.linesCleared += linesCleared;
        this.updateLevel();
        this.updateDisplay();
    }

    updateLevel() {
        const newLevel = Math.floor(this.linesCleared / 10);
        this.level = newLevel;
    }

    getDropInterval() {
        const levelFrames = [
            48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 
            5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 
            2, 2, 2, 2, 2, 2, 2, 2, 2, 1
        ];
        
        // Return interval in milliseconds (assuming 60 FPS)
        return levelFrames[Math.min(this.level, 29)] * (1000 / 60);
    }

    loseLife() {
        this.lives--;
        this.updateDisplay();
        return this.lives <= 0;
    }

    updateDisplay() {
        if (this.scoreElement) this.scoreElement.textContent = this.score;
        if (this.livesElement) this.livesElement.textContent = this.lives;
        if (this.levelElement) this.levelElement.textContent = this.level;
    }

    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 0;
        this.linesCleared = 0;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        this.updateDisplay();
    }
}