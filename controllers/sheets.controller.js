const { getComingMonth, formatDateForDailySheet } = require('../utils/helper');
const service = require('../services/sheets.service');
const Sentry = require('../utils/sentry');
const { getCourseOfBlueDollar } = require('../common/blue-dollar');

const createMonthlySheet = async (req, res) => {
  try {
    if (await service.createMonthlySheet(getComingMonth())) {
      res.status(200).json({ msg: 'Sheet is created' });
    } else {
      res.status(400).json({ msg: 'Sheet is exist' });
    }
  } catch (error) {
    Sentry.logError(error);
  }
};

const createDailySheet = async (req, res) => {
  try {
    const sheetNames = await service.getSheetsNames();
    const dailySheetName = formatDateForDailySheet();

    if (!sheetNames.includes(dailySheetName)) {
      await service.copySheetAndRename('AUTO LI', dailySheetName);
      await service.clearSheet(dailySheetName, 3);
      res.status(200).json({ msg: 'Sheet is created' });
    } else {
      res.status(400).json({ msg: 'Sheet is exist' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
    Sentry.logError(error);
  }
};

const updateRateInDailySheet = async (req, res) => {
  try {
    const sheetNames = await service.getSheetsNames();
    const dailySheetName = formatDateForDailySheet();
    const courseOfBlueDollar = await getCourseOfBlueDollar();
    await service.updateValues('AUTO LI', 'F2', [[courseOfBlueDollar]]);

    if (!sheetNames.includes(dailySheetName)) {
      await service.copySheetAndRename('AUTO LI', dailySheetName);
      await service.clearSheet(dailySheetName, 3);
    } else {
      await service.updateValues(formatDateForDailySheet(), 'F2', [[courseOfBlueDollar]]);
    }

    res.status(200).json({ msg: `Course is updated in ${courseOfBlueDollar}` });
  } catch (error) {
    res.status(400).json({ msg: error.message });
    Sentry.logError(error);
  }
};

module.exports = { createMonthlySheet, createDailySheet, updateRateInDailySheet };
