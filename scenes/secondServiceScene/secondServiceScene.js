const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { secondService, SERVICES } = require('../../constants');
const checkText = require('../../common/checkText');
const { redirect } = require('../../common/firstListenerRedirect');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(secondService);
  return ctx.wizard.next();
};
async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('secondServiceFirstScene');
      break;
    case 2:
      ctx.scene.enter('secondServiceSecondScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('secondServiceThirdScene');
      break;
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 3) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      redirect(ctx, number, SERVICES);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const secondServiceScene = new WizardScene(
  'secondServiceScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { secondServiceScene };
