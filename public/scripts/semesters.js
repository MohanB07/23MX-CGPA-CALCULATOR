document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    // Redirect to home if no mode is specified
    if (!mode) {
        window.location.href = '/';
        return;
    }

    const isSGPA = mode === 'sgpa';
    const semesterCards = document.querySelectorAll('.semester-card');
    const proceedBtn = document.querySelector('.proceed-btn');
    let selectedSemesters = new Set();

    semesterCards.forEach(card => {
        card.addEventListener('click', () => {
            if (isSGPA) {
                // SGPA mode: only one selection allowed
                semesterCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedSemesters.clear();
                selectedSemesters.add(card.dataset.semester);
            } else {
                // CGPA mode: multiple selections allowed
                card.classList.toggle('selected');
                if (card.classList.contains('selected')) {
                    selectedSemesters.add(card.dataset.semester);
                } else {
                    selectedSemesters.delete(card.dataset.semester);
                }
            }

            // Enable/disable proceed button based on selection
            proceedBtn.disabled = selectedSemesters.size === 0;
        });
    });

    proceedBtn.addEventListener('click', () => {
        const selectedSem = Array.from(selectedSemesters).sort().join(',');
        // Navigate to the calculation page with selected semesters
        window.location.href = `/calculate.html?mode=${mode}&semesters=${selectedSem}`;
    });
}); 