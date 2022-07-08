const { setupPercents } = require('./setupPercents');

async function startScenes(number, ctx) {
  await setupPercents();
  switch (number) {
    case 1:
      ctx.scene.enter('firstServiceScene');
      break;
    case 2:
      ctx.scene.enter('secondServiceScene');
      break;
    case 3:
      ctx.scene.enter('humanChat');
      break;
    case 4:
      ctx.scene.enter('thirdServiceScene');
      break;
    case 5:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('fourthServiceScene');
      break;
    case 6:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('fifthServiceScene');
      break;
    case 7:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('sixthServiceScene');
      break;
    case 8:
      ctx.scene.enter('humanChat');
      // ctx.scene.enter('seventhServiceScene');
      break;
    // case 8:
    //   ctx.scene.enter('eighthServiceScene');
    //   break;
    case 9:
      ctx.scene.enter('ninthServiceScene');
      break;
    case 10:
      ctx.scene.enter('tenServiceScene');
      break;
    // case 11:
    //   ctx.scene.enter('elevenServiceScene');
    //   break;
    // case 12:
    //   ctx.scene.enter('twelveServiceScene');
    //   break;
    default:
  }
}

module.exports = {
  startScenes,
};
