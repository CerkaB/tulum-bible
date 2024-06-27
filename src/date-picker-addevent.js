import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

new AirDatepicker('#date-picker', {
    locale: localeEn,
    dateFormat: 'dd/MMM/yy',
    firstDay: 1,
    minDate: new Date(),
});