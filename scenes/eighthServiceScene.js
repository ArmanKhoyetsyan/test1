const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { eighthService, SERVICES } = require('../constants');
const checkText = require('../common/checkText');
const { redirect } = require('../common/firstListenerRedirect');
const { restartBot } = require('../common/restartBot');
const { setStepPath } = require('../common/setStepPath');
const Sentry = require('../utils/sentry');

const step1 = (ctx) => {
  ctx.replyWithHTML(eighthService);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      redirect(ctx, number, SERVICES);
    }
  } catch (err) {
    Sentry.logError(err);
  }
});

const eighthServiceScene = new WizardScene(
  'eighthServiceScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { eighthServiceScene };
