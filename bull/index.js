const Queue = require('bull');
const { usersCtx } = require('../common/data');
const Sentry = require('../utils/sentry');

const SEND_FEEDBACK_DELAY = 1000 * 60 * 20;

async function sendFeedbackMsg(job) {
  try {
    const { sheetTitle, userId } = job.data;
    // eslint-disable-next-line no-underscore-dangle
    if (usersCtx[userId]?.session?.__scenes?.current !== 'feedbackScene') {
      usersCtx[userId].sheetTitle = sheetTitle;
      // eslint-disable-next-line no-underscore-dangle
      usersCtx[userId].session.__scenes.cursor = 0;
      await usersCtx[userId].scene.enter('feedbackScene');
    }
  } catch (error) {
    Sentry.logError(error);
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

const queue = new Queue('Feedback request', process.env.REDIS_URI);
queue.process(async (job) => { sendFeedbackMsg(job); });

function scheduleFeedbackMsg(sheetTitle, userId) {
  try {
    queue.add({ sheetTitle, userId }, {
      repeat: {
        every: SEND_FEEDBACK_DELAY,
        limit: 1,
      },
    });
  } catch (error) {
    Sentry.logError(error);
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

module.exports = { scheduleFeedbackMsg };
