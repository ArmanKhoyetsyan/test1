const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { thirdService, SERVICES } = require('../../constants');
const { firstAnswer, thirdAnswer } = require('../../constants/thirdAnswer');
const checkText = require('../../common/checkText');
const { redirect } = require('../../common/firstListenerRedirect');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(thirdService);
  return ctx.wizard.next();
};

async function checkNumberForAnswer(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('humanChat');
      break;
    case 2:
      ctx.scene.enter('secondServiceSecondScene');
      break;
    default:
  }
}

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.replyWithHTML(firstAnswer);
      break;
    case 2:
      await ctx.scene.enter('thirdServiceAnswerTwoScene');
      break;
    default:
      await ctx.replyWithHTML(thirdAnswer);
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

const step3 = new Composer();

// listener for firstService answer
step3.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 2) {
      setStepPath(ctx, number);
      checkNumberForAnswer(ctx, number);
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const thirdServiceScene = new WizardScene(
  'thirdServiceScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { thirdServiceScene };
