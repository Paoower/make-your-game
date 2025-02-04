class PauseMenu {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('pause-menu');
        this.continueButton = document.getElementById('continue');
        this.restartButton = document.getElementById('restart');
        
        this.continueButton.addEventListener('click', () => this.continue());
        this.restartButton.addEventListener('click', () => this.restart());
    }

    show() {
        this.element.classList.remove('hidden');
    }

    hide() {
        this.element.classList.add('hidden');
    }

    continue() {
        this.game.resumeGame();
    }

    restart() {
        this.hide();
        this.game.restart();
    }

    // Optional toggle method for flexibility
    toggle() {
        this.game.togglePause();
    }
}