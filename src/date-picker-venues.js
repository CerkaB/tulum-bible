import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

// Get elements from Webflow
const dateInput = document.querySelector('#date-picker');
const hourSelect = document.querySelector('#hour-picker');
const minuteSelect = document.querySelector('#minute-picker');

if (!dateInput || !hourSelect || !minuteSelect) {
    throw new Error('Required elements not found: #date-picker, #hour-picker, or #minute-picker');
}

// Get attributes from date input
const maxHours = dateInput.getAttribute('data-max-hours');
const minHours = dateInput.getAttribute('data-min-hours');
const disabledDays = dateInput.getAttribute('data-disabled-day') || '';

// Parse min/max hours with defaults
const minHour = minHours ? parseInt(minHours, 10) : 22; // e.g., 10 PM
const maxHour = maxHours ? parseInt(maxHours, 10) : 5;  // e.g., 5 AM

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

// Generate hour options dynamically from minHour to maxHour
const hourOptions = [];
if (minHour > maxHour) { // Overnight range (e.g., 22–5)
    for (let h = minHour; h < 24; h++) {
        hourOptions.push({
            display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`,
            value: h
        });
    }
    for (let h = 0; h <= maxHour; h++) {
        hourOptions.push({
            display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`,
            value: h
        });
    }
} else { // Same-day range (e.g., 9–17)
    for (let h = minHour; h <= maxHour; h++) {
        hourOptions.push({
            display: `${h % 12 || 12}:00 ${h >= 12 ? 'pm' : 'am'}`,
            value: h
        });
    }
}

// Minute options (00, 15, 30, 45)
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
    dateFormat: 'd/MMM/yy',
    timepicker: false,
    firstDay: 1,
    minDate: new Date(),
    onRenderCell: function({ date, cellType }) {
        if (cellType === 'day' && disabledDays.includes(date.getDay().toString())) {
            return {
                disabled: true,
                classes: 'disabled-class',
                attrs: { title: 'This day is disabled' }
            };
        }
    },
    onShow: function() {
        updateInputValue();
    },
    onSelect: function({ date }) {
        if (!date) return;
        updateInputValue();
    }
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
    const hourOption = hourOptions.find(opt => opt.value === hour) || hourOptions[0]; // Fallback to first option
    const hourDisplay = hourOption.display.split(':')[0];
    const formattedDate = `${selectedDate.getDate()}/${selectedDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}/${String(selectedDate.getFullYear()).slice(-2)} ${hourDisplay}:${minute} ${hour >= 12 ? 'pm' : 'am'}`;
    dateInput.value = formattedDate;
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