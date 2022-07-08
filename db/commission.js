const Commission = require('../models/payment');

async function createPaymentMetode() {
  const paymentMethod = new Commission({
    system: null,
    method: null,
    value: null,
  });
  await paymentMethod.save();
}
async function findPaymentMethod() {
  return Commission.find();
}
async function updatePaymentMethod(id, newValue) {
  await Commission.updateOne(
    { _id: id },
    { $set: { value: newValue } },
  );
}

module.exports = {
  createPaymentMetode,
  findPaymentMethod,
  updatePaymentMethod,
};
