// Canvas setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let animationFrameId = null; // Track animation frame

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class for background animation
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.speed = Math.random() * 2 + 1;
        this.velocity = Math.random() * 2;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            '0, 255, 136', // Primary green
            '0, 102, 255', // Secondary blue
            '0, 217, 159'  // Mix of both
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.velocity) * 0.5;

        if (this.y > canvas.height + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

// Connection line class
class Connection {
    constructor(particle1, particle2) {
        this.particle1 = particle1;
        this.particle2 = particle2;
    }

    draw() {
        const dx = this.particle1.x - this.particle2.x;
        const dy = this.particle1.y - this.particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.particle1.x, this.particle1.y);
            ctx.lineTo(this.particle2.x, this.particle2.y);
            ctx.stroke();
        }
    }
}

// Create particle array
const particles = Array(50).fill().map(() => new Particle());

// Animation function
function animate() {
    if (!document.hidden) {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                new Connection(particles[i], particles[j]).draw();
            }
        }
    }
    animationFrameId = requestAnimationFrame(animate);
}

// Stop animation function
function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// Clean up function
function cleanup() {
    const overlays = document.querySelectorAll('.transition-overlay');
    const clones = document.querySelectorAll('.card-clone');
    
    overlays.forEach(overlay => overlay.remove());
    clones.forEach(clone => clone.remove());
    
    // Clear canvas
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Reset page state
function resetPageState() {
    cleanup();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.visibility = 'visible';
    });
}

// Card click handler
function handleCardClick(e) {
    e.preventDefault();
    const card = this;
    const isSGPA = card.classList.contains('sgpa-card');
    
    cleanup(); // Clean up before transition
    
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);

    const clone = card.cloneNode(true);
    clone.classList.add('card-clone');
    const rect = card.getBoundingClientRect();
    
    Object.assign(clone.style, {
        position: 'fixed',
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        margin: '0',
        zIndex: '1000',
        transition: 'all 0.5s ease-in-out'
    });
    
    document.body.appendChild(clone);
    
    // Trigger animation
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        clone.style.transform = 'scale(20)';
        clone.style.opacity = '0';
    });

    setTimeout(() => {
        window.location.href = `/semesters.html?mode=${isSGPA ? 'sgpa' : 'cgpa'}`;
    }, 500);
}

// Card hover handler
function handleCardHover(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--x', `${x}px`);
    this.style.setProperty('--y', `${y}px`);
}

// Initialize cards
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
        card.removeEventListener('mousemove', handleCardHover);
        card.addEventListener('click', handleCardClick);
        card.addEventListener('mousemove', handleCardHover);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    resetPageState();
    initializeCards();
    animate();
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        resetPageState();
        initializeCards();
        if (!animationFrameId) {
            animate();
        }
    }
});

window.addEventListener('popstate', () => {
    resetPageState();
    initializeCards();
    if (!animationFrameId) {
        animate();
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        resetPageState();
        initializeCards();
        if (!animationFrameId) {
            animate();
        }
    }
});

window.addEventListener('beforeunload', cleanup); 