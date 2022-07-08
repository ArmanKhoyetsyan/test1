const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const {
  thirdAnswer,
} = require('../../../constants/secondAnswer/firstAnswers');

const { restartBot } = require('../../../common/restartBot');
const checkText = require('../../../common/checkText');
const { setStepPath } = require('../../../common/setStepPath');
const Sentry = require('../../../utils/sentry');

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('secondServiceFirstSceneSecondAnswer');
      break;
    case 2:
      ctx.scene.enter('humanChat');
      break;
    default:
      await ctx.scene.enter('secondSceneFirstAnswerThirdSceneThirdAnswer');
      break;
  }
}

const step1 = async (ctx) => {
  await ctx.replyWithHTML(thirdAnswer);
  return ctx.wizard.next();
};

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
      return ctx.scene.leave();
    } else {
      if (number === 0) {
        setStepPath(ctx, '0');
        ctx.scene.enter('secondServiceFirstScene');
      }
      return ctx.scene.reenter();
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const secondSceneFirstAnswerThirdScene = new WizardScene(
  'secondSceneFirstAnswerThirdScene',
  (ctx) => step1(ctx),
  step2,
);

module.exports = { secondSceneFirstAnswerThirdScene };
