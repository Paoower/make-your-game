class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Create and add toggle button
        this.createToggleButton();
        
        // Update button icon
        this.updateButtonIcon();
    }

    createToggleButton() {
        // Create container div
        const container = document.createElement('div');
        container.className = 'theme-toggle-container';

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
        `;
        
        button.addEventListener('click', () => this.toggleTheme());
        container.appendChild(button);
        
        // Insert the container into the score-board
        const scoreBoard = document.querySelector('.score-board');
        scoreBoard.appendChild(container);
    }

    updateButtonIcon() {
        const svg = document.querySelector('.theme-toggle svg');
        if (this.theme === 'dark') {
            // Moon icon
            svg.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        } else {
            // Sun icon
            svg.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            `;
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateButtonIcon();
    }
}