const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { fourthAnswer } = require('../../constants/elevenAnswer');

const checkText = require('../../common/checkText');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(fourthAnswer);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.enter('elevenServiceScene');
      ctx.wizard.next();
    } else if (number === 2) {
      setStepPath(ctx, number);
      ctx.scene.enter('elevenServiceFourthAnswerScene2Scene');
      ctx.wizard.next();
    } else if (number === 3) {
      setStepPath(ctx, number);
      ctx.scene.enter('elevenServiceFourthAnswerScene3Scene');
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const elevenServiceFourthAnswerScene = new WizardScene(
  'elevenServiceFourthAnswerScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { elevenServiceFourthAnswerScene };
