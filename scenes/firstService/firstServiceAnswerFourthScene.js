const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { SERVICES } = require('../../constants');
const { setStepPath } = require('../../common/setStepPath');
const {
  fourthAnswer,
} = require('../../constants/firstAnswer');

const checkText = require('../../common/checkText');
const { redirect } = require('../../common/firstListenerRedirect');
const { restartBot } = require('../../common/restartBot');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(fourthAnswer);
  return ctx.wizard.next();
};

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.scene.enter('firstServiceAnswerTwoScene');
      break;
    default:
      ctx.scene.enter('humanChat');
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 2) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      redirect(ctx, number, SERVICES);
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const firstServiceAnswerFourthScene = new WizardScene(
  'firstServiceAnswerFourthScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { firstServiceAnswerFourthScene };
