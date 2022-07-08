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
  Sentry.captureMessage(msg, 'warning');
};

const logError = (error) => {
  Sentry.captureException(error);
};

const logInfo = (info) => {
  Sentry.captureMessage(info);
};

module.exports = {
  init, logError, logWarning, logInfo,
};
