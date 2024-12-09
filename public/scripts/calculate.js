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

    // Course data for all semesters
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
        ]
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

// Store results for PDF generation
let lastResults = null;
let lastCGPA = null;

function calculateResults() {
    const semesterSections = document.querySelectorAll('.semester-section');
    const results = [];
    let totalCredits = 0;
    let totalPoints = 0;

    semesterSections.forEach(section => {
        const semesterNum = section.querySelector('.semester-title').textContent.split(' ')[1];
        const courses = section.querySelectorAll('.course-row');
        let semesterCredits = 0;
        let semesterPoints = 0;

        courses.forEach(course => {
            const credits = parseFloat(course.querySelector('.course-credits').textContent);
            const grade = parseFloat(course.querySelector('.grade-input').value);
            semesterCredits += credits;
            semesterPoints += credits * grade;
        });

        const semesterGPA = semesterPoints / semesterCredits;
        results.push({
            semester: semesterNum,
            gpa: semesterGPA.toFixed(3)
        });

        totalCredits += semesterCredits;
        totalPoints += semesterPoints;
    });

    const cgpa = (totalPoints / totalCredits).toFixed(3);
    displayResults(results, cgpa);
}

function displayResults(results, cgpa) {
    lastResults = results;
    lastCGPA = cgpa;

    const resultsContainer = document.querySelector('.results-container');
    const semesterResults = document.querySelector('.semester-results');
    const finalResult = document.querySelector('.final-result');

    // Clear previous results
    semesterResults.innerHTML = '';
    finalResult.innerHTML = '';

    // Add semester results
    results.forEach((result, index) => {
        const card = document.createElement('div');
        card.className = 'semester-result-card';
        card.style.animationDelay = `${index * 0.2}s`;
        card.innerHTML = `
            <h3>Semester ${result.semester}</h3>
            <div class="gpa-value">${result.gpa}</div>
        `;
        semesterResults.appendChild(card);
    });

    // Add final result
    finalResult.innerHTML = `
        <h3>${results.length > 1 ? 'CGPA' : 'SGPA'}</h3>
        <div class="final-gpa">${cgpa}</div>
    `;

    // Show results container
    resultsContainer.classList.add('show');
}

function showUserDetailsModal() {
    const modal = document.querySelector('.user-details-modal');
    modal.classList.add('show');
}

function hideUserDetailsModal() {
    const modal = document.querySelector('.user-details-modal');
    modal.classList.remove('show');
}

function generatePDFWithUserDetails(results, cgpa, userDetails) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
        title: '23MX GPA Calculator Results',
        subject: 'GPA Calculation Report',
        author: '23MX',
        keywords: 'gpa, calculator, results',
        creator: '23MX GPA Calculator'
    });

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 255, 136);
    doc.text('23MX GPA Calculator Results', 105, 20, { align: 'center' });

    // Add student details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${userDetails.name}`, 14, 40);
    doc.text(`Register No: ${userDetails.regNo}`, 14, 48);
    doc.text(`Department: ${userDetails.department}`, 14, 56);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 196, 40, { align: 'right' });

    // Add course details for each semester
    let yPos = 70;
    const semesterSections = document.querySelectorAll('.semester-section');
    
    semesterSections.forEach((section, index) => {
        // Add semester header
        const semesterNum = section.querySelector('.semester-title').textContent;
        doc.setFontSize(14);
        doc.setTextColor(0, 255, 136);
        doc.text(semesterNum, 14, yPos);
        
        // Prepare table data
        const courses = section.querySelectorAll('.course-row');
        const tableData = Array.from(courses).map(course => [
            course.querySelector('.course-code').textContent,
            course.querySelector('.course-name').textContent,
            course.querySelector('.course-credits').textContent,
            course.querySelector('.grade-input').value
        ]);

        // Add course table
        doc.autoTable({
            startY: yPos + 5,
            head: [['Code', 'Course Name', 'Credits', 'Grade']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 255, 136],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            margin: { left: 14 }
        });

        // Add semester GPA
        const semesterGPA = results[index].gpa;
        yPos = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 255, 136);
        doc.text(`Semester GPA: ${semesterGPA}`, 14, yPos);

        yPos += 20;

        // Add new page if needed
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
    });

    // Add final result
    doc.setFontSize(16);
    doc.setTextColor(0, 255, 136);
    const finalText = results.length > 1 ? 'CGPA' : 'SGPA';
    doc.text(`Final ${finalText}: ${cgpa}`, 105, yPos, { align: 'center' });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save('23MX_GPA_Results.pdf');
}

// Add event listeners
document.querySelector('.calculate-btn').addEventListener('click', calculateResults);
document.querySelector('.close-results').addEventListener('click', () => {
    document.querySelector('.results-container').classList.remove('show');
});
document.querySelector('.download-pdf').addEventListener('click', () => {
    if (lastResults && lastCGPA) {
        showUserDetailsModal();
    }
});
document.querySelector('.close-modal').addEventListener('click', hideUserDetailsModal);
document.getElementById('userDetailsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userDetails = {
        name: document.getElementById('studentName').value,
        regNo: document.getElementById('regNo').value,
        department: document.getElementById('department').value
    };
    hideUserDetailsModal();
    generatePDFWithUserDetails(lastResults, lastCGPA, userDetails);
}); 