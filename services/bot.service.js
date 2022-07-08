const Sentry = require('@sentry/node');

let bot;

const setBot = (newBot) => {
  bot = newBot;
};

const sendTelegramMsg = async (id, financeInfos) => {
  if (id && financeInfos) {
    try {
      await bot.telegram.sendMessage(id, financeInfos, { parse_mode: 'HTML' });
    } catch (error) {
      Sentry.logError(' Error: SEND NOTIFY ', error.message);
    }
  }
};

module.exports = { setBot, sendTelegramMsg };
