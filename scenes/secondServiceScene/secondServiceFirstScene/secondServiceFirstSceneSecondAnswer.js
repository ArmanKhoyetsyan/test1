const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const path = require('path');

const {
  secondAnswer,
} = require('../../../constants/secondAnswer/firstAnswers');
const { restartBot } = require('../../../common/restartBot');
const { setStepPath } = require('../../../common/setStepPath');
const checkText = require('../../../common/checkText');
const { savePhoto } = require('../../../common/savePhoto');
const { userData } = require('../../../common/data');
const { deleteFile } = require('../../../fileManager');
const { changeValuePhotoCount } = require('../../../common/savePhoto');
const Sentry = require('../../../utils/sentry');
const { CONFIRM_MSG_PHOTO } = require('../../../constants');

const EXPECTED_PHOTO_COUNT = 1;

function deleteChecks(ctx) {
  const userId = ctx.message.from.id;
  userData[userId]?.imagesNameArray?.forEach((e) => {
    deleteFile(path.resolve(__dirname, '../../../images', e));
  });
  userData[userId].imagesNameArray = [];
  changeValuePhotoCount(0, ctx);
}

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('elevenServiceScene');
      break;
    default:
  }
}

const step1 = async (ctx) => {
  if (!ctx.wizard.state.dontShow) {
    await ctx.replyWithHTML(secondAnswer);
    await ctx.replyWithVideo({ source: './images/VIDEOCHEQUE.MP4' });
  }
  ctx.wizard.state.photoListener = true;
  await ctx.replyWithHTML(
    '<b>Envías fotos del frente del DNI del titular del cheque:</b>',
  );
  ctx.wizard.state.photoCount = 0;
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('photo', async (ctx) => {
  try {
    await savePhoto(ctx);
    ctx.wizard.state.photoCount += 1;
  } catch (err) {
    Sentry.logError(err);
  }
  if (ctx.wizard.state.photoListener) {
    ctx.wizard.state.photoListener = false;
    ctx.wizard.state.dontShow = 'don`t show';
    await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
    ctx.wizard.next();
  }
});

step2.on('text', async (ctx) => {
  const userId = ctx.message.from.id;
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      if (number === 0) {
        setStepPath(ctx, '0');
        await ctx.scene.enter('secondServiceFirstScene');
      }
      userData[userId].link = ctx.message.text;
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  const userId = ctx.message.from.id;

  try {
    const number = checkText(ctx);
    const enterOptionOne = number === 1;
    if (enterOptionOne && ctx.wizard.state.photoCount !== EXPECTED_PHOTO_COUNT) {
      await ctx.replyWithHTML(
        '❗️ <b>Por favor enviar tan solo 1 fotos.</b>',
      );
      deleteChecks(ctx);
      return ctx.scene.reenter();
    }

    if (!ctx.wizard.state.photoListener) {
      if (number === 0) {
        ctx.wizard.state.dontShow = '';
        if (userId in userData) {
          userData[userId]?.imagesNameArray?.forEach((e) => {
            deleteFile(path.resolve(__dirname, '../../../images', e));
          });
          userData[ctx.message.from.id].imagesNameArray = [];
          changeValuePhotoCount(0, ctx);
        }
        ctx.scene.reenter();
      } else if (number === 1) {
        userData[userId].paymentService = 'CHEQUE GOOGLE';
        ctx.scene.enter('sendLink');
      } else if (ctx.message.text === '/start') {
        restartBot(ctx);
        ctx.scene.leave();
      }
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const secondServiceFirstSceneSecondAnswer = new WizardScene(
  'secondServiceFirstSceneSecondAnswer',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { secondServiceFirstSceneSecondAnswer };
