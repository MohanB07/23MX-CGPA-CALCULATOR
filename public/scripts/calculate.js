document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const selectedSemesters = urlParams.get('semesters')?.split(',') || [];

    // Redirect to home if no mode or semesters are specified
    if (!mode || !selectedSemesters.length) {
        window.location.href = '/';
        return;
    }

    const semestersContainer = document.querySelector('.semesters-container');
    const calculateBtn = document.querySelector('.calculate-btn');

    // Course data (you can replace this with your actual course data)
    const courseData = {
        1: [
            { code: '23MX11', name: 'Mathematical Foundations of Computer Science', credits: 4 },
            { code: '23MX12', name: 'Structured Programming Concepts', credits: 3 },
            { code: '23MX13', name: 'Data Structures', credits: 3 },
            { code: '23MX14', name: 'Database Systems', credits: 4 },
            { code: '23MX15', name: 'Web Technologies', credits: 3 },
            { code: '23MX16', name: 'LAB : C programming', credits: 2 },
	        { code: '23MX17', name: 'LAB : Data Structures', credits: 2 },
	        { code: '23MX18', name: 'Web Application Development', credits: 2 },

        ],
        2: [
            { code: '23MX21', name: 'Software Engineering', credits: 4 },
            { code: '23MX22', name: 'Design and Analysis of Algorithms', credits: 4 },
            { code: '23MX23', name: 'OOP using Java', credits: 3 },
            { code: '23MX24', name: 'Enterprise Computing using Full Stack', credits: 5 },
            { code: '23MX_', name: 'Elective 1', credits: 3 },
            { code: '23MX26', name: 'LAB : Java programming', credits: 2 },
	        { code: '23MX27', name: 'Mobile Application Development', credits: 2 },
	        { code: '23MX28', name: 'Professional Communication and Personality Development', credits: 1 },

        ],
        3: [
            { code: '23MX31', name: 'Cloud Computing', credits: 3 },
            { code: '23MX_', name: 'Elective 2', credits: 3 },
            { code: '23MX_', name: 'Elective 3', credits: 3 },
            { code: '23MX_', name: 'Elective 4', credits: 3 },
            { code: '23MX_', name: 'Elective 5', credits: 3 },
            { code: '23MX36', name: 'LAB : Cloud Computing', credits: 2 },
	        { code: '23MX37', name: 'Mini Project', credits: 4 },
	        { code: '23MXM_', name: 'Audit Course', credits: 0 },

        ],
        4: [
            { code: '23MX41', name: 'Project Work', credits: 12}
        ],
        // Add more semesters as needed
    };

    // Create semester sections
    selectedSemesters.forEach(semesterNum => {
        const semesterSection = createSemesterSection(semesterNum, courseData[semesterNum] || []);
        semestersContainer.appendChild(semesterSection);
    });

    // Enable/disable calculate button based on input validity
    document.addEventListener('input', () => {
        const allInputs = document.querySelectorAll('.grade-input');
        const isValid = Array.from(allInputs).every(input => {
            const value = parseFloat(input.value);
            return !isNaN(value) && value >= 0 && value <= 10;
        });
        calculateBtn.disabled = !isValid;
    });
});

function createSemesterSection(semesterNum, courses) {
    const section = document.createElement('div');
    section.className = 'semester-section';

    const header = document.createElement('div');
    header.className = 'semester-header';
    header.innerHTML = `
        <h2 class="semester-title">Semester ${semesterNum}</h2>
    `;

    const coursesGrid = document.createElement('div');
    coursesGrid.className = 'courses-grid';

    // Add grid headers
    coursesGrid.innerHTML = `
        <div class="grid-header">Code</div>
        <div class="grid-header">Course Name</div>
        <div class="grid-header">Credits</div>
        <div class="grid-header">Grade</div>
    `;

    // Add course rows
    courses.forEach(course => {
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row';
        courseRow.innerHTML = `
            <div class="course-code">${course.code}</div>
            <div class="course-name">${course.name}</div>
            <div class="course-credits">${course.credits}</div>
            <input type="number" class="grade-input" min="0" max="10" step="0.01" 
                   placeholder="0-10" required>
        `;
        coursesGrid.appendChild(courseRow);
    });

    section.appendChild(header);
    section.appendChild(coursesGrid);
    return section;
} 