document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    requestAnimationFrame(game.update.bind(game));
});