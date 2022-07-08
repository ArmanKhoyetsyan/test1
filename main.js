const {
  Telegraf,
  session,
  Scenes: { Stage },
} = require('telegraf');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const { FIRST_MESSAGE, SERVICES } = require('./constants');
const { deleteFile } = require('./fileManager');
const { createUser } = require('./common/databaseCommands');
const checkText = require('./common/checkText');
const { startScenes } = require('./common/start');
const { userData, usersCtx } = require('./common/data');
const { setStepPath } = require('./common/setStepPath');
const { changeValuePhotoCount } = require('./common/savePhoto');
const sheet = require('./routes/sheets.route');
const botRouter = require('./routes/bot.route');
const userRouter = require('./routes/users.route');
const adminRouter = require('./routes/admin.route');
const { authorizationHandler } = require('./middlewares/middlewares');
const Sentry = require('./utils/sentry');
const { sessionExpress } = require('./sessionExpress');
require('dotenv').config({ path: `envs/.env.${process.env.ENV}` });

Sentry.init();

const app = express();
const port = process.env.PORT || 3000;

const whitelist = ['http://virtual-exchange-admin.herokuapp.com', 'https://virtual-exchange-admin.herokuapp.com'];

const corsOptions = {
  credentials: true,
  origin: whitelist,
  exposedHeaders: ["set-cookie"],
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(sessionExpress());
app.use((req, res, next) => authorizationHandler(req, res, next));
app.use('/user', userRouter);
app.use('/bot', botRouter);
app.use('/auth', adminRouter);
app.use('/sheet', sheet);

if (process.env.ENV === 'development') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Port ${port}`);
  });
} else if (process.env.ENV === 'production') {
  https
    .createServer(
      {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem'),
        passphrase: 'virtualexchange',
      },
      app,
    )
    .listen(port, () => {
      //  eslint-disable-next-line no-console
      console.log(`Port ${port}`);
    });
}

const { imageScene } = require('./scenes/imageScene');
const {
  firstServiceScene,
} = require('./scenes/firstService/firstServiceScene');
const {
  firstServiceAnswerThirdScene,
} = require('./scenes/firstService/firstServiceAnswerThirdScene');
const {
  firstServiceAnswerFourthScene,
} = require('./scenes/firstService/firstServiceAnswerFourthScene');
const {
  firstServiceAnswerTwoScene,
} = require('./scenes/firstService/firstServiceAnswerTwoScene');
const {
  secondServiceScene,
} = require('./scenes/secondServiceScene/secondServiceScene');
const {
  secondServiceSecondScene,
} = require('./scenes/secondServiceScene/secondServiceSecondScene');
const {
  secondServiceSecondSceneThirdScene,
} = require('./scenes/secondServiceScene/secondServiceSecondSceneThirdScene');
const {
  secondServiceAnswerSecondSceneAnswerSecondScene,
} = require('./scenes/secondServiceScene/secondServiceAnswerSecondSceneAnswerSecondScene');
const {
  secondServiceFirstScene,
} = require('./scenes/secondServiceScene/secondServiceFirstScene/secondServiceFirstScene');
const {
  secondSceneFirstAnswerThirdScene,
} = require('./scenes/secondServiceScene/secondServiceFirstScene/secondSceneFirstAnswerThirdScene');
const {
  secondSceneFirstAnswerThirdSceneThirdAnswer,
} = require('./scenes/secondServiceScene/secondServiceFirstScene/secondSceneFirstAnswerThirdSceneThirdAnswer');
const {
  secondSceneSecondAnswerThirdSceneSecondAnswer,
} = require('./scenes/secondServiceScene/secondServiceFirstScene/secondSceneSecondAnswerThirdSceneSecondAnswer');
const {
  elevenServiceSecondAnswerScene,
} = require('./scenes/elevenService/elevenServiceSecondAnswerScene');
const {
  secondServiceThirdScene,
} = require('./scenes/secondServiceScene/secondServiceThirdScene');
const {
  secondServiceAnswerFirstScene,
} = require('./scenes/secondServiceScene/secondServiceAnswerFirstScene');
const {
  secondServiceAnswerSecondScene,
} = require('./scenes/secondServiceScene/secondServiceAnswerSecondScene');
const {
  thirdServiceAnswerSecondScene,
} = require('./scenes/secondServiceScene/thirdServiceAnswerSecondScene');
const {
  elevenServiceFourthAnswerScene,
} = require('./scenes/elevenService/elevenServiceFourthAnswerScene');
const {
  elevenServiceFourthAnswerScene2Scene,
} = require('./scenes/elevenService/elevenServiceFourthAnswerScene2Scene');
const {
  elevenServiceFourthAnswerScene3Scene,
} = require('./scenes/elevenService/elevenServiceFourthAnswerScene3Scene');
const {
  elevenServiceSeventhAnswerScene,
} = require('./scenes/elevenService/elevenServiceSeventhAnswerScene');
const {
  elevenServiceEightAnswerScene,
} = require('./scenes/elevenService/elevenServiceEightAnswerScene');
const {
  thirdServiceScene,
} = require('./scenes/thirdService/thirdServiceScene');
const {
  thirdServiceTwoSceneCalculator,
} = require('./scenes/thirdService/thirdServiceTwoSceneCalculator');
const {
  elevenServiceSixthAnswerScene,
} = require('./scenes/elevenService/elevenServiceSixthAnswerScene');
const {
  thirdServiceAnswerTwoScene,
} = require('./scenes/thirdService/thirdServiceAnswerTwoScene');
const { fourthServiceScene } = require('./scenes/fourthServiceScene');
const { fourthServiceSceneSecondScene } = require('./scenes/fourthServiceSceneSecondScene');
const { fifthServiceScene } = require('./scenes/fifthServiceScene');
const { fifthServiceSceneSecondScene } = require('./scenes/fifthServiceSceneSecondScene');
const { sixthServiceScene } = require('./scenes/sixthServiceScene');
const { sixthServiceSceneSecondScene } = require('./scenes/sixthServiceSceneSecondScene');
const { seventhServiceScene } = require('./scenes/seventhServiceScene');
const { seventhServiceSceneSecondScene } = require('./scenes/seventhServiceSceneSecondScene');
const { eighthServiceScene } = require('./scenes/eighthServiceScene');
const { ninthServiceScene } = require('./scenes/ninthServiceScene');
const { tenServiceScene } = require('./scenes/tenServiceScene');
const {
  elevenServiceScene,
} = require('./scenes/elevenService/elevenServiceScene');
const {
  elevenServiceFirstAnswerScene,
} = require('./scenes/elevenService/elevenServiceFirstAnswerScene');
const {
  elevenServiceThirdAnswerScene,
} = require('./scenes/elevenService/elevenServiceThirdAnswerScene');
const {
  elevenServiceFifthAnswerScene,
} = require('./scenes/elevenService/elevenServiceFifthAnswerScene');
const { secondServiceFirstSceneSecondAnswer } = require('./scenes/secondServiceScene/secondServiceFirstScene/secondServiceFirstSceneSecondAnswer');
const { sendLink } = require('./scenes/secondServiceScene/secondServiceFirstScene/sendLink');
const { twelveServiceScene } = require('./scenes/twelveServiceScene');
const { setBot } = require('./services/bot.service');
const { humanChat, doneMsg } = require('./common/restartBot');
const { feedbackScene } = require('./scenes/feedback-scene');

const bot = new Telegraf(process.env.BOT_TOKEN);

setBot(bot);

const createMassageNoUser = {
  image: './images/no-user.png',
  text: 'Cree un nombre de usuario en TELEGRAM para iniciar el bot.',
};

// *** KEYBOARD ***
// https://gist.github.com/Jorj99/b6e40b5c56343bfb31824248c312d3dc

const stage = new Stage([
  firstServiceScene,
  firstServiceAnswerThirdScene,
  firstServiceAnswerFourthScene,
  secondServiceScene,
  thirdServiceScene,
  thirdServiceTwoSceneCalculator,
  fourthServiceScene,
  fourthServiceSceneSecondScene,
  fifthServiceScene,
  fifthServiceSceneSecondScene,
  sixthServiceScene,
  sixthServiceSceneSecondScene,
  seventhServiceScene,
  seventhServiceSceneSecondScene,
  eighthServiceScene,
  ninthServiceScene,
  tenServiceScene,
  elevenServiceScene,
  twelveServiceScene,
  // thirteenServiceScene,
  secondServiceFirstScene,
  secondSceneFirstAnswerThirdScene,
  secondSceneFirstAnswerThirdSceneThirdAnswer,
  secondSceneSecondAnswerThirdSceneSecondAnswer,
  secondServiceSecondScene,
  secondServiceSecondSceneThirdScene,
  secondServiceAnswerSecondSceneAnswerSecondScene,
  secondServiceThirdScene,
  secondServiceAnswerFirstScene,
  secondServiceAnswerSecondScene,
  thirdServiceAnswerSecondScene,
  firstServiceAnswerTwoScene,
  thirdServiceAnswerTwoScene,
  elevenServiceFirstAnswerScene,
  elevenServiceFifthAnswerScene,
  secondServiceFirstSceneSecondAnswer,
  elevenServiceSecondAnswerScene,
  elevenServiceThirdAnswerScene,
  elevenServiceFourthAnswerScene,
  elevenServiceFourthAnswerScene2Scene,
  elevenServiceFourthAnswerScene3Scene,
  elevenServiceSixthAnswerScene,
  elevenServiceSeventhAnswerScene,
  elevenServiceEightAnswerScene,
  sendLink,
  imageScene,
  humanChat,
  doneMsg,
  feedbackScene,
]);

function createUserDataUserCtx(ctx) {
  const userId = ctx.message.from.id;
  if (userId in userData) {
    userData[userId]?.imagesNameArray?.forEach((e) => {
      deleteFile(path.resolve(__dirname, './images', e));
    });
  }
  userData[userId] = {
    userName: ctx.message.from.username,
    imagesNameArray: [],
    link: '',
    payment: '',
    path: '',
    comment: '',
    feedback: '',
    photoNameCount: 0,
  };
  usersCtx[userId] = ctx;
  changeValuePhotoCount(0, ctx);
}

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  try {
    if (!ctx.message.from.username) {
      await ctx.replyWithHTML(createMassageNoUser.text);
      await ctx.replyWithPhoto({ source: createMassageNoUser.image });
      return;
    }
    createUserDataUserCtx(ctx);
    await ctx.reply(FIRST_MESSAGE);
    await ctx.replyWithHTML(SERVICES);
  } catch (err) {
    Sentry.logError(err);
  }
});

const checkNumber = async (ctx, number) => {
  if (number <= 10) {
    setStepPath(ctx, number);
    startScenes(number, ctx);
  } else {
    await ctx.replyWithHTML(SERVICES);
  }
};

bot.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id;

    if (!ctx.message.from.username) {
      await ctx.replyWithHTML(createMassageNoUser.text);
      await ctx.replyWithPhoto({ source: createMassageNoUser.image });
      return;
    }
    if (!userData[userId]) {
      await ctx.reply(FIRST_MESSAGE);
      await ctx.replyWithHTML(SERVICES);
      createUserDataUserCtx(ctx);
      return;
    }

    const number = checkText(ctx);
    if (number) {
      await mongoose.connect(process.env.MONGOOSE_CONNECT);
      await createUser(ctx);
      checkNumber(ctx, number);
    } else {
      await ctx.replyWithHTML(SERVICES);
    }
  } catch (err) {
    Sentry.logError(err);
  }
});

// bot.action("extractFromImage", Stage.enter("imageScene"));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();
