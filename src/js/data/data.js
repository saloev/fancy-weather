
const GLOBAL_DATA = localStorage.getItem('GLOBAL_DATA') ? JSON.parse(localStorage.getItem('GLOBAL_DATA')) : {
  currentLanguage: 'en',
  temperatureUnit: 'C',

  text: {
    lat: 'latitude',
    lon: 'longitude',
    searchPlaceHolder: 'Search city or ZIP',
    city: 'Saint Petersburg',
    windSpeed: 'Wind speed',
    humidity: 'Humidity',
    pressure: 'Pressure',
    feelsLike: 'Feels like',

    week0: 'Sunday',
    week1: 'Monday',
    week2: 'Tuesday',
    week3: 'Wednesday',
    week4: 'Thursday',
    week5: 'Friday',
    week6: 'Saturday',

    month0: 'January',
    month1: 'February',
    month2: 'March',
    month3: 'April',
    month4: 'May',
    month5: 'June',
    month6: 'July',
    month7: 'August',
    month8: 'September',
    month9: 'October',
    month10: 'November',
    month11: 'December',
  },

  languages: ['en', 'ru', 'be'],
};

localStorage.setItem('GLOBAL_DATA', JSON.stringify(GLOBAL_DATA));

export default GLOBAL_DATA;
