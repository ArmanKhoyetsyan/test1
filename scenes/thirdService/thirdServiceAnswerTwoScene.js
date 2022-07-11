const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const checkText = require('../../common/checkText');
const { secondAnswer } = require('../../constants/thirdAnswer');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');

const step1 = async (ctx) => {
  ctx.replyWithHTML(secondAnswer);
  return ctx.wizard.next();
};

const step2 = new Composer();

// listener for firstService
step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
    } else if (number === 2) {
      await ctx.scene.enter('thirdServiceTwoSceneCalculator');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      await ctx.scene.enter('thirdServiceScene');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const thirdServiceAnswerTwoScene = new WizardScene(
  'thirdServiceAnswerTwoScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { thirdServiceAnswerTwoScene };
