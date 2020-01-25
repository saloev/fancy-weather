import LSAPI from './LSAPI';

const newDate = (date) => (date ? new Date(date) : new Date());

const millisecond = (date = newDate()) => date.getMilliseconds();
const second = (date = newDate()) => date.getSeconds();
const minute = (date = newDate()) => (date.getMinutes() < 9 ? `0${date.getMinutes()}` : `${date.getMinutes()}`);
const hour = (date = newDate()) => (date.getHours() < 9 ? `0${date.getHours()}` : `${date.getHours()}`);
const day = (date = newDate()) => date.getDate();
const week = (date = newDate()) => {
  const { text } = LSAPI.getItem('GLOBAL_DATA');
  return text[`week${date.getDay()}`];
};
const month = (date = newDate()) => {
  const { text } = LSAPI.getItem('GLOBAL_DATA');
  return text[`month${date.getMonth()}`];
};

const dispatchFormat = {
  W: week,
  D: day,
  M: month,
  H: hour,
  m: minute,
  S: second,
  ms: millisecond,
};

const formatter = (arr, separator = ' ') => arr.reduce((acc, item) => `${acc}${dispatchFormat[item]()}${separator}`, '').slice(0, -1);

export default {
  month,

  currentDay(type = 'W-D-M') {
    return formatter(type.split('-'));
  },
  currentTime(type = 'H:m') {
    return formatter(type.split(':'), ':');
  },
  // format 2019-12-21 00:00:00
  normalizeWeek(date) {
    return week(newDate(date));
  },
};
