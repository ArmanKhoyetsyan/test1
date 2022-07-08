const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { SERVICES } = require('../constants');
const checkText = require('../common/checkText');
const { restartBot } = require('../common/restartBot');
// const { HUMAN_BOT_ACCOUNT } = require('../constants/bot-info');
const Sentry = require('../utils/sentry');

const {
  firstAnswer,
  // secondAnswer,
  // thirdAnswer,
  // fourthAnswer,
} = require('../constants/seventhAnswer');
const { redirect } = require('../common/firstListenerRedirect');
const { setStepPath } = require('../common/setStepPath');

const step1 = async (ctx) => {
  ctx.replyWithHTML(firstAnswer);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    // ctx.wizard.state.serviceNumber = number;
    if (number && number <= 1) {
      // checkNumber(ctx, number);
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
    } else if (number === 2) {
      return await ctx.scene.enter('seventhServiceSceneSecondScene');
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

// const step3 = new Composer();

// step3.on("text", (ctx) => {
//   try {
//     const number = checkText(ctx);
//     if (number && number <= 2) {
//       checkServiceForAnswer(ctx, number);
//     } else {
//       return ctx.scene.reenter();
//     }
//   } catch (err) {
//     Sentry.logError(err);
//   }
// });

// async function checkServiceForAnswer(ctx, number) {
//   const { serviceNumber } = ctx.wizard.state;
//   switch (serviceNumber) {
//     case 1:
//       checkNumberForFirstAnswer(ctx, number);
//       break;
//     case 2:
//       checkNumberForSecondAnswer(ctx, number);
//       break;
//     case 3:
//       ctx.scene.enter("firstServiceAnswerTwoScene");
//       break;
//     default:
//       checkNumberForForthAnswer(ctx, number);
//       break;
//   }
// }

// async function checkNumber(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.replyWithHTML(firstAnswer);
//       break;
//     case 2:
//       ctx.replyWithHTML(secondAnswer);
//       break;
//     case 3:
//       ctx.replyWithHTML(thirdAnswer);
//       break;
//     default:
//       ctx.replyWithHTML(fourthAnswer);
//       break;
//   }
// }

// async function checkNumberForFirstAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.scene.enter("firstServiceAnswerTwoScene");
//       break;
//     default:
//       await ctx.reply(HUMAN_BOT_ACCOUNT);
//       await ctx.scene.reenter();
//       break;
//   }
// }

// async function checkNumberForSecondAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.scene.enter("secondServiceAnswerFirstScene");
//       break;
//     default:
//       await ctx.reply(HUMAN_BOT_ACCOUNT);
//       await ctx.scene.reenter();
//       break;
//   }
// }

// async function checkNumberForForthAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.scene.enter("thirdServiceAnswerTwoScene");
//       break;
//     default:
//       await ctx.reply(HUMAN_BOT_ACCOUNT);
//       await ctx.scene.reenter();
//       break;
//   }
// }

const seventhServiceScene = new WizardScene(
  'seventhServiceScene',
  (ctx) => step1(ctx),
  step2,
  // step3
);

module.exports = { seventhServiceScene };