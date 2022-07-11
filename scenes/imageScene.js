const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const path = require('path');
const { sendMailMessage } = require('../mailConfig');
const { setStepPath } = require('../common/setStepPath');
const { restartBot } = require('../common/restartBot');
const checkText = require('../common/checkText');
const { userData } = require('../common/data');
const { deleteFile } = require('../fileManager');
const { changeValuePhotoCount } = require('../common/savePhoto');
const OCR = require('../utils/ocr');
const { savePhoto } = require('../common/savePhoto');
const { CONFIRM_MSG_PHOTO } = require('../constants');
const Sentry = require('../utils/sentry');

const step1 = async (ctx) => {
  await ctx.reply(
    `Tome la foto en fondo negro, sin flash.\n
     Tilde en comprimir si le da la opción.\n
     La imagen horizontal como el ejemplo`,
  );

  ctx.replyWithPhoto({ source: './images/example.jpg' });
  ctx.wizard.state.step2Photo = true;
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('photo', async (ctx) => {
  try {
    const imageName = await savePhoto(ctx);
    const photos = ctx.update.message.photo;
    const { file_id: fileId } = photos[photos.length - 1];
    const { file_unique_id: fileUniqueId } = photos[photos.length - 1];
    const { href: fileUrl } = await ctx.telegram.getFileLink(fileId);
    ctx.wizard.state.photos = photos;
    ctx.wizard.state.fileId = fileId;
    ctx.wizard.state.fileUniqueId = fileUniqueId;
    ctx.wizard.state.fileUrl = fileUrl;
    ctx.wizard.state.filPath = path.resolve(__dirname, '../images', imageName);
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
  const { filPath } = ctx.wizard.state;

  // const imagePath = await fileManager.downloadFile(
  //   fileUrl,
  //   fileUniqueId,
  //   "images"
  // );

  try {
    const number = checkText(ctx);
    const userId = ctx.message.from.id;
    if (number && number <= 1) {
      await ctx.reply('Por favor espere para confirmar su foto');
      setStepPath(ctx, number);
      const text = await OCR.extractText(filPath);
      // fileManager.deleteFile(imagePath);

      // if (!text || text === 'Empty') {
      //   await ctx.reply('Sorry we couldn\'t extract any text from the image');
      //   ctx.reply('Lets try this again, please send me another image');
      // } else {
      //   await ctx.replyWithHTML(`The extracted text is: \n <b>${text}</b>`);
      // }
      await sendMailMessage('Photo data', text, userId, ctx.scene.enter('doneMsg'));
    } else if (ctx.message.text === '/start') {
      restartBot(ctx);
      ctx.scene.leave();
    } else if (number === 0) {
      userData[userId]?.imagesNameArray?.forEach((e) => {
        deleteFile(path.resolve(__dirname, '../images', e));
      });
      userData[userId].imagesNameArray = [];
      changeValuePhotoCount(0, ctx);
      ctx.scene.reenter();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`${JSON.stringify(userData[ctx.message.from.id])},  error `, err);
    Sentry.logError(new Error(`${JSON.stringify(userData[ctx.message.from.id])},  error ${err.message}`));
  }

  const currentStepIndex = ctx.wizard.cursor;
  return ctx.wizard.selectStep(currentStepIndex);
});

step2.command('cancel', (ctx) => {
  ctx.reply('Bye bye');
  return ctx.scene.leave();
});

const imageScene = new WizardScene(
  'imageScene',
  (ctx) => step1(ctx),
  step2,
  step3,
);

module.exports = { imageScene };
