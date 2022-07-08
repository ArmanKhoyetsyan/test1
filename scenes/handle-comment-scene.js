const checkText = require('../common/checkText');
const { userData } = require('../common/data');
const { setStepPath } = require('../common/setStepPath');
const { createMessageForEmail } = require('../common/createMessageForEmail');
const { sendMailMessage } = require('../mailConfig');
const { addDataToSheets } = require('../services/sheets.service');
const { restartBot } = require('../common/restartBot');
const Sentry = require('../utils/sentry');

const sendEmail = (ctx, userId, paymentMethod, callback) => {
  const {
    first_name: firstName,
    last_name: lastName,
    username,
  } = ctx.message.chat;
  const text = createMessageForEmail(ctx, firstName, lastName, username, paymentMethod);
  if (text) {
    sendMailMessage(
      `${paymentMethod} | ${firstName || ''} ${lastName || ''}`,
      text,
      userId,
      callback,
    );
  }
};

async function handleCommentScene(ctx, paymentMethod) {
  try {
    const number = checkText(ctx);
    const userId = ctx.message.from.id;

    if (number === 1) {
      setStepPath(ctx, number);
      const dataForSheet = JSON.parse(JSON.stringify(userData[userId]));
      sendEmail(ctx, userId, paymentMethod, async () => {
        ctx.scene.enter('doneMsg');
        await addDataToSheets(dataForSheet, ctx.wizard.state);
      });
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      userData[userId].comment += `<p>${ctx.message.text}<p>`;
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
}

module.exports = { handleCommentScene };
