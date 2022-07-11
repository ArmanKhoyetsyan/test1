const { CronJob } = require('cron');
const { createMonthlySheet, updateRate } = require('./utils/sheet');
const Sentry = require('./sentry');

Sentry.init();

function getMonth() {
  const date = new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });
  return date.split('/', 1)[0];
}

// eslint-disable-next-line no-new
new CronJob(
  // *** At 09:00 on the 30th. ***

  '0 09 30 * *',
  (() => {
    if (Number(getMonth()) !== 1) createMonthlySheet();
  }),
  null,
  true,
  'America/Argentina/Buenos_Aires',
);

// eslint-disable-next-line no-new
new CronJob(
  // ***  February 28 At 09:00. ***

  '0 09 27 * *',
  (() => {
    if (Number(getMonth()) === 1) createMonthlySheet();
  }),
  null,
  true,
  'America/Argentina/Buenos_Aires',
).start();

// eslint-disable-next-line no-new
new CronJob(
  // ***  At 08:50. ***

  '50 8 * * *',
  (() => {
    updateRate();
  }),
  null,
  true,
  'America/Argentina/Buenos_Aires',
);

// // eslint-disable-next-line no-new
// new CronJob(
//   // ***  Create a daily sheet every day ***

//   '0 20 * * *',
//   (() => {
//     if (new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })
// .getMonth() === 1) createSheet('day');
//   }),
//   null,
//   true,
//   "America/Argentina/Buenos_Aires",
// );
