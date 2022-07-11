const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
// TODO: thirteenService is commented, decide what to do?
const { thirteenService, SERVICES } = require('../constants');
const checkText = require('../common/checkText');
const { redirect } = require('../common/firstListenerRedirect');
const Sentry = require('../utils/sentry');
const { userData } = require('../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(thirteenService);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    redirect(ctx, number, SERVICES);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const thirteenServiceScene = new WizardScene(
  'thirteenServiceScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { thirteenServiceScene };
