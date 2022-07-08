const Sentry = require('@sentry/node');
require('@sentry/tracing');
const { RewriteFrames } = require('@sentry/integrations');

const init = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new RewriteFrames({
        // eslint-disable-next-line no-underscore-dangle
        root: global.__dirname,
      }),
    ],
    environment: process.env.ENV,
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
