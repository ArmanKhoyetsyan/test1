const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const path = require('path');
const { secondAnswer } = require('../../constants/secondAnswer/thirdAnswer');
const { restartBot } = require('../../common/restartBot');
const { savePhoto } = require('../../common/savePhoto');
const { setStepPath } = require('../../common/setStepPath');
const { userData } = require('../../common/data');
const { deleteFile } = require('../../fileManager');
const { changeValuePhotoCount } = require('../../common/savePhoto');

const checkText = require('../../common/checkText');

const Sentry = require('../../utils/sentry');
const { CONFIRM_MSG_PHOTO } = require('../../constants');

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('elevenServiceScene');
      break;
    case 2:
      ctx.scene.enter('humanChat');
      break;
    default:
  }
}

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondAnswer);
  await ctx.replyWithHTML('<b>Toma una foto y envíala aquí.</b>');
  ctx.wizard.state.step2Photo = true;
  ctx.wizard.state.step4Photo = true;
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 2) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      ctx.scene.enter('secondServiceScene');
      ctx.wizard.next();
    }
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

step2.on('photo', async (ctx) => {
  try {
    savePhoto(ctx);
  } catch (err) {
    Sentry.logError(err);
  }
  if (ctx.wizard.state.step2Photo) {
    ctx.wizard.state.step2Photo = false;
    await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
    ctx.wizard.next();
  }
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      await ctx.replyWithHTML(
        '<b>Envía fotos del frente y dorso de tu CHEQUE en buena calidad:</b>',
      );
      ctx.wizard.next();
      // await ctx.scene.enter('elevenServiceScene');
      return;
    } if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      userData[userId]?.imagesNameArray?.forEach((e) => {
        deleteFile(path.resolve(__dirname, '../../images', e));
      });
      userData[ctx.message.from.id].imagesNameArray = [];
      changeValuePhotoCount(0, ctx);
      ctx.scene.reenter();
      return;
    }
  } catch (err) {
    Sentry.logError(err);
  }
  ctx.wizard.next();
});

const step4 = new Composer();

step4.on('photo', async (ctx) => {
  try {
    savePhoto(ctx);
  } catch (err) {
    Sentry.logError(err);
  }
  if (ctx.wizard.state.step4Photo) {
    ctx.wizard.state.step4Photo = false;
    await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
    ctx.wizard.next();
  }
});

const step5 = new Composer();

step5.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      await ctx.scene.enter('elevenServiceScene');
      return;
    } if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      setStepPath(ctx, '0');
      userData[userId]?.imagesNameArray?.forEach((e) => {
        deleteFile(path.resolve(__dirname, '../../images', e));
      });
      userData[ctx.message.from.id].imagesNameArray = [];
      changeValuePhotoCount(0, ctx);
      ctx.scene.reenter();
      return;
    }
  } catch (err) {
    Sentry.logError(err);
  }
  ctx.wizard.next();
});

const thirdServiceAnswerSecondScene = new WizardScene(
  'thirdServiceAnswerSecondScene',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  step5,
);

module.exports = { thirdServiceAnswerSecondScene };
