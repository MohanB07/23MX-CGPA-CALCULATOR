// Background Animation
const canvas = document.getElementById('mathCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class MathSymbol {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 14;
        this.symbol = this.getRandomSymbol();
        this.speed = 1 + Math.random() * 2;
        this.opacity = Math.random();
    }

    getRandomSymbol() {
        const symbols = ['∑', '∫', '∏', '√', '∂', 'π', '±', '∞', '=', '+'];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    update() {
        this.y += this.speed;
        this.opacity -= 0.005;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
            this.opacity = Math.random();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

const symbols = Array(100).fill().map(() => new MathSymbol());

function animate() {
    ctx.fillStyle = 'rgba(17, 17, 17, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    symbols.forEach(symbol => {
        symbol.update();
        symbol.draw();
    });

    requestAnimationFrame(animate);
}

animate();

// Calculator Logic
document.querySelector('.add-subject').addEventListener('click', () => {
    const container = document.getElementById('subjectInputs');
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
        <input type="text" placeholder="Subject Name">
        <input type="number" placeholder="Credits">
        <input type="number" placeholder="Grade Points">
    `;
    container.appendChild(row);
});

document.querySelector('.add-semester').addEventListener('click', () => {
    const container = document.getElementById('semesterInputs');
    const row = document.createElement('div');
    row.className = 'semester-row';
    row.innerHTML = `
        <input type="number" placeholder="Semester SGPA">
        <input type="number" placeholder="Credits">
    `;
    container.appendChild(row);
});

document.getElementById('sgpaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    calculateSGPA();
});

document.getElementById('cgpaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    calculateCGPA();
});

function calculateSGPA() {
    const rows = document.querySelectorAll('#subjectInputs .subject-row');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(row => {
        const credits = parseFloat(row.children[1].value) || 0;
        const gradePoints = parseFloat(row.children[2].value) || 0;
        totalCredits += credits;
        totalPoints += credits * gradePoints;
    });

    const sgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('sgpaResult').textContent = sgpa;
}

function calculateCGPA() {
    const rows = document.querySelectorAll('#semesterInputs .semester-row');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(row => {
        const sgpa = parseFloat(row.children[0].value) || 0;
        const credits = parseFloat(row.children[1].value) || 0;
        totalCredits += credits;
        totalPoints += credits * sgpa;
    });

    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('cgpaResult').textContent = cgpa;
} 