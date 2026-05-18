//Calendar Events

//Open Events Form
document.addEventListener('DOMContentLoaded', function () {

    const popupOverlay = document.getElementById('popupOverlay');
    const closePopup = document.getElementById('closePopup');
    const calPop = document.getElementById('calPop');

    const  eventForm = document.querySelector('form.eventForm');

    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('button[type="submit"]');

            // If the button is already disabled, stop the submission
            if (submitBtn.disabled) {
                e.preventDefault();
            }

            submitBtn.disabled = true;
        });
    }


    // Function to open the popup
    function openPopup() {
        popupOverlay.style.display = 'block';

    }

    // Function to close the popup
    function closePopupFunc() {
        popupOverlay.style.display = 'none';
    }
    calPop.addEventListener('click', openPopup);


    // Close the popup when the close button is clicked
    closePopup.addEventListener('click', closePopupFunc);
    // Close the popup when clicking outside the popup content
    popupOverlay.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            closePopupFunc();
        }
    });

});



// Popup Event Card
document.addEventListener('DOMContentLoaded', function () {
    const events = window.eventsData || [];

    // If no data, something went wrong
    if (events.length === 0) {
        console.error('No event data found!');
        return;
    }

    console.log('Events loaded:', events); // Debug: check if data is loaded


    const eventcards = document.querySelectorAll('.event-card');


    eventcards.forEach(card => {
        // Find the elements specific to THIS card
        const overlay = card.querySelector('.popupOverlayEvent');
        const closeBtn = card.querySelector('.closePopupEvent');

        // OPEN: Clicking the card opens its specific overlay
        card.addEventListener('click', (e) => {
            // Stop the click from triggering if we clicked the "Remove" button
            if (e.target.classList.contains('button-cancel')) return;

            overlay.style.display = 'block';
        });

        // CLOSE: Clicking the 'x' inside this specific card
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the card click from re-opening it
            overlay.style.display = 'none';
        });

        // CLOSE: Clicking outside the content (on the overlay)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                e.stopPropagation();
                overlay.style.display = 'none';
            }
        });

        // CLOSE: Pressing down escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                overlay.style.display = 'none';
            }
        })

    });
})



// Calendar
document.addEventListener('DOMContentLoaded', function () {
    const calendarDates = document.querySelector('.calendar-dates');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];


    function renderCalendar(month, year) {
        calendarDates.innerHTML = '';
        monthYear.textContent = `${months[month]} ${year}`;

        // Get events data
        const events = window.eventsData || [];

        // Get the first day of the month
        const firstDay = new Date(year, month, 1).getDay();

        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create blanks for days of the week before the first day
        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement('div');
            calendarDates.appendChild(blank);
        }

        // Get today's date
        const today = new Date();

        // Populate the days
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');

            day.textContent = i;

            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            // Find events on this specific day
            const dayEvents = events.filter(event => {
                // Adjust this if your event.eventdate format is different (e.g., ISO string)
                return event.eventdate.startsWith(dateString);
            });

            // If there are events, add a class and a small indicator
            if (dayEvents.length > 0) {
                day.classList.add('has-event');

                // Add a small dot or the title of the first event
                const marker = document.createElement('span');
                marker.classList.add('event-marker');
                marker.textContent = ' •'; // Or dayEvents[0].eventtitle
                day.appendChild(marker);

            }

            // Highlight today's date
            if (
                i === today.getDate() &&
                year === today.getFullYear() &&
                month === today.getMonth()
            ) {
                day.classList.add('current-date');
            }

            calendarDates.appendChild(day);
        }
    }


    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    renderCalendar(currentMonth, currentYear);

});


