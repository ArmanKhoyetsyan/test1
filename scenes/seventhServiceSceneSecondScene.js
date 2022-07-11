const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const checkText = require('../common/checkText');
const { restartBot } = require('../common/restartBot');
const { setStepPath } = require('../common/setStepPath');
const {
  PERCENT_OBJ,
  calculator,
} = require('../common/calculator');
const Sentry = require('../utils/sentry');
const { userData } = require('../common/data');

const step1 = async (ctx) => {
  let text = '';
  let num = 1;
  Object.entries(PERCENT_OBJ['WISE/ZELLE ACH']).forEach(([key, value]) => {
    if (value) {
      text += `<b>${(num)}</b> ${key}\n`;
      num += 1;
    }
  });
  text += '<b>0. MENU ANTERIOR </b>';
  ctx.replyWithHTML(text);
  ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);
    if (number && number <= 6) {
      await setStepPath(ctx, number);
      await ctx.replyWithHTML(
        '<b>-0 vuelve atrás</b> \n-<b>Ingrese el monto a cambiar</b>',
      );
      ctx.wizard.state.platform = PERCENT_OBJ['WISE/ZELLE ACH ARR'][number - 1];
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      await ctx.scene.enter('thirdServiceAnswerTwoScene');
      await ctx.scene.leave();
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  try {
    if (ctx.message.text === '0') {
      ctx.scene.reenter();
      ctx.scene.leave();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else {
      const number = checkText(ctx);
      if (number) {
        await ctx.replyWithHTML(
          await calculator(
            'WISE/ZELLE ACH',
            ctx.wizard.state.platform,
            Number(ctx.message.text),
          ),
        );
      }
      await ctx.replyWithHTML(
        '<b>-0 vuelve atrás</b> \n-<b>Ingrese el monto a cambiar</b>',
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

const seventhServiceSceneSecondScene = new WizardScene(
  'seventhServiceSceneSecondScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { seventhServiceSceneSecondScene };
