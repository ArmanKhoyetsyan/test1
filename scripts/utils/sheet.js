const axios = require('axios').default;
const Sentry = require('../sentry');

function sendRequest(type, method) {
  // *** type should be day or month ***
  const config = {
    method,
    url: `http://localhost:3000/${type}`,
    headers: {
      api_key: 'mh3psCz5WhMMf2pTHoxk7OtBDxUxfZSsd',
    },
  };

  return axios(config);
}

function createMonthlySheet() {
  Sentry.logInfo('Creating monthly sheet...');
  sendRequest('sheet/month', 'post').then((result) => {
    if (result.status === 200) {
      Sentry.logInfo('Created monthly sheet.');
    } else {
      Sentry.logError(result.msg);
    }
  })
    .catch((err) => {
      Sentry.logError(err);
    });
}

function updateRate() {
  Sentry.logInfo('Updating blue dollar rate...');
  sendRequest('sheet/rate', 'put')
    .then((result) => {
      if (result.status === 200) {
        // eslint-disable-next-line no-console
        console.log('Updated blue dollar rate.');
        Sentry.logInfo('Updated blue dollar rate.');
      } else {
        throw new Error(result.msg);
      }
    })
    .catch((err) => {
      Sentry.logError(err);
    });
}

module.exports = { createMonthlySheet, updateRate };
