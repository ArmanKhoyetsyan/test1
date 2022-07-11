const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const { secondServiceSecond } = require('../../constants/secondService');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { setSkipLinkQuestion } = require('./secondServiceFirstScene/sendLink');
const { userData } = require('../../common/data');
const Sentry = require('../../utils/sentry');

const {
  thirdAnswer,
} = require('../../constants/secondAnswer/secondAnswer');

const checkText = require('../../common/checkText');

const step1 = (ctx) => {
  ctx.replyWithHTML(secondServiceSecond);
  return ctx.wizard.next();
};

async function checkNumberForFirstAnswer(ctx, number) {
  switch (number) {
    case 1:
      await ctx.scene.enter('secondServiceAnswerSecondScene');
      break;
    case 2:
      await ctx.scene.enter('secondServiceThirdScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkNumberForSecondAnswer(ctx, number) {
  switch (number) {
    case 1:
      setSkipLinkQuestion(true);
      ctx.scene.enter('secondServiceFirstSceneSecondAnswer');
      break;
    case 2:
      ctx.scene.enter('imageScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkNumberFourthAnswer(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('secondServiceAnswerSecondScene');
      break;
    default:
      ctx.scene.enter('humanChat');
      break;
  }
}

async function checkAnswer(ctx, number) {
  const { serviceNumber } = ctx.wizard.state;
  switch (serviceNumber) {
    case 1:
      checkNumberForFirstAnswer(ctx, number);
      break;
    case 2:
      checkNumberForSecondAnswer(ctx, number);
      break;
    case 3:
      ctx.scene.enter('secondServiceAnswerSecondScene');
      break;
    default:
      checkNumberFourthAnswer(ctx, number);
      break;
  }
}

async function checkNumber(ctx, number) {
  const userId = ctx.message.from.id;
  switch (number) {
    // case 1:
    //   await ctx.scene.enter('secondServiceAnswerSecondSceneAnswerSecondScene');
    //   break;
    case 1:
      setSkipLinkQuestion(true);
      userData[userId].paymentService = 'CHEQUE PAYPAL';
      ctx.scene.enter('secondServiceFirstSceneSecondAnswer');
      break;
    default:
      userData[userId].paymentService = 'CHEQUE PAYPAL';
      ctx.wizard.state.calc = true;
      await ctx.replyWithHTML(thirdAnswer);
      break;
    // default:
    //   await ctx.replyWithHTML(fourthAnswer);
    //   break;
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    ctx.wizard.state.serviceNumber = number;
    if (number && number <= 2) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      return ctx.scene.enter('secondServiceScene');
    } else {
      return ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (ctx.wizard.state.secondAnswer && number === 1) {
      ctx.scene.enter('elevenServiceScene');
      return '';
    }

    if (ctx.wizard.state.calc && number === 2) {
      ctx.scene.enter('secondSceneSecondAnswerThirdSceneSecondAnswer');
    } else if (number && number <= 4) {
      setStepPath(ctx, number);
      checkAnswer(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      ctx.scene.reenter();
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const secondServiceSecondScene = new WizardScene(
  'secondServiceSecondScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { secondServiceSecondScene };
