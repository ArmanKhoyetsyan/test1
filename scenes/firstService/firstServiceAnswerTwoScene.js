const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const path = require('path');
const { secondAnswer } = require('../../constants/firstAnswer');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { savePhoto } = require('../../common/savePhoto');
const { deleteFile } = require('../../fileManager');
const checkText = require('../../common/checkText');
const { userData } = require('../../common/data');
const { CONFIRM_MSG_PHOTO } = require('../../constants');
const { changeValuePhotoCount } = require('../../common/savePhoto');
const Sentry = require('../../utils/sentry');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondAnswer);
  await ctx.replyWithPhoto({ source: './images/FOTOPAYONEER002.jpg' });
  await ctx.replyWithPhoto({ source: './images/image1.2.jpg' });
  await ctx.replyWithHTML('<b>Tome una foto como se muestra en el ejemplo y envíela aquí.</b>');
  ctx.wizard.state.step2Photo = true;
  return ctx.wizard.next();
};

async function checkNumber(ctx) {
  ctx.scene.enter('humanChat');
}

const step2 = new Composer();

step2.on('text', (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      checkNumber(ctx);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (ctx.message.text === '0') {
      setStepPath(ctx, '0');
      return ctx.scene.enter('firstServiceScene');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

step2.on('photo', async (ctx) => {
  try {
    savePhoto(ctx);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
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
      userData[userId].paymentService = 'PAYONEER SKRILL';
      await ctx.scene.enter('elevenServiceScene');
      return;
    } if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (ctx.message.text === '0') {
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
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const firstServiceAnswerTwoScene = new WizardScene(
  'firstServiceAnswerTwoScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { firstServiceAnswerTwoScene };
