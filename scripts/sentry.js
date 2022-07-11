const Sentry = require('@sentry/node');
require('@sentry/tracing');
const { RewriteFrames } = require('@sentry/integrations');

const init = () => {
  Sentry.init({
    dsn: 'https://e4e1895c82bc45bfa059b5bf413b4a73@o1283802.ingest.sentry.io/6493767',
    tracesSampleRate: 1.0,
    integrations: [
      new RewriteFrames({
        // eslint-disable-next-line no-underscore-dangle
        root: global.__dirname,
      }),
    ],
    environment: process.env.ENV || 'development',
  });
};

const logWarning = (msg) => {
  if (typeof msg === 'string') {
    Sentry.captureException(new Error(msg, 'warning'));
    return '';
  }
  Sentry.captureMessage(msg, 'warning');
  return '';
};

const logError = (error) => {
  if (typeof error === 'string') {
    Sentry.captureException(new Error(error));
    return '';
  }
  Sentry.captureException(error);
  return '';
};

const logInfo = (info) => {
  if (typeof info === 'string') {
    Sentry.captureException(new Error(info));
    return '';
  }
  Sentry.captureMessage(info);
  return '';
};

module.exports = {
  init, logError, logWarning, logInfo,
};
