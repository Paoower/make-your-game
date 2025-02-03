class ScoreBoard {
    constructor() {
        this.score = 0;
        this.lives = 1;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
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

    updateScore(points) {
        this.score += points;
        this.updateDisplay();
    }

    loseLife() {
        this.lives--;
        this.updateDisplay();
        return this.lives <= 0;
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
    }
    
    reset() {
        this.score = 0;
        this.lives = 1;
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.totalPausedTime = 0;
        this.updateDisplay();
    }
}