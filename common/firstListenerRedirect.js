const redirect = (ctx, number, service) => {
  if (number === 0) {
    ctx.replyWithHTML(service);
    return ctx.scene.leave();
  }
  return ctx.scene.reenter();
};

module.exports = { redirect };
