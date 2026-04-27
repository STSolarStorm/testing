document.addEventListener('DOMContentLoaded', () => {
    // GET CLUB DATA FROM SERVER
    // Gets data from window.clubsData (set in index.pug)
    const clubs = window.clubsData || [];

    // If no data, something went wrong
    if (clubs.length === 0) {
        console.error('No club data found!');
        return;
    }

    console.log('Clubs loaded:', clubs); // Debug: check if data is loaded

    // SELECT ELEMENTS
    const cards = document.querySelectorAll('.club-card');
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('club-modal');
    const closeBtn = document.getElementById('close-btn');

    // Check if modal elements exist
    if (!overlay || !modal) {
        console.error('Modal elements not found in DOM');
        return;
    }

    // Modal content elements
    const modalName = document.getElementById('modal-name');
    const modalMeeting = document.getElementById('modal-meeting');
    const modalLocation = document.getElementById('modal-location');
    const modalBigDesc = document.getElementById('modal-bigdesc');
    const modalCommitment = document.getElementById('modal-commitment');
    const modalAdvisor = document.getElementById('modal-advisor');
    const modalOfficers = document.getElementById('modal-officers');
    const modalBanner = document.getElementById('modal-banner');
    const modalMore = document.getElementById('modal-more');

    // FUNCTION TO CLOSE MODAL
    function closeModal() {
        modal.classList.remove('is-visible')
        overlay.style.display = 'none';
    }

    // OPEN MODAL
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Get the club ID from the card's data attribute
            const clubId = card.dataset.id;
            console.log('Clicked card with ID:', clubId); // Debug

            // Find the matching club in our data
            const club = clubs.find(c => c.id == clubId);

            // If club not found, don't open modal
            if (!club) {
                console.error(`Club with id "${clubId}" not found in:`, clubs);
                return;
            }

            if (modalBigDesc) {
                const truncatedDesc = club.bigDesc && club.bigDesc.length > 150
                    ? club.bigDesc.substring(0, 150) + '...'
                    : (club.bigDesc || 'No description available.');
                modalBigDesc.textContent = truncatedDesc;
            }

            console.log('Found club:', club); // Debug

            // Populate modal with club information
            if (modalName) modalName.textContent = club.name;
            if (modalMeeting) modalMeeting.textContent = `Meeting: ${club.meeting}`;
            if (modalLocation) modalLocation.textContent = `Location: ${club.location || 'TBD'}`;
            if (modalBigDesc) modalBigDesc.textContent = club.bigDesc;
            if (modalCommitment) modalCommitment.textContent = `Commitment: ${club.commitment || 'TBD'}`;
            if (modalAdvisor) modalAdvisor.textContent = `Advisor: ${club.advisor || 'TBD'}`;
            if (modalOfficers) modalOfficers.textContent = `Officers: ${club.officers || 'TBD'}`;

            // Set banner image (with fallback)
            if (modalBanner) modalBanner.src = club.banner;

            // Set link to individual club page
            if (modalMore) modalMore.href = `/clubs/${club.id}`;

            // Show modal and overlay
            overlay.style.display = 'block';
            modal.classList.add('is-visible');
        });
    });

    // CLOSE MODAL
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside the modal (on the overlay)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('is-visible')) {
                closeModal();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function showPassword() {
        const x = document.getElementById("showpass");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }


})