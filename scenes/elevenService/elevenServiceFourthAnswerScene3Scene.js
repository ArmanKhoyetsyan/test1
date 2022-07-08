const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const checkText = require('../../common/checkText');
const {
  CONFIRM_MSG, COMMENT_MSG,
} = require('../../constants');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { handleCommentScene } = require('../handle-comment-scene');
const Sentry = require('../../utils/sentry');

const step1 = async (ctx) => {
  await ctx.replyWithHTML('<b>Nombre de la plataforma:</b>');
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      await ctx.replyWithHTML('<b>Nombre completo:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.nombre_plataforma = ctx.message.text;
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      await ctx.replyWithHTML('<b>N° DNI:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.nombre = ctx.message.text;
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
      ctx.scene.enter('humanChat');
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      ctx.replyWithHTML('<b>CVU:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.dni = ctx.message.text;
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const step5 = new Composer();

step5.on('text', async (ctx) => {
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      ctx.replyWithHTML('<b>Alias:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.cvu = ctx.message.text;
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const step6 = new Composer();

step6.on('text', async (ctx) => {
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      ctx.replyWithHTML(CONFIRM_MSG);
      ctx.wizard.next();
    }
    ctx.wizard.state.alias = ctx.message.text;
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
});

const step7 = new Composer();

step7.on('text', async (ctx) => {
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

comment.on('text', async (ctx) => { handleCommentScene(ctx, 'DEPOSITO EN YACARE'); });

const elevenServiceFourthAnswerScene3Scene = new WizardScene(
  'elevenServiceFourthAnswerScene3Scene',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  comment,
);

module.exports = { elevenServiceFourthAnswerScene3Scene };
