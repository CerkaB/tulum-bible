import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

// Get the input element
const inputElement = document.querySelector('#date-picker');

new AirDatepicker('#date-picker', {
    locale: localeEn,
    dateFormat: 'mm/dd/yy',
    firstDay: 1,
    minDate: new Date(),
});