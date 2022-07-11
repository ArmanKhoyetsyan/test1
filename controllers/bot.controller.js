const { default: mongoose } = require('mongoose');
const { updatePaymentMethod, findPaymentMethod } = require('../db/commission');
const Sentry = require('../utils/sentry');

const getPaymentMethod = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGOOSE_CONNECT);
    const data = await findPaymentMethod();
    return res.status(200).json({ data });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(new Error(`Error: Payment Method Get,  error ${error.message}`));
    return res.status(400).json({ msg: error.message });
  }
};

const updatePaymentSystem = async (req, res) => {
  try {
    if (!req.body.id || !req.body.newValue) {
      return res.status(400).json({ msg: "Data isn't defined" });
    }
    await mongoose.connect(process.env.MONGOOSE_CONNECT);
    await updatePaymentMethod(req.body.id, req.body.newValue);
    return res.status(200).json({ msg: 'Update Was Successful ' });
  } catch (error) {
    Sentry.logError(new Error(`Error: Payment Method Put,  error ${error.message}`));
    return res.status(400).json({ msg: error.message });
  }
};

module.exports = { getPaymentMethod, updatePaymentSystem };
