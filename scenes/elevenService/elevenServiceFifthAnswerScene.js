const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const checkText = require('../../common/checkText');
const { CONFIRM_MSG, COMMENT_MSG } = require('../../constants');
const { restartBot } = require('../../common/restartBot');
const { setStepPath } = require('../../common/setStepPath');
const { fifthAnswer } = require('../../constants/elevenAnswer');
const { handleCommentScene } = require('../handle-comment-scene');
const Sentry = require('../../utils/sentry');
const { userData } = require('../../common/data');
const { deleteChecks } = require('../../utils/helper');

const step1 = async (ctx) => {
  await ctx.replyWithHTML(fifthAnswer);
  await ctx.replyWithHTML('<b>Nombre completo:</b>');
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      await ctx.replyWithHTML('<b>CVU:</b>');
      ctx.wizard.next();
    }
    ctx.wizard.state.nombre_completo = ctx.message.text;
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
      ctx.scene.enter('humanChat');
      userData[userId].imagesNameArray = deleteChecks(ctx);
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
    const userId = ctx.message.from.id;

    if (number && number <= 1) {
      setStepPath(ctx, number);
      ctx.scene.enter('humanChat');
      userData[userId].imagesNameArray = deleteChecks(ctx);
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      ctx.replyWithHTML('<b>Código para ingresar dinero en efectivo:</b>');
      await ctx.replyWithPhoto({ source: './images/FOTOMERCADOPAGO.jpg' });
      ctx.wizard.next();
    }
    ctx.wizard.state.alias = ctx.message.text;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step5 = new Composer();

step5.on('text', async (ctx) => {
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
      ctx.scene.reenter();
      ctx.scene.leave();
      return '';
    } else {
      ctx.replyWithHTML(CONFIRM_MSG);
      ctx.wizard.next();
    }
    ctx.wizard.state.codigo_para_ingresar_dinero_en_efectivo = ctx.message.text;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step6 = new Composer();

step6.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 1) {
      setStepPath(ctx, number);
      await ctx.replyWithHTML(COMMENT_MSG);
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    }
    if (number === 0) {
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

comment.on('text', async (ctx) => { handleCommentScene(ctx, 'MERCADO PAGO'); });

const elevenServiceFifthAnswerScene = new WizardScene(
  'elevenServiceFifthAnswerScene',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  step5,
  step6,
  comment,
);

module.exports = { elevenServiceFifthAnswerScene };
