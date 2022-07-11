const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

// const path = require('path');
const { secondServiceFirst } = require('../../../constants/secondService');
// const {
//   firstAnswer,
//   fourthAnswer,
// } = require('../../../constants/secondAnswer/firstAnswers');

const { restartBot } = require('../../../common/restartBot');
const checkText = require('../../../common/checkText');
// const { savePhoto } = require('../../../common/savePhoto');
const { setStepPath } = require('../../../common/setStepPath');
// const { CONFIRM_MSG_PHOTO } = require('../../../constants');
const { userData } = require('../../../common/data');
// const { deleteFile } = require('../../../fileManager');
// const { changeValuePhotoCount } = require('../../../common/savePhoto');
const Sentry = require('../../../utils/sentry');

// async function checkNumberForFirstAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       await ctx.scene.enter('secondServiceFirstSceneSecondAnswer');
//       break;
//     case 2:
//       await ctx.scene.enter('elevenServiceScene');
//       break;
//     default:
//       ctx.scene.enter('humanChat');
//   }
// }

// async function checkNumberForSecondAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.scene.enter('elevenServiceScene');
//       break;
//     default:
//       ctx.scene.enter('humanChat');
//   }
// }

// async function checkNumberForThirdAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       ctx.scene.enter('secondServiceAnswerFirstScene');
//       break;
//     case 3:
//       ctx.scene.enter('secondSceneFirstAnswerThirdSceneThirdAnswer');
//       break;
//     default:
//       ctx.scene.enter('humanChat');
//   }
// }

// async function checkNumberFourthAnswer(ctx, number) {
//   switch (number) {
//     case 1:
//       await ctx.scene.enter('firstServiceAnswerTwoScene');
//       break;
//     default:
//       ctx.scene.enter('humanChat');
//       break;
//   }
// }

// async function checkAnswer(ctx, number) {
//   const { serviceNumber } = ctx.wizard.state;
//   switch (serviceNumber) {
//     case 1:
//       checkNumberForFirstAnswer(ctx, number);
//       break;
//     case 2:
//       checkNumberForSecondAnswer(ctx, number);
//       break;
//     case 3:
//       checkNumberForThirdAnswer(ctx, number);
//       break;
//     default:
//       checkNumberFourthAnswer(ctx, number);
//       break;
//   }
// }

async function checkNumber(ctx, number) {
  const userId = ctx.message.from.id;
  switch (number) {
    // case 1:
    //   await ctx.replyWithHTML(firstAnswer);
    //   await ctx.replyWithVideo({ source: './images/VIDEOCHEQUE.MP4' });
    //   await ctx.replyWithHTML(
    // '<b>Envía fotos del frente y dorso del DNI del titular del cheque:</b>'
    // );
    //   ctx.wizard.state.sendLinkSecondServiceFirstScene = true;
    //   break;
    case 1:
      userData[userId].paymentService = 'CHEQUE GOOGLE';
      ctx.scene.enter('secondServiceFirstSceneSecondAnswer');
      break;
    default:
      await ctx.scene.enter('secondSceneFirstAnswerThirdScene');
      break;
    // default:
    //   await ctx.replyWithHTML(fourthAnswer);
    //   break;
  }
}

const step1 = (ctx) => {
  ctx.replyWithHTML(secondServiceFirst);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    ctx.wizard.state.serviceNumber = number;
    if (number && number <= 2) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      // ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      if (number === 0) {
        setStepPath(ctx, '0');
        ctx.scene.enter('secondServiceScene');
        return ctx.scene.leave();
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

// const step3 = new Composer();

// step3.on('photo', async (ctx) => {
//   try {
//     savePhoto(ctx);
//   } catch (err) {
//     Sentry.logError(err);
//   }
//   if (ctx.wizard.state.sendLinkSecondServiceFirstScene) {
//     ctx.wizard.state.sendLinkSecondServiceFirstScene = false;
//     await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
//     ctx.wizard.next();
//   }
// });

// step3.on('text', (ctx) => {
//   try {
//     const number = checkText(ctx);
//     if (number && number <= 4) {
//       setStepPath(ctx, number);
//       checkAnswer(ctx, number);
//       ctx.wizard.next();
//     } else if (ctx.message.text === '/start') {
//       restartBot(ctx);
//       ctx.scene.leave();
//     } else if (number === 0) {
//       setStepPath(ctx, '0');
//       return ctx.scene.reenter();
//     }
//   } catch (err) {
//     Sentry.logError(err);
//   }
//   return '';
// });

// const step4 = new Composer();

// step4.on('text', async (ctx) => {
//   try {
//     const number = checkText(ctx);
//     if (!ctx.wizard.state.sendLinkSecondServiceFirstScene) {
//       ctx.wizard.state.sendLinkSecondServiceFirstScene = true;
//       if (number && number === 1) {
//         await ctx.scene.enter('sendLink');
//         ctx.scene.leave();
//         return '';
//       }
//       if (number === 0) {
//         // ctx.wizard.state.dontShow = '';
//         const userId = ctx.message.from.id;
//         if (userId in userData) {
//           userData[userId]?.imagesNameArray?.forEach((e) => {
//             deleteFile(path.resolve(__dirname, '../../../images', e));
//           });
//           userData[ctx.message.from.id].imagesNameArray = [];
//           changeValuePhotoCount(0, ctx);
//         }
//         ctx.scene.reenter();
//         return '';
//       }
//     }
//     if (ctx.message.text === '/start') {
//       restartBot(ctx);
//       ctx.scene.leave();
//     }
//     if (number === 0) {
//       setStepPath(ctx, '0');
//       return ctx.scene.reenter();
//     }
//   } catch (err) {
//     Sentry.logError(err);
//   }
//   return '';
// });

const secondServiceFirstScene = new WizardScene(
  'secondServiceFirstScene',
  (ctx) => step1(ctx),
  step2,
  // step3,
  // step4,
);

module.exports = { secondServiceFirstScene };
