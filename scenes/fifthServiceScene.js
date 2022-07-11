const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { SERVICES } = require('../constants');
const checkText = require('../common/checkText');
const { restartBot } = require('../common/restartBot');
const { setStepPath } = require('../common/setStepPath');
// const { HUMAN_BOT_ACCOUNT } = require('../constants/bot-info');
const Sentry = require('../utils/sentry');

const {
  firstAnswer,
} = require('../constants/fifthAnswers');
const { redirect } = require('../common/firstListenerRedirect');
const { userData } = require('../common/data');

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
      return await ctx.scene.enter('fifthServiceSceneSecondScene');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
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
//         // eslint-disable-next-line no-console
// console.log(err);
// Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
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

const fifthServiceScene = new WizardScene(
  'fifthServiceScene',
  (ctx) => step1(ctx),
  step2,
  // step3
);

module.exports = { fifthServiceScene };
