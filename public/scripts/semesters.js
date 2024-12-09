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
    const selectedSemesters = new Set();

    // Add click event listeners to semester cards
    semesterCards.forEach(card => {
        card.addEventListener('click', function() {
            const semesterNumber = this.getAttribute('data-semester');
            
            // Toggle selection
            if (selectedSemesters.has(semesterNumber)) {
                // Unselect the card
                selectedSemesters.delete(semesterNumber);
                this.classList.remove('selected');
            } else {
                // For SGPA, clear previous selection
                if (isSGPA && selectedSemesters.size > 0) {
                    selectedSemesters.clear();
                    semesterCards.forEach(c => c.classList.remove('selected'));
                }
                
                // Select the card
                selectedSemesters.add(semesterNumber);
                this.classList.add('selected');
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