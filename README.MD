# **make-your-game**
# **Tetris**

## Project Structure
```
tetris/
│
├── index.html                # Main HTML file
│
├── assets/
│   ├── Tetris.mp3            # Background music
│   └── favicon.ico           # Website favicon
│
├── scripts/
│   ├── main.js               # Entry point
│   ├── game.js               # Core game logic
│   ├── board.js              # Game board management
│   ├── tetromino.js          # Tetromino piece generation
│   ├── scoreBoard.js         # Score and lives tracking
│   ├── pauseMenu.js          # Pause menu functionality
│   └── audio.js              # Music and sound management
│
├── styles/
│   └── style.css             # Game styling
│
└── README.md                 # Project documentation
```

## Features
- Classic Tetris gameplay
- Responsive design
- Next piece preview
- Pause/Resume functionality
- Game over screen
- Background music
- Lives system
- Score tracking

## Prerequisites
- Modern web browser
- JavaScript enabled

## How to Clone and Run
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tetris-game.git
   cd tetris-game
   ```

2. Open `index.html` in your web browser

## Controls
- ← Arrow Left: Move piece left
- → Arrow Right: Move piece right
- ↓ Arrow Down: Drop piece faster
- ↑ Arrow Up: Rotate piece
- ESC: Pause/Unpause game
