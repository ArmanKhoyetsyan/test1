const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const {
  secondServiceFirstAnswer,
} = require('../../constants/secondAnswer/secondAnswer');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const checkText = require('../../common/checkText');
const Sentry = require('../../utils/sentry');

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('secondServiceAnswerSecondScene');
      break;
    case 2:
      ctx.scene.enter('secondServiceThirdScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondServiceFirstAnswer);
  await ctx.replyWithVideo({ source: './images/VIDEOCHEQUE.MP4' });
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
      ctx.scene.enter('secondServiceScene');
      ctx.wizard.next();
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const secondServiceAnswerFirstScene = new WizardScene(
  'secondServiceAnswerFirstScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { secondServiceAnswerFirstScene };
