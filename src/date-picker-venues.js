import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

// Get elements from Webflow
const dateInput = document.querySelector('#date-picker');
const hourSelect = document.querySelector('#hour-picker');
const minuteSelect = document.querySelector('#minute-picker');
const isoInput = document.querySelector('#date-iso');

if (!dateInput || !hourSelect || !minuteSelect || !isoInput) {
    throw new Error('Required elements not found');
}

// Get min/max hours and disabled days
const minHour = parseInt(dateInput.getAttribute('data-min-hours')) || 22; // 10 PM
const maxHour = parseInt(dateInput.getAttribute('data-max-hours')) || 5;  // 5 AM
const disabledDays = dateInput.getAttribute('data-disabled-day') || ''; // e.g., "0" for Sunday

// Set initial date
const now = new Date();
const currentHour = now.getHours();
let initialDate = new Date(now);
if (currentHour >= maxHour && currentHour < minHour) {
    initialDate.setHours(minHour, 0, 0, 0);
} else if (currentHour >= minHour) {
    initialDate.setMinutes(0, 0, 0);
} else if (currentHour < maxHour) {
    initialDate.setDate(now.getDate() + 1);
    initialDate.setHours(minHour, 0, 0, 0);
}

// Generate hour options
const hourOptions = [];
if (minHour > maxHour) { // Overnight (e.g., 22–5)
    for (let h = minHour; h < 24; h++) hourOptions.push({ display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`, value: h });
    for (let h = 0; h <= maxHour; h++) hourOptions.push({ display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`, value: h });
} else { // Same day (e.g., 9–17)
    for (let h = minHour; h <= maxHour; h++) hourOptions.push({ display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`, value: h });
}

// Minute options
const minuteOptions = ['00', '15', '30', '45'];

// Populate hour dropdown
hourOptions.forEach(({ display, value }) => {
    const option = document.createElement('option');
    option.value = value;
    option.text = display;
    hourSelect.appendChild(option);
});
hourSelect.value = hourOptions.some(opt => opt.value === minHour) ? minHour : hourOptions[0].value;

// Populate minute dropdown
minuteOptions.forEach(minute => {
    const option = document.createElement('option');
    option.value = minute;
    option.text = minute;
    minuteSelect.appendChild(option);
});
minuteSelect.value = '00';

// Initialize datepicker
const dp = new AirDatepicker('#date-picker', {
    locale: localeEn,
    dateFormat: 'd/MMMM', // Day and month only
    timepicker: false,
    firstDay: 1, // Week starts on Monday
    minDate: new Date(),
    onRenderCell: ({ date, cellType }) => {
        if (cellType === 'day' && disabledDays.includes(date.getDay().toString())) {
            return {
                disabled: true,
                classes: 'disabled-class',
                attrs: { title: 'This day is disabled' }
            };
        }
    },
    onShow: updateInputValue,
    onSelect: ({ date }) => date && updateInputValue()
});

// Force initial date
dp.selectDate(initialDate);
dp.update();

// Update input value
function updateInputValue() {
    const selectedDate = dp.selectedDates[0] || initialDate;
    const hour = parseInt(hourSelect.value, 10);
    const minute = minuteSelect.value.padStart(2, '0');
    selectedDate.setHours(hour, parseInt(minute, 10), 0, 0);
    // Day and month only for display
    dateInput.value = `${selectedDate.getDate()}/${selectedDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
    // Full ISO for webhook
    isoInput.value = selectedDate.toISOString().slice(0, 16);
}

// Sync dropdowns with input
hourSelect.addEventListener('change', () => {
    updateInputValue();
    dp.selectDate(dp.selectedDates[0]);
});
minuteSelect.addEventListener('change', () => {
    updateInputValue();
    dp.selectDate(dp.selectedDates[0]);
});

// Initial update
updateInputValue();