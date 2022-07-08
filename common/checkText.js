const checkText = (ctx) => {
  const message = ctx.message.text;
  const reg = /^\d+$/;
  const ifNumber = message.match(reg);
  const number = !!ifNumber && Number(ifNumber[0]);
  return number;
};

module.exports = checkText;
