const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const checkText = require('../common/checkText');
const { restartBot } = require('../common/restartBot');
const { setStepPath } = require('../common/setStepPath');
const Sentry = require('../utils/sentry');
const { userData } = require('../common/data');
const { getSpreadsheetColumn, updateValues } = require('../services/sheets.service');

let sheetTitle;

async function addFeedbackToSheet(ctx, userId) {
  const dataInSheet = await getSpreadsheetColumn(sheetTitle, '!B:B');
  dataInSheet[0].forEach((element, i) => {
    if (element === ctx.message.chat.username) {
      updateValues(sheetTitle, `O${i + 1}`, [[userData[userId].feedback]]);
    }
  });
}

const step1 = (ctx) => {
  ctx.replyWithHTML('Por favor, deje comentarios sobre nuestros servicios. Ingrese 1 después de enviar el texto');
  sheetTitle = ctx.sheetTitle;
  ctx.sheetTitle = null;
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    const userId = ctx.message.from.id;

    if (number === 1) {
      setStepPath(ctx, number);
      ctx.replyWithHTML('¡Gracias!');
      addFeedbackToSheet(ctx, userId);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      userData[userId].feedback += `${ctx.message.text}\n`;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  try {
    restartBot(ctx);
    ctx.scene.leave();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});
const feedbackScene = new WizardScene(
  'feedbackScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { feedbackScene };
