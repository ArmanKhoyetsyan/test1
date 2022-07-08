const {
  Composer,
  Scenes: { WizardScene },
} = require('telegraf');
const path = require('path');
const {
  FIRST_MESSAGE, SERVICES, HUMAN_CHAT_MSG, DONE_MSG,
} = require('../constants/index');
const { startScenes } = require('./start');
const { userData, usersCtx } = require('./data');
const { deleteFile } = require('../fileManager');
const { changeValuePhotoCount } = require('./savePhoto');
const { HUMAN_BOT_ACCOUNT } = require('../constants/bot-info');

async function restartBot(context) {
  const userId = context.message.from.id;
  userData?.[userId]?.imagesNameArray.forEach((e) => {
    deleteFile(path.resolve(__dirname, '../images', e));
  });
  userData[context.message.from.id] = {
    userName: context.message.from.username,
    imagesNameArray: [],
    link: '',
    payment: '',
    path: '',
    comment: '',
    feedback: '',
    photoNameCount: 0,
  };

  usersCtx[userId] = context;
  changeValuePhotoCount(0, context);

  await context.replyWithHTML(FIRST_MESSAGE);
  await context.replyWithHTML(SERVICES);

  const start = new Composer();
  start.on('text', async (ctx) => {
    const number = Number(ctx.message.text);
    startScenes(number, ctx);
    return ctx.wizard.next();
  });
}

// *** HUMAN CHAT SCENE ***

const step1 = async (ctx) => {
  await ctx.reply(HUMAN_BOT_ACCOUNT);
  await ctx.replyWithHTML(HUMAN_CHAT_MSG);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on('text', async (ctx) => {
  restartBot(ctx);
  ctx.scene.leave();
});

const humanChat = new WizardScene(
  'humanChat',
  (ctx) => step1(ctx),
  step2,
);

// *** ***

// *** DONE_MSG_SCENE ***

const msg = async (ctx) => {
  await ctx.replyWithHTML(DONE_MSG);
  return ctx.wizard.next();
};

const restart = new Composer();

restart.on('text', async (ctx) => {
  restartBot(ctx);
  ctx.scene.leave();
});

const doneMsg = new WizardScene(
  'doneMsg',
  (ctx) => msg(ctx),
  restart,
);

// *** ***

module.exports = {
  restartBot, humanChat, doneMsg,
};
