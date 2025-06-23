/**
 * Bauhaus Clock - Core Clock Functionality
 * Enhanced version for authentic behavior matching the original site
 */

class BauhausClock {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = {
            theme: options.theme || 'day',
            movement: options.movement || 'bauhaus',
            color: options.color || '#00b4d8',
            language: options.language || 'en',
            ...options
        };
        
        // Clock elements
        this.hourHand = null;
        this.minuteHand = null;
        this.secondHand = null;
        this.face = null;
        this.markers = [];
        this.numbers = [];
        
        // Animation
        this.animationFrame = null;
        this.lastTime = 0;
        this.movementSpeeds = {
            'quartz': 1,      // 1 Hz - one tick per second
            'bauhaus': 4,     // 4 Hz - four ticks per second
            'digital': 60     // 60 Hz - smooth movement
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create clock face
        this.createClockFace();
        
        // Start the clock
        this.start();
        
        // Apply initial theme
        this.setTheme(this.options.theme);
        
        // Apply initial movement
        this.setMovement(this.options.movement);
        
        // Apply initial color
        this.setColor(this.options.color);
    }
    
    createClockFace() {
        // Clear any existing content
        this.element.innerHTML = '';
        
        // Create SVG container
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.setAttribute('class', 'clock-face');
        this.element.appendChild(svg);
        
        // Create clock face
        this.face = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.face.setAttribute('cx', '100');
        this.face.setAttribute('cy', '100');
        this.face.setAttribute('r', '95');
        this.face.setAttribute('fill', 'none');
        this.face.setAttribute('stroke', 'currentColor');
        this.face.setAttribute('stroke-width', '1');
        this.face.setAttribute('class', 'clock-face-circle');
        svg.appendChild(this.face);
        
        // Create hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = 100 + 85 * Math.sin(angle);
            const y1 = 100 - 85 * Math.cos(angle);
            const x2 = 100 + 95 * Math.sin(angle);
            const y2 = 100 - 95 * Math.cos(angle);
            
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            marker.setAttribute('x1', x1);
            marker.setAttribute('y1', y1);
            marker.setAttribute('x2', x2);
            marker.setAttribute('y2', y2);
            marker.setAttribute('stroke', 'currentColor');
            marker.setAttribute('stroke-width', i % 3 === 0 ? '2' : '1');
            marker.setAttribute('class', 'hour-marker');
            svg.appendChild(marker);
            this.markers.push(marker);
        }
        
        // Create minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Skip positions where hour markers are
                const angle = (i * 6) * (Math.PI / 180);
                const x1 = 100 + 90 * Math.sin(angle);
                const y1 = 100 - 90 * Math.cos(angle);
                const x2 = 100 + 95 * Math.sin(angle);
                const y2 = 100 - 95 * Math.cos(angle);
                
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                marker.setAttribute('x1', x1);
                marker.setAttribute('y1', y1);
                marker.setAttribute('x2', x2);
                marker.setAttribute('y2', y2);
                marker.setAttribute('stroke', 'currentColor');
                marker.setAttribute('stroke-width', '0.5');
                marker.setAttribute('class', 'minute-marker');
                svg.appendChild(marker);
                this.markers.push(marker);
            }
        }
        
        // Add hour numbers
        const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        numbers.forEach((num, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 100 + 75 * Math.sin(angle);
            const y = 100 - 75 * Math.cos(angle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', '500');
            text.setAttribute('class', 'hour-number');
            text.textContent = num;
            svg.appendChild(text);
            this.numbers.push(text);
        });
        
        // Create clock hands
        // Hour hand
        this.hourHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.hourHand.setAttribute('x1', '100');
        this.hourHand.setAttribute('y1', '100');
        this.hourHand.setAttribute('x2', '100');
        this.hourHand.setAttribute('y2', '50');
        this.hourHand.setAttribute('stroke', 'currentColor');
        this.hourHand.setAttribute('stroke-width', '4');
        this.hourHand.setAttribute('stroke-linecap', 'round');
        this.hourHand.setAttribute('class', 'hour-hand');
        svg.appendChild(this.hourHand);
        
        // Minute hand
        this.minuteHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.minuteHand.setAttribute('x1', '100');
        this.minuteHand.setAttribute('y1', '100');
        this.minuteHand.setAttribute('x2', '100');
        this.minuteHand.setAttribute('y2', '30');
        this.minuteHand.setAttribute('stroke', 'currentColor');
        this.minuteHand.setAttribute('stroke-width', '3');
        this.minuteHand.setAttribute('stroke-linecap', 'round');
        this.minuteHand.setAttribute('class', 'minute-hand');
        svg.appendChild(this.minuteHand);
        
        // Second hand
        this.secondHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.secondHand.setAttribute('x1', '100');
        this.secondHand.setAttribute('y1', '110');
        this.secondHand.setAttribute('x2', '100');
        this.secondHand.setAttribute('y2', '20');
        this.secondHand.setAttribute('stroke', this.options.color);
        this.secondHand.setAttribute('stroke-width', '1');
        this.secondHand.setAttribute('stroke-linecap', 'round');
        this.secondHand.setAttribute('class', 'second-hand');
        svg.appendChild(this.secondHand);
        
        // Center dot
        const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerDot.setAttribute('cx', '100');
        centerDot.setAttribute('cy', '100');
        centerDot.setAttribute('r', '3');
        centerDot.setAttribute('fill', 'currentColor');
        centerDot.setAttribute('class', 'center-dot');
        svg.appendChild(centerDot);
    }
    
    updateClock(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        
        const elapsed = timestamp - this.lastTime;
        const movement = this.options.movement;
        const movementSpeed = this.movementSpeeds[movement];
        
        // Only update if enough time has passed based on movement type
        if (elapsed >= (1000 / movementSpeed)) {
            this.lastTime = timestamp;
            
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const milliseconds = now.getMilliseconds();
            
            // Calculate precise positions for smooth movement
            let secondsAngle, minutesAngle, hoursAngle;
            
            if (movement === 'digital') {
                // Smooth continuous movement
                secondsAngle = ((seconds * 6) + (milliseconds * 0.006)) * (Math.PI / 180);
                minutesAngle = ((minutes * 6) + (seconds * 0.1)) * (Math.PI / 180);
                hoursAngle = ((hours * 30) + (minutes * 0.5)) * (Math.PI / 180);
            } else if (movement === 'bauhaus') {
                // 4 Hz movement - updates 4 times per second
                const quarterSecond = Math.floor(milliseconds / 250) * 250;
                secondsAngle = ((seconds * 6) + (quarterSecond * 0.006)) * (Math.PI / 180);
                minutesAngle = ((minutes * 6) + (seconds * 0.1)) * (Math.PI / 180);
                hoursAngle = ((hours * 30) + (minutes * 0.5)) * (Math.PI / 180);
            } else {
                // Quartz movement - updates once per second
                secondsAngle = (seconds * 6) * (Math.PI / 180);
                minutesAngle = ((minutes * 6) + (seconds * 0.1)) * (Math.PI / 180);
                hoursAngle = ((hours * 30) + (minutes * 0.5)) * (Math.PI / 180);
            }
            
            // Update hand positions
            this.updateHand(this.secondHand, secondsAngle, 80);
            this.updateHand(this.minuteHand, minutesAngle, 70);
            this.updateHand(this.hourHand, hoursAngle, 50);
        }
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(this.updateClock.bind(this));
    }
    
    updateHand(hand, angle, length) {
        const x = 100 + length * Math.sin(angle);
        const y = 100 - length * Math.cos(angle);
        hand.setAttribute('x2', x);
        hand.setAttribute('y2', y);
    }
    
    start() {
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(this.updateClock.bind(this));
        }
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    setTheme(theme) {
        this.options.theme = theme;
        this.element.setAttribute('data-theme', theme);
        
        // Apply theme-specific styles
        if (theme === 'night') {
            this.element.classList.add('night-mode');
            this.element.classList.remove('day-mode');
            this.secondHand.setAttribute('stroke', this.options.color || '#00ffff');
        } else {
            this.element.classList.add('day-mode');
            this.element.classList.remove('night-mode');
            this.secondHand.setAttribute('stroke', this.options.color || '#00b4d8');
        }
    }
    
    setMovement(movement) {
        if (this.movementSpeeds[movement]) {
            this.options.movement = movement;
            // Reset animation to apply new movement
            this.stop();
            this.start();
        }
    }
    
    setColor(color) {
        this.options.color = color;
        this.secondHand.setAttribute('stroke', color);
    }
}

// Export for use in other scripts
window.BauhausClock = BauhausClock;
