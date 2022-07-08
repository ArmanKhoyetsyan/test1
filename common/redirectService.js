const redirectService = async (sceneName, ctx, number, service) => {
  if (number === 0) {
    // open first service
    ctx.replyWithHTML(service);
    // return ctx.scene.enter(sceneName);
  } else {
    ctx.scene.enter(sceneName);
  }
};

module.exports = { redirectService };
