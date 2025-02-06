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
│   ├── themeManager.js       # Theme manager functionality
│   ├── pauseMenu.js          # Pause menu functionality
│   └── audio.js              # Music and sound management
│
├── styles/
│   └── style.css             # Game styling
│
└── README.md                 
```

## Prerequisites
- Modern web browser
- JavaScript enabled

## How to Clone and Run
1. Clone the repository:
   ```bash
   git clone https://zone01normandie.org/git/mtrebert/make-your-game.git
   cd tetris-game
   ```

2. Open `index.html` in your web browser

## Controls
- ← Arrow Left: Move piece left
- → Arrow Right: Move piece right
- ↓ Arrow Down: Drop piece faster
- ↑ Arrow Up: Rotate piece
- ESC: Pause/Unpause game
