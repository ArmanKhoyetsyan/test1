const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { thirdAnswer } = require('../../constants/elevenAnswer');

const checkText = require('../../common/checkText');
const {
  CONFIRM_MSG, COMMENT_MSG,
} = require('../../constants');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { handleCommentScene } = require('../handle-comment-scene');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');
const { deleteChecks } = require('../../utils/helper');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(thirdAnswer);
  await ctx.replyWithHTML('<b>NOMBRE y APELLIDO:</b>');
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    const userId = ctx.message.from.id;

    if (number && number <= 1) {
      setStepPath(ctx, number);
      userData[userId].imagesNameArray = deleteChecks(ctx);
      ctx.scene.enter('humanChat');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.enter('elevenServiceScene');
      ctx.wizard.next();
    } else {
      await ctx.replyWithHTML('<b>N° DNI::</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.nombre = ctx.message.text;
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
    const userId = ctx.message.from.id;

    if (number && number <= 1) {
      setStepPath(ctx, number);
      userData[userId].imagesNameArray = deleteChecks(ctx);
      ctx.scene.enter('humanChat');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, number);
      ctx.scene.enter('elevenServiceScene');
      ctx.wizard.next();
    } else {
      ctx.replyWithHTML(CONFIRM_MSG);
      ctx.wizard.next();
    }
    ctx.wizard.state.dni = ctx.message.text;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step4 = new Composer();

step4.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      await ctx.replyWithHTML(COMMENT_MSG);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
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

const comment = new Composer();

comment.on('text', async (ctx) => { handleCommentScene(ctx, 'DÓLAR BILLETE'); });

const elevenServiceThirdAnswerScene = new WizardScene(
  'elevenServiceThirdAnswerScene',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  comment,
);

module.exports = { elevenServiceThirdAnswerScene };
