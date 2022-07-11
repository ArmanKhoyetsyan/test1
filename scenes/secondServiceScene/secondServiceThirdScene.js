const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const { secondServiceThird } = require('../../constants/secondService');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const Sentry = require('../../utils/sentry');

const {
  firstAnswer,
  // secondAnswer,
  thirdAnswer,
  fourthAnswer,
} = require('../../constants/secondAnswer/thirdAnswer');

const checkText = require('../../common/checkText');
const { userData } = require('../../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(secondServiceThird);
  return ctx.wizard.next();
};

async function checkNumberForFirstAnswer(ctx, number) {
  switch (number) {
    case 1:
      await ctx.scene.enter('thirdServiceAnswerSecondScene');
      break;
    case 2:
      await ctx.scene.enter('elevenServiceScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkNumberForSecondAnswer(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('secondServiceAnswerFirstScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkNumberForFourthAnswer(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('thirdServiceAnswerSecondScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.replyWithHTML(firstAnswer);
      await ctx.replyWithVideo({ source: './images/VIDEOCHEQUE.MP4' });
      break;
    case 2:
      ctx.scene.enter('thirdServiceAnswerSecondScene');
      break;
    case 3:
      ctx.wizard.state.calc = true;
      await ctx.replyWithHTML(thirdAnswer);
      break;
    default:
      await ctx.replyWithHTML(fourthAnswer);
      break;
  }
}

const step2 = new Composer();
step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    ctx.wizard.state.serviceNumber = number;
    if (number && number <= 4) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      if (number === 0) {
        setStepPath(ctx, '0');
        ctx.scene.enter('secondServiceScene');
      }
      return ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

async function checkAnswer(ctx, number) {
  const { serviceNumber } = ctx.wizard.state;
  if (ctx.wizard.state.calc) {
    await ctx.scene.enter('secondServiceSecondSceneThirdScene');
    ctx.scene.leave();
  } else {
    switch (serviceNumber) {
      case 1:
        checkNumberForFirstAnswer(ctx, number);
        break;
      case 2:
        checkNumberForSecondAnswer(ctx, number);
        break;
      case 3:
        await ctx.scene.enter('thirdServiceAnswerSecondScene');
        break;
      default:
        checkNumberForFourthAnswer(ctx, number);
        break;
    }
  }
}

const step3 = new Composer();

step3.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 4) {
      setStepPath(ctx, number);
      checkAnswer(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      return ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const secondServiceThirdScene = new WizardScene(
  'secondServiceThirdScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { secondServiceThirdScene };
