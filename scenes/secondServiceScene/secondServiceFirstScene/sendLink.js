const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');

const path = require('path');
const checkText = require('../../../common/checkText');
const {
  CONFIRM_MSG,
  CONFIRM_MSG_PHOTO,
} = require('../../../constants');
const { userData } = require('../../../common/data');
const { setStepPath } = require('../../../common/setStepPath');
const { restartBot } = require('../../../common/restartBot');
const {
  savePhoto,
  changeValuePhotoCount,
} = require('../../../common/savePhoto');
const { deleteFile } = require('../../../fileManager');
const { extractTextByVision } = require('../../../utils/ocr');
const Sentry = require('../../../utils/sentry');

const EXPECTED_PHOTO_COUNT = 1;
let skipLinkQuestion = false;

function setSkipLinkQuestion(newVal) {
  skipLinkQuestion = newVal;
}

function deleteChecks(ctx) {
  const userId = ctx.message.from.id;
  const arrPhotoForDelete = userData[userId]?.imagesNameArray?.filter((el) => {
    const imagesNameArrayLength = userData[userId]?.imagesNameArray.length;
    const addFirstFazePhotoCount = imagesNameArrayLength - ctx.wizard.state.photoCount;
    const slashIndex = el.indexOf('-');
    const numberOfPhoto = Number(el.slice([5], slashIndex));
    if (addFirstFazePhotoCount < numberOfPhoto) {
      deleteFile(path.resolve(__dirname, '../../../images', el));
    }
    return addFirstFazePhotoCount >= numberOfPhoto;
  }) || [];
  ctx.wizard.state.photoListener = true;
  ctx.wizard.state.photoCount = 0;
  if (arrPhotoForDelete) changeValuePhotoCount(arrPhotoForDelete.length, ctx);
  return arrPhotoForDelete || [];
}

const step1 = async (ctx) => {
  await ctx.replyWithHTML(
    '<b>Envías fotos del dorso del DNI del titular del cheque:</b>',
  );
  ctx.wizard.state.photoListener = true;
  ctx.wizard.state.photoCount = 0;
  ctx.wizard.next();
};

async function checkNumber(ctx, number) {
  switch (number) {
    case 1:
      ctx.scene.enter('elevenServiceScene');
      break;
    default:
      ctx.scene.enter('humanChat');
  }
}

const step2 = new Composer();

step2.on('photo', async (ctx) => {
  try {
    savePhoto(ctx);
    ctx.wizard.state.photoCount += 1;
    if (ctx.wizard.state.photoListener) {
      ctx.wizard.state.photoListener = false;
      await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

//  ***  This is necessary so that the user does not accidentally  ***
//  ***  press a number or symbol and the scene starts over.  ***
//  ***  Now if the user types something other than START, the scene will not be interrupted.  ***
step2.on('text', async (ctx) => {
  if (ctx.message.text === '/start') {
    restartBot(ctx);
    ctx.scene.leave();
  }
});

const step3 = new Composer();

step3.on('text', async (ctx) => {
  const userId = ctx.message.from.id;
  const number = checkText(ctx);
  const enterOptionOne = number === 1;
  if (enterOptionOne && ctx.wizard.state.photoCount !== 1) {
    setStepPath(ctx, number);
    await ctx.replyWithHTML(
      '❗️ <b>Por favor enviar tan solo 1 fotos. </b>',
    );
    userData[userId].imagesNameArray = deleteChecks(ctx);
    return ctx.scene.reenter();
  }

  try {
    if (number && number === 1) {
      setStepPath(ctx, number);
      await ctx.replyWithHTML('<b>Envías fotos del frente del cheque.</b>');
      ctx.wizard.state.photoListener = true;
      ctx.wizard.state.photoCount = 0;
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      userData[ctx.message.from.id].imagesNameArray = deleteChecks(ctx);
      return ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step4 = new Composer();

step4.on('photo', async (ctx) => {
  try {
    await savePhoto(ctx, extractTextByVision);
    ctx.wizard.state.photoCount += 1;
    if (ctx.wizard.state.photoListener) {
      ctx.wizard.state.photoListener = false;
      await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

//  ***  This is necessary so that the user does not accidentally  ***
//  ***  press a number or symbol and the scene starts over.  ***
//  ***  Now if the user types something other than START, the scene will not be interrupted.  ***
step4.on('text', async (ctx) => {
  if (ctx.message.text === '/start') {
    restartBot(ctx);
    ctx.scene.leave();
  }
});

const step5 = new Composer();

step5.on('text', async (ctx) => {
  const userId = ctx.message.from.id;
  const number = checkText(ctx);
  const enterOptionOne = number === 1;
  if (enterOptionOne && ctx.wizard.state.photoCount !== EXPECTED_PHOTO_COUNT) {
    setStepPath(ctx, number);
    await ctx.replyWithHTML('❗️ <b>Por favor enviar tan solo 1 fotos. </b>');
    await ctx.replyWithHTML('<b>Envías fotos del frente del cheque.</b>');
    userData[ctx.message.from.id].imagesNameArray = deleteChecks(ctx);
    return ctx.wizard.back();
  }

  try {
    if (number && number === 1) {
      setStepPath(ctx, number);
      userData[userId].link = ctx.message.text;
      await ctx.replyWithHTML('<b>Envías fotos del dorso del cheque.</b>');
      ctx.wizard.state.photoListener = true;
      ctx.wizard.state.photoCount = 0;
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      await ctx.replyWithHTML('<b>Envías fotos del frente del cheque.</b>');
      userData[ctx.message.from.id].imagesNameArray = deleteChecks(ctx);
      return ctx.wizard.back();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step6 = new Composer();

step6.on('photo', async (ctx) => {
  try {
    savePhoto(ctx);
    ctx.wizard.state.photoCount += 1;
    if (ctx.wizard.state.photoListener) {
      ctx.wizard.state.photoListener = false;
      await ctx.replyWithHTML(CONFIRM_MSG_PHOTO);
      ctx.wizard.next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
});

//  ***  This is necessary so that the user does not accidentally  ***
//  ***  press a number or symbol and the scene starts over.  ***
//  ***  Now if the user types something other than START, the scene will not be interrupted.  ***
step6.on('text', async (ctx) => {
  if (ctx.message.text === '/start') {
    restartBot(ctx);
    ctx.scene.leave();
  }
});

const step7 = new Composer();

step7.on('text', async (ctx) => {
  const userId = ctx.message.from.id;
  const number = checkText(ctx);
  const enterOptionOne = number === 1;
  if (enterOptionOne && ctx.wizard.state.photoCount !== EXPECTED_PHOTO_COUNT) {
    setStepPath(ctx, number);
    await ctx.replyWithHTML('❗️ <b>Por favor enviar tan solo 1 fotos. </b>');
    await ctx.replyWithHTML('<b>Envías fotos del dorso del cheque.</b>');
    userData[ctx.message.from.id].imagesNameArray = deleteChecks(ctx);
    return ctx.wizard.back();
  }

  try {
    if (number && number === 1) {
      setStepPath(ctx, number);
      userData[userId].link = ctx.message.text;
      if (skipLinkQuestion) {
        skipLinkQuestion = false;
        return ctx.scene.enter('elevenServiceScene');
      }
      await ctx.replyWithHTML('<b>Link de tu canal o sitio web.</b>');
      ctx.wizard.next();
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      await ctx.replyWithHTML('<b>Envías fotos del dorso del cheque.</b>');
      userData[ctx.message.from.id].imagesNameArray = deleteChecks(ctx);
      return ctx.wizard.back();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step8 = new Composer();

step8.on('text', async (ctx) => {
  try {
    if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    }
    const userId = ctx.message.from.id;
    userData[userId].link = ctx.message.text;
    await ctx.replyWithHTML(CONFIRM_MSG);
    ctx.wizard.next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const step9 = new Composer();

step9.on('text', async (ctx) => {
  try {
    const number = checkText(ctx);

    if (number && number <= 1) {
      setStepPath(ctx, number);
      checkNumber(ctx, number);
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      setStepPath(ctx, '0');
      await ctx.replyWithHTML('<b>Link de tu canal o sitio web.</b>');
      return ctx.wizard.back();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }
  return '';
});

const sendLink = new WizardScene(
  'sendLink',
  (ctx) => step1(ctx),
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  step8,
  step9,
);

module.exports = { sendLink, setSkipLinkQuestion };
