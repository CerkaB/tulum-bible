import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

// Get the input element
const inputElement = document.querySelector('#date-picker');
// Get the maxHours attribute
const maxHours = inputElement.getAttribute('data-max-hours');
// Get the minHours attribute
const minHours = inputElement.getAttribute('data-min-hours');
// Get the disabled day attribute
const disabledDays = inputElement.getAttribute('data-disabled-day');

new AirDatepicker('#date-picker', {
    locale: localeEn,
    dateFormat: 'd/MMM/yy',
    timeFormat: 'h:mm',
    timepicker: true,
    firstDay: 1,
    minHours: minHours ? parseInt(minHours, 10) : 9,
    maxHours: maxHours ? parseInt(maxHours, 10) : 23,
    minutesStep: 15,
    minDate: new Date(),
    onRenderCell: function({date, cellType}) {
        // Disable the specified day of the week
        if (cellType === 'day' && disabledDays.includes(date.getDay())) {
            return {
                disabled: true,
                classes: 'disabled-class',
                attrs: {
                    title: 'This day is disabled'
                }
            }
        }
    },
    onShow: function(inst) {
        // Set the initial time to the minimum hours when the date picker is shown
        const minHour = minHours ? parseInt(minHours, 10) : 9;
        const currentDate = new Date();
        currentDate.setHours(minHour, 0, 0, 0);
        inst.selectDate(currentDate);
    }
});