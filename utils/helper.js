const { MONTHS_ES } = require('./constants');

function getMonth() {
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
  const month = date.split('/', 1)[0];
  if (+month < 10) {
    return `0${month}`;
  }
  return month;
}

function getDate() {
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
  const day = date.split('/', 2)[1];
  if (+day < 10) {
    return `0${day}`;
  }
  return day;
}

function getFullYear() {
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
  return date.split('/', 3)[2].split(',', 1)[0];
}

function getCurrentMonth() {
  const currentMonthIndex = +getMonth() - 1;
  return MONTHS_ES[currentMonthIndex];
}

function getPreviousMonth() {
  const currentMonthIndex = +getMonth() - 2;
  return MONTHS_ES[currentMonthIndex];
}

function getComingMonth() {
  const currentMonthIndex = getMonth();
  return MONTHS_ES[currentMonthIndex];
}

function getFormattedDate() {
  const year = getFullYear();
  const month = +getMonth();
  const day = getDate();
  const date = `${day}/${month}/${year}`.replace(/\s+/g, ' ').trim();
  return date;
}

const formatDateForDailySheet = () => {
  const month = getMonth();
  const day = getDate();
  return `${day}-${month}`;
};

const replaceAll = (str, match, replacement) => str.split(match).join(replacement);

module.exports = {
  getMonth,
  getCurrentMonth,
  getFormattedDate,
  getComingMonth,
  formatDateForDailySheet,
  replaceAll,
  getPreviousMonth,
};
