/**
 * Bauhaus Clock - Main Application Script
 * Enhanced version for authentic behavior matching the original site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the clock
    const clockElement = document.getElementById('clock');
    const clock = new BauhausClock(clockElement, {
        theme: document.body.classList.contains('dark-mode') ? 'night' : 'day',
        movement: 'bauhaus',
        color: '#00b4d8',
        language: 'en'
    });
    
    // Theme toggle functionality
    const themeToggleBtn = document.querySelector('.theme-toggle-container button') || document.querySelector('button:has(.light-icon)');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const body = document.body;
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                clock.setTheme('day');
                updateActiveThemeButton('day');
            } else {
                body.classList.add('dark-mode');
                clock.setTheme('night');
                updateActiveThemeButton('night');
            }
        });
    }
    
    // Theme selector buttons
    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply theme to clock
            clock.setTheme(theme);
            
            // Apply theme to body if needed
            if (theme === 'night' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    });
    
    // Movement selector buttons
    const movementButtons = document.querySelectorAll('.movement-option');
    movementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const movement = this.getAttribute('data-movement');
            
            // Remove active class from all buttons
            movementButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply movement to clock
            clock.setMovement(movement);
            
            // Update movement visualization if it exists
            updateMovementVisualization(movement);
        });
    });
    
    // Language selector buttons
    const languageButtons = document.querySelectorAll('.language-option');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real implementation, this would change UI text
            // For demo purposes, we'll just log it
            console.log(`Language changed to: ${language}`);
        });
    });
    
    // Create color options for the color selector
    const colorSelector = document.getElementById('color-selector');
    if (colorSelector) {
        const colors = [
            '#ff0000', // Red
            '#ff8000', // Orange
            '#ffff00', // Yellow
            '#ff00ff', // Pink
            '#00ff00', // Green
            '#00ffff', // Cyan
            '#0080ff', // Light Blue
            '#ffffff', // White
            '#00ff80', // Mint
            '#8000ff', // Purple
            '#ffff80', // Light Yellow
            '#80ff00', // Lime
            '#00ffff'  // Aqua
        ];
        
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.setAttribute('data-color', color);
            
            colorOption.addEventListener('click', function() {
                // Remove active class from all color options
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Apply color to clock
                const selectedColor = this.getAttribute('data-color');
                clock.setColor(selectedColor);
            });
            
            colorSelector.appendChild(colorOption);
        });
        
        // Set default active color
        const defaultColor = colorSelector.querySelector(`.color-option[data-color="#00b4d8"]`) || 
                            colorSelector.querySelector('.color-option');
        if (defaultColor) {
            defaultColor.classList.add('active');
        }
    }
    
    // Set default active states
    function updateActiveThemeButton(theme) {
        const themeButton = document.querySelector(`.theme-option[data-theme="${theme}"]`);
        if (themeButton) {
            document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('active'));
            themeButton.classList.add('active');
        }
    }
    
    // Initialize active states
    const initialTheme = document.body.classList.contains('dark-mode') ? 'night' : 'day';
    updateActiveThemeButton(initialTheme);
    
    // Set active movement button
    const defaultMovement = document.querySelector('.movement-option[data-movement="bauhaus"]');
    if (defaultMovement) {
        defaultMovement.classList.add('active');
    }
    
    // Set active language button
    const defaultLanguage = document.querySelector('.language-option[data-lang="en"]');
    if (defaultLanguage) {
        defaultLanguage.classList.add('active');
    }
    
    // System theme detection
    const systemThemeButton = document.querySelector('.theme-option[data-theme="system"]');
    if (systemThemeButton) {
        systemThemeButton.addEventListener('click', function() {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Initial check
            if (darkModeMediaQuery.matches) {
                document.body.classList.add('dark-mode');
                clock.setTheme('night');
            } else {
                document.body.classList.remove('dark-mode');
                clock.setTheme('day');
            }
            
            // Listen for changes
            darkModeMediaQuery.addEventListener('change', e => {
                if (this.classList.contains('active')) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        clock.setTheme('night');
                    } else {
                        document.body.classList.remove('dark-mode');
                        clock.setTheme('day');
                    }
                }
            });
        });
    }
    
    // Movement visualization
    function updateMovementVisualization(movement) {
        const visualizationElement = document.getElementById('movement-visualization');
        if (!visualizationElement) return;
        
        // Clear existing visualization
        visualizationElement.innerHTML = '';
        
        // Create SVG for visualization
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        visualizationElement.appendChild(svg);
        
        // Create visualization based on movement type
        if (movement === 'quartz') {
            // Single tick per second
            createTickVisualization(svg, 1);
        } else if (movement === 'bauhaus') {
            // Four ticks per second
            createTickVisualization(svg, 4);
        } else if (movement === 'digital') {
            // Smooth continuous movement
            createSmoothVisualization(svg);
        }
    }
    
    function createTickVisualization(svg, ticksPerSecond) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '45');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '1');
        svg.appendChild(circle);
        
        const hand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hand.setAttribute('x1', '50');
        hand.setAttribute('y1', '50');
        hand.setAttribute('x2', '50');
        hand.setAttribute('y2', '10');
        hand.setAttribute('stroke', 'currentColor');
        hand.setAttribute('stroke-width', '2');
        hand.setAttribute('stroke-linecap', 'round');
        svg.appendChild(hand);
        
        // Animate the hand
        let angle = 0;
        const tickAngle = 360 / (60 * ticksPerSecond);
        
        function tick() {
            angle += tickAngle;
            if (angle >= 360) angle = 0;
            
            const radians = angle * Math.PI / 180;
            const x = 50 + 40 * Math.sin(radians);
            const y = 50 - 40 * Math.cos(radians);
            
            hand.setAttribute('x2', x);
            hand.setAttribute('y2', y);
            
            setTimeout(tick, 1000 / ticksPerSecond);
        }
        
        tick();
    }
    
    function createSmoothVisualization(svg) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '45');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '1');
        svg.appendChild(circle);
        
        const hand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hand.setAttribute('x1', '50');
        hand.setAttribute('y1', '50');
        hand.setAttribute('x2', '50');
        hand.setAttribute('y2', '10');
        hand.setAttribute('stroke', 'currentColor');
        hand.setAttribute('stroke-width', '2');
        hand.setAttribute('stroke-linecap', 'round');
        svg.appendChild(hand);
        
        // Animate the hand smoothly
        function animate(timestamp) {
            const seconds = (timestamp / 1000) % 60;
            const angle = (seconds * 6) * (Math.PI / 180);
            
            const x = 50 + 40 * Math.sin(angle);
            const y = 50 - 40 * Math.cos(angle);
            
            hand.setAttribute('x2', x);
            hand.setAttribute('y2', y);
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize movement visualization
    updateMovementVisualization('bauhaus');
    
    // Buy button functionality
    const buyButtons = document.querySelectorAll('.buy-button, .cta-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('This is a demo clone. In the real website, this would redirect to the purchase page.');
        });
    });
    
    // Footer links
    document.getElementById('contact-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('This is a demo clone. In the real website, this would open a contact form.');
    });
    
    document.getElementById('author-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('This is a demo clone. In the real website, this would link to the author\'s page.');
    });
    
    document.getElementById('legal-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('This is a demo clone. In the real website, this would show legal information.');
    });
    
    document.getElementById('privacy-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('This is a demo clone. In the real website, this would show the privacy policy.');
    });
});
