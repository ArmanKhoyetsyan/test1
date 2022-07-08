const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const { secondAnswer } = require('../../constants/elevenAnswer');

const checkText = require('../../common/checkText');
const {
  CONFIRM_MSG, COMMENT_MSG,
} = require('../../constants');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { handleCommentScene } = require('../handle-comment-scene');
const Sentry = require('../../utils/sentry');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(secondAnswer);
  await ctx.replyWithHTML('<b>RED:</b>');
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.enter('elevenServiceScene');
      ctx.wizard.next();
    } else {
      await ctx.replyWithHTML('<b>DIRECCION:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.red = ctx.message.text;
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.enter('elevenServiceScene');
      ctx.wizard.next();
    } else {
      ctx.replyWithHTML(CONFIRM_MSG);
      ctx.wizard.next();
    }
    ctx.wizard.state.direccion = ctx.message.text;
  } catch (err) {
    Sentry.logError(err);
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
    Sentry.logError(err);
  }
  return '';
});

const comment = new Composer();

comment.on('text', async (ctx) => { handleCommentScene(ctx, 'USDT'); });

const elevenServiceSecondAnswerScene = new WizardScene(
  'elevenServiceSecondAnswerScene',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  comment,
);

module.exports = { elevenServiceSecondAnswerScene };