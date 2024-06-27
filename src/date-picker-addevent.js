import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

// Get the input element
const inputElement = document.querySelector('#date-picker');
// Create a hidden input to store the Airtable-compatible date
const hiddenInputForAirtable = document.createElement('input');
hiddenInputForAirtable.type = 'hidden';
hiddenInputForAirtable.name = 'airtableDate';
document.body.appendChild(hiddenInputForAirtable);

new AirDatepicker(inputElement, {
    locale: localeEn,
    dateFormat: 'd/mmm/yy', // User-friendly format for display
    firstDay: 1,
    minDate: new Date(),
    onSelect({date}) {
        // Format the date as YYYY-MM-DD for Airtable and store it in the hidden input
        const formattedDateForAirtable = date.toISOString().split('T')[0];
        hiddenInputForAirtable.value = formattedDateForAirtable;
    }
});