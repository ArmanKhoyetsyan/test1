const { default: mongoose } = require('mongoose');
const Sentry = require('../utils/sentry');
const sheetsService = require('../services/sheets.service');

const notifyUsers = async (req, res) => {
  try {
    if (!req?.body?.date) {
      return res.status(400).json({ msg: "Date isn't defined" });
    }
    mongoose.connect(process.env.MONGOOSE_CONNECT);
    const date = `${req?.body?.date.slice(8, 10)}-${req?.body?.date?.slice(5, 7)}`;
    const sheetNames = await sheetsService.getSheetsNames();
    if (sheetNames.includes(date)) {
      await sheetsService.sendPaymentInfo(date);
      res.status(200).json({ msg: 'The message was sent successfully' });
    } else {
      res.status(400).json({ msg: "Sheet doesn't exist" });
    }
  } catch (error) {
    Sentry.logError(' Error: SEND NOTIFY ', error.message);
    res.status(400).json({ msg: error.message });
  }
  return '';
};

module.exports = { notifyUsers };
