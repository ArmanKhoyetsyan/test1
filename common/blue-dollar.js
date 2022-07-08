const axios = require('axios');

const getCourseOfBlueDollar = async () => axios.get('https://api.bluelytics.com.ar/v2/latest').then((e) => e.data.blue.value_buy);

module.exports = {
  getCourseOfBlueDollar,
};
