const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { firstService, SERVICES } = require('../../constants');
const { setStepPath } = require('../../common/setStepPath');
const {
  firstAnswer,
  thirdAnswer,
} = require('../../constants/firstAnswer');

const checkText = require('../../common/checkText');
const { redirect } = require('../../common/firstListenerRedirect');
const { restartBot } = require('../../common/restartBot');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');

const step1 = (ctx) => {
  ctx.replyWithHTML(firstService);
  return ctx.wizard.next();
};

async function checkServiceNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.scene.enter('firstServiceAnswerTwoScene');
      ctx.wizard.state.serviceNumber = 2;
      break;
    case 2:
      ctx.scene.enter('elevenServiceScene');
      break;
    case 3:
      await ctx.scene.enter('firstServiceAnswerTwoScene');
      ctx.wizard.state.serviceNumber = 2;
      break;
    default:
      await ctx.scene.enter('firstServiceAnswerTwoScene');
      ctx.wizard.state.serviceNumber = 2;
      break;
  }
}

async function checkNumberForAnswer(ctx, number) {
  const chooseAnswerNumber = ctx.wizard.state.serviceNumber;
  switch (number) {
    case 1:
      checkServiceNumber(ctx, chooseAnswerNumber);
      break;
    default:
      ctx.scene.enter('humanChat');
  }
}

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      await ctx.replyWithHTML(firstAnswer);
      await ctx.replyWithPhoto({ source: './images/FOTOPAYONEER001.jpg' });
      await ctx.replyWithVideo({ source: './images/VIDEOPAYONEER.mp4' });
      ctx.wizard.state.CLIENTE_NUEVO = true;
      break;
    case 2:
      await ctx.scene.enter('firstServiceAnswerTwoScene');
      break;
    case 3:
      ctx.replyWithHTML(thirdAnswer);
      break;
    default:
      ctx.scene.enter('firstServiceAnswerFourthScene');
      break;
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 4) {
      setStepPath(ctx, number);
      ctx.wizard.state.serviceNumber = number;
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      return ctx.scene.leave();
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

step3.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number === 2 && !ctx.wizard.state.CLIENTE_NUEVO) {
      await ctx.scene.enter('firstServiceAnswerThirdScene');
    } else if (number && number <= 2) {
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

const firstServiceScene = new WizardScene(
  'firstServiceScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { firstServiceScene };
