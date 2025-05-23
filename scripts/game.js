class Game {
    constructor() {
        this.board = new Board();
        this.scoreBoard = new ScoreBoard();
        this.pauseMenu = new PauseMenu(this);
        this.audioManager = new AudioManager();
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        this.isPaused = false;
        this.isGameOver = false;
        this.isLifeLostMessageShowing = false; 
        this.lastRender = 0;
        this.dropCounter = 0;
        this.dropInterval = this.scoreBoard.getDropInterval();
        
        if (this.audioManager.isInitialized) {
            this.audioManager.startMusic();
        }
        
        const pauseMenu = document.getElementById('pause-menu');
        const gameOverMenu = document.getElementById('game-over-menu');
        
        if (pauseMenu) pauseMenu.classList.add('hidden');
        if (gameOverMenu) gameOverMenu.classList.add('hidden');

        this.bindControls();
        this.audioManager.startMusic();
        window.game = this;
    }

    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isGameOver || this.isLifeLostMessageShowing) return; // Add check for life lost message
                this.togglePause();
                return;
            }
            
            if(this.isPaused || this.isGameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1);
                    break;
                case 'ArrowRight':
                    this.movePiece(1);
                    break;
                case 'ArrowDown':
                    this.dropPiece();
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
            }
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.audioManager.pauseMusic();
            this.scoreBoard.pauseTimer();
            this.pauseMenu.show();
        } else {
            this.audioManager.resumeMusic();
            this.scoreBoard.resumeTimer();
            this.pauseMenu.hide();
        }
    }
    resumeGame() {
        if (this.isPaused) {
            this.isPaused = false;
            this.audioManager.resumeMusic();
            this.scoreBoard.resumeTimer();
            this.pauseMenu.hide();
        }
    }

    generatePiece() {
        const types = 'IOTSZJL';
        return new Tetromino(types[Math.floor(Math.random() * types.length)]);
    }

    movePiece(direction) {
        // Only allow movement when the first line of the tetromino is visible
        if (this.currentPiece.y >= -1) {
            this.currentPiece.x += direction;
            if (this.checkCollision()) {
                this.currentPiece.x -= direction;
            }
        }
    }

    isPieceFullyVisible() {
        const piece = this.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    // Check if any block of the piece is above the board
                    if (piece.y + y < 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    dropPiece() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            
            const isPieceFullyVisible = this.isPieceFullyVisible();
            
            this.mergePiece();
            const linesCleared = this.board.clearLines();
            
            // Play line clear sound if lines were cleared
            if (linesCleared > 0) {
                this.audioManager.playLineClearSound();
            }
            
            this.scoreBoard.updateScore(linesCleared);
            
            this.dropInterval = this.scoreBoard.getDropInterval();
            
            if (!isPieceFullyVisible) {
                if (this.scoreBoard.loseLife()) {
                    this.gameOver();
                } else {
                    this.resetPlayfield();
                }
            } else {
                this.currentPiece = this.nextPiece;
                this.nextPiece = this.generatePiece();
                
                if (this.checkCollision()) {
                    if (this.scoreBoard.loseLife()) {
                        this.gameOver();
                    } else {
                        this.resetPlayfield();
                    }
                }
            }
        }
    }

    resetPlayfield() {
        // Pause the timer
        this.scoreBoard.pauseTimer();
        
        // Clear the board but maintain score and level
        this.board.clear();
        
        // Generate new pieces
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        
        // Reset drop counter
        this.dropCounter = 0;
        
        // Add setTimeout to ensure message appears after state is reset
        setTimeout(() => {
            this.showLifeLostMessage();
        }, 0);
    }

    showLifeLostMessage() {
        const existingMessage = document.querySelector('.life-lost-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        this.isLifeLostMessageShowing = true; 
        const message = document.createElement('div');
        message.className = 'life-lost-message modal-menu';
        message.innerHTML = `
            <h3>Life Lost!</h3>
            <p>Lives Remaining: ${this.scoreBoard.lives}</p>
            <p>Press Enter to continue...</p>
        `;
        
        // Find or create modal container
        let modalContainer = document.querySelector('.modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            document.querySelector('.main-game').appendChild(modalContainer);
        }
        
        modalContainer.appendChild(message);
        
        this.isPaused = true;
        
        const removeMessage = (e) => {
            if (e.key === 'Enter') {
                message.remove();
                this.isPaused = false;
                this.isLifeLostMessageShowing = false; 
                this.scoreBoard.resumeTimer();
                document.removeEventListener('keydown', removeMessage);
            }
        };
        
        document.addEventListener('keydown', removeMessage);
    }

    rotatePiece() {
        // Only allow rotation when the first line of the tetromino is visible
        if (this.currentPiece.y >= -1) {
            const originalShape = this.currentPiece.shape;
            this.currentPiece.shape = this.currentPiece.rotate();
            if (this.checkCollision()) {
                this.currentPiece.shape = originalShape;
            }
        }
    }

    checkCollision() {
        const piece = this.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
    
                    if (
                        boardX < 0 ||
                        boardX >= this.board.width ||
                        boardY >= this.board.height ||
                        (boardY >= 0 && this.board.grid[boardY][boardX])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    mergePiece() {
        const piece = this.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.y + y;
                    if (boardY >= 0) {
                        this.board.grid[boardY][piece.x + x] = this.getTetrominoColor(piece.type);
                    }
                }
            }
        }
    }

    getTetrominoColor(type) {
        const colors = {
            'I': '#00f0f0',
            'O': '#f0f000',
            'T': '#a000f0',
            'S': '#00f000',
            'Z': '#f00000',
            'J': '#0000f0',
            'L': '#f0a000'
        };
        return colors[type];
    }

    gameOver() {
        this.isGameOver = true;
        this.isPaused = true;
        this.audioManager.pauseMusic();
        this.scoreBoard.stopTimer();
        
        let gameOverMenu = document.getElementById('game-over-menu');
        if (!gameOverMenu) {
            gameOverMenu = document.createElement('div');
            gameOverMenu.id = 'game-over-menu';
            document.querySelector('.game-container').appendChild(gameOverMenu);
        }
        
        gameOverMenu.innerHTML = `
            <h2>Game Over!</h2>
            <div class="game-stats">
                <p>Final Score: <span id="final-score">${this.scoreBoard.score}</span></p>
                <p>Level: <span id="final-level">${this.scoreBoard.level}</span></p>
                <p>Time Played: <span id="final-time">${this.scoreBoard.getFormattedTime()}</span></p>
            </div>
            <button onclick="window.game.restart()">Play Again</button>
        `;
        
        gameOverMenu.classList.remove('hidden');
    }

    showGameOverScreen() {
        const gameOverMenu = document.getElementById('game-over-menu');
        if (gameOverMenu) {
            const finalScore = gameOverMenu.querySelector('#final-score');
            const finalTime = gameOverMenu.querySelector('#final-time');
            
            if (finalScore && finalTime) {
                finalScore.textContent = this.scoreBoard.score;
                finalTime.textContent = this.scoreBoard.getFormattedTime();
                gameOverMenu.classList.remove('hidden');
            }
        }
    }

    update(time = 0) {
        const deltaTime = time - this.lastRender;
        
        // Always render the next piece preview, regardless of pause state
        this.renderNextPiece();
        
        if(!this.isPaused) {
            this.dropCounter += deltaTime;
            this.dropInterval = this.scoreBoard.getDropInterval();
            
            if(this.dropCounter > this.dropInterval) {
                this.dropPiece();
                this.dropCounter = 0;
            }
            
            this.scoreBoard.updateTimer();
            this.board.render();
            this.renderCurrentPiece();
        }
        
        this.lastRender = time;
        requestAnimationFrame(this.update.bind(this));
    }

    renderCurrentPiece() {
        const piece = this.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    // Only render blocks that are on or below y=0
                    if (piece.y + y >= 0) {
                        const block = document.createElement('div');
                        block.className = 'tetromino';
                        block.style.backgroundColor = this.getTetrominoColor(piece.type);
                        block.style.left = `${(piece.x + x) * this.board.blockSize}px`;
                        block.style.top = `${(piece.y + y) * this.board.blockSize}px`;
                        this.board.element.appendChild(block);
                    }
                }
            }
        }
    }

    renderNextPiece() {
        const nextPiecePreview = document.getElementById('next-piece');
        nextPiecePreview.innerHTML = '';
        
        // Get container dimensions - this will now update even when paused
        const containerWidth = nextPiecePreview.parentElement.clientWidth;
        const containerHeight = nextPiecePreview.parentElement.clientHeight;
        
        // Calculate block size based on current board block size
        const blockSize = this.board.blockSize;
        
        // Calculate the piece's total width and height
        const pieceWidth = this.nextPiece.shape[0].length * blockSize;
        const pieceHeight = this.nextPiece.shape.length * blockSize;
        
        // Calculate the offsets to center the piece
        const offsetX = (containerWidth - pieceWidth) / 2;
        const offsetY = (containerHeight - pieceHeight) / 2;
        
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x]) {
                    const block = document.createElement('div');
                    block.className = 'tetromino';
                    block.style.backgroundColor = this.getTetrominoColor(this.nextPiece.type);
                    block.style.left = `${offsetX + x * blockSize}px`;
                    block.style.top = `${offsetY + y * blockSize}px`;
                    block.style.width = `${blockSize}px`;
                    block.style.height = `${blockSize}px`;
                    nextPiecePreview.appendChild(block);
                }
            }
        }
    }


    restart() {
        this.board.clear();
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        this.scoreBoard.reset();
        this.isPaused = false;
        this.isGameOver = false;
        this.dropCounter = 0;
        this.lastRender = 0;
        this.dropInterval = 1000; // Reset to initial interval
        this.audioManager.startMusic();
        
        // Hide both menus
        const pauseMenu = document.getElementById('pause-menu');
        const gameOverMenu = document.getElementById('game-over-menu');
        
        if (pauseMenu) pauseMenu.classList.add('hidden');
        if (gameOverMenu) gameOverMenu.classList.add('hidden');
    }
}