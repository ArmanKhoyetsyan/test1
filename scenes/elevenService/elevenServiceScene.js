const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const {
  elevenService, elevenServiceForPaypal, SERVICES,
} = require('../../constants');
const checkText = require('../../common/checkText');
const { redirect } = require('../../common/firstListenerRedirect');
const { setStepPath } = require('../../common/setStepPath');
const { restartBot } = require('../../common/restartBot');
const { userData } = require('../../common/data');
const Sentry = require('../../utils/sentry');

const step1 = (ctx) => {
  const userId = ctx.message.from.id;
  if (userData[userId]?.paymentService === 'CHEQUE PAYPAL') {
    ctx.replyWithHTML(elevenServiceForPaypal);
  } else {
    ctx.replyWithHTML(elevenService);
  }
  return ctx.wizard.next();
};

async function checkNumberForAnswer(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('humanChat');
      return ctx.scene.leave();
    default:
      ctx.scene.enter('doneMsg');
      return ctx.scene.leave();
  }
}

async function checkNumber(ctx, number) {
  const userId = ctx.message.from.id;
  switch (number) {
    case 1:
      userData[userId].paymentMethod = 'LEMON';
      ctx.scene.enter('elevenServiceFirstAnswerScene');
      break;
    case 2:
      userData[userId].paymentMethod = 'USDT';
      ctx.scene.enter('elevenServiceSecondAnswerScene');
      break;
    case 3:
      userData[userId].paymentMethod = 'USD BILLETE';
      ctx.scene.enter('elevenServiceThirdAnswerScene');
      break;
    case 4:
      userData[userId].paymentMethod = 'BILLETERAS VIRTUALES';
      ctx.scene.enter('elevenServiceFourthAnswerScene');
      break;
    case 5:
      userData[userId].paymentMethod = 'MERCADO PAGO';
      await ctx.scene.enter('elevenServiceFifthAnswerScene');
      break;
    case 6:
      userData[userId].paymentMethod = 'UALA';
      await ctx.scene.enter('elevenServiceSixthAnswerScene');
      break;
    case 7:
      userData[userId].paymentMethod = 'BANCOS';
      await ctx.scene.enter('elevenServiceSeventhAnswerScene');
      break;
    case 8:
      userData[userId].paymentMethod = 'PAYPAL';
      await ctx.scene.enter('elevenServiceEightAnswerScene');
      break;
    default:
  }
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    const userId = ctx.message.from.id;
    if (userData[userId]?.paymentService === 'CHEQUE PAYPAL' && number === 8) {
      ctx.scene.reenter();
      return '';
    }
    if (number && number <= 8) {
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
    Sentry.logError(err);
  }
  return '';
});

const step3 = new Composer();

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
    Sentry.logError(err);
  }
});

const elevenServiceScene = new WizardScene(
  'elevenServiceScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { elevenServiceScene };
