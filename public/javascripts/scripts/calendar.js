
//Calendar Events
document.addEventListener('DOMContentLoaded', function () {
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopup = document.getElementById('closePopup');
    const calPop = document.getElementById('calPop');


    const popupOverlay2 = document.getElementById('popupOverlayEvent');
    const closePopup2 = document.getElementById('closePopupEvent');
    const calPop2 = document.getElementById('calPopEvent');


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


    // Function to open the popup
    function openPopup2() {
        popupOverlay2.style.display = 'block';

    }

    // Function to close the popup
    function closePopupFunc2() {
        popupOverlay2.style.display = 'none';
    }
    calPop2.addEventListener('click', openPopup2);


    // Close the popup when the close button is clicked
    closePopup2.addEventListener('click', closePopupFunc2);
    // Close the popup when clicking outside the popup content
    popupOverlay2.addEventListener('click', function (event) {
        if (event.target === popupOverlay2) {
            closePopupFunc2();
        }
    });
});



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

            day.id = 'calPop';

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



/*
// --> Calendar Events <--
    const events = [];

    const eventName = document.getElementById('event_name');
    const eventDate = document.getElementById('event_date');
    const eventStartTime = document.getElementById('event_start_time');
    const eventEndTime = document.getElementById('event_end_time');
    const eventInfo = document.getElementById('event_info');


    // Counter to generate unique event IDs
    let eventIdCounter = 1;

// Function to add events
    function addEvent() {
        let name = eventName.value;
        let date = eventDate.value;
        let startTime = eventStartTime.value;
        let endTime = eventEndTime.value;
        let description = eventInfo.value;

        if (date && name) {
            // Create a unique event ID
            let eventId = eventIdCounter++;

            events.push(
                {
                    id: eventId,
                    name: name,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    description: description
                }
            );
            renderCalendar(currentMonth, currentYear);
            eventName.value = "";
            eventDate.value = "";
            eventStartTime.value = "";
            eventEndTime.value = "";
            eventInfo.value = "";
        }
    }

// Function to delete an event by ID
    function deleteEvent(eventId) {
        // Find the index of the event with the given ID
        let eventIndex =
            events.findIndex((event) =>
                event.id === eventId);

        if (eventIndex !== -1) {
            // Remove the event from the events array
            events.splice(eventIndex, 1);
            renderCalendar(currentMonth, currentYear);
        }
    }


 */




});


