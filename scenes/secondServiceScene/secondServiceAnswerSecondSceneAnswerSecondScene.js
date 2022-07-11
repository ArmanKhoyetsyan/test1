const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');

const {
  secondServiceFirstAnswer,
} = require('../../constants/secondAnswer/secondAnswer');

const checkText = require('../../common/checkText');
const { userData } = require('../../common/data');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondServiceFirstAnswer);
  await ctx.replyWithVideo({ source: './images/VIDEOCHEQUE.MP4' });
  return ctx.wizard.next();
};

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.scene.enter('secondServiceAnswerSecondScene');
      break;
    case 2:
      await ctx.scene.enter('elevenServiceScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    ctx.wizard.state.serviceNumber = number;
    if (number && number <= 3) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      if (number === 0) {
        setStepPath(ctx, '0');
        ctx.scene.enter('secondServiceSecondScene');
      }
      return '';
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const secondServiceAnswerSecondSceneAnswerSecondScene = new WizardScene(
  'secondServiceAnswerSecondSceneAnswerSecondScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { secondServiceAnswerSecondSceneAnswerSecondScene };
