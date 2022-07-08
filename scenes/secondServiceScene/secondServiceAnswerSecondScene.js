const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { secondAnswer } = require('../../constants/secondAnswer/secondAnswer');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const checkText = require('../../common/checkText');
const Sentry = require('../../utils/sentry');

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('elevenServiceScene');
      break;
    case 2:
      ctx.scene.enter('humanChat');
      break;
    default:
  }
}

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondAnswer);
  return ctx.wizard.next();
};

const step2 = new Composer();

// listener for firstService
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
      return ctx.scene.enter('secondServiceScene');
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const secondServiceAnswerSecondScene = new WizardScene(
  'secondServiceAnswerSecondScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { secondServiceAnswerSecondScene };
