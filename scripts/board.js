class Board {
    constructor() {
        this.width = 10;
        this.height = 20;
        this.blockSize = this.calculateBlockSize();
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
        this.element = document.getElementById('game-board');

        // Add resize event listener to adjust block size dynamically
        window.addEventListener('resize', () => {
            this.blockSize = this.calculateBlockSize();
            // Optionally re-render the board if needed
            this.render();
        });
    }

    calculateBlockSize() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 480) {
            return 20; // Smallest screen size
        } else if (screenWidth < 768) {
            return 25; // Medium screen size
        } else {
            return 30; // Default/large screen size
        }
    }

    render() {
        // Clear only the board content, not the current piece
        this.element.innerHTML = '';
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.grid[y][x]) {
                    const block = document.createElement('div');
                    block.className = 'tetromino';
                    block.style.backgroundColor = this.grid[y][x];
                    block.style.left = `${x * this.blockSize}px`;
                    block.style.top = `${y * this.blockSize}px`;
                    this.element.appendChild(block);
                }
            }
        }
    }

    clear() {
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(0));
        this.render();
    }

    clearLines() {
        let linesCleared = 0;
        for(let y = this.height - 1; y >= 0; y--) {
            if(this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.width).fill(0));
                linesCleared++;
                y++;
            }
        }
        return linesCleared;
    }
}