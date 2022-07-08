const { PERCENT_OBJ } = require('./calculator');
const { findPaymentMethod } = require('../db/commission');
const Sentry = require('../utils/sentry');

async function setupPercents() {
  try {
    const pracentData = await findPaymentMethod();
    pracentData.forEach((el) => {
      if (PERCENT_OBJ?.[el?.system]?.[el?.method]) {
        PERCENT_OBJ[el?.system][el?.method] = el?.value;
      }
    });
  } catch (error) {
    Sentry.logError(error);
  }
}
module.exports = { setupPercents };
