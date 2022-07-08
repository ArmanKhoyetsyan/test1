const { getCourseOfBlueDollar } = require('./blue-dollar');

const PERCENT_OBJ = {

  'CHEQUE GOOGLE': {
    'BILLETERAS VIRTUALES': 17,
    BANCOS: 17,
    USDT: 14,
    PAYPAL: 14,
    'USD BILLETE': 18,
    LEMON: 14,
    UALA: 14,
    'MERCADO PAGO': 17,
  },
  'CHEQUE GOOGLE ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'USDT', 'PAYPAL', 'USD BILLETE', 'LEMON', 'UALA', 'MERCADO PAGO'],
  'CHEQUE PAYPAL': {
    'BILLETERAS VIRTUALES': 12,
    BANCOS: 12,
    USDT: 9,
    'USD BILLETE': 14,
    LEMON: 9,
    UALA: 14,
    'MERCADO PAGO': 17,
  },
  'CHEQUE PAYPAL ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'USDT', 'USD BILLETE', 'LEMON', 'UALA', 'MERCADO PAGO'],
  'PAYONEER SKRILL': {
    'BILLETERAS VIRTUALES': 14,
    BANCOS: 14,
    USDT: 11,
    'USD BILLETE': 14,
    LEMON: 11,
  },
  'PAYONEER SKRILL ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'USDT', 'USD BILLETE', 'LEMON'],
  'SALDO PAYPAL': {
    'BILLETERAS VIRTUALES': 17.5,
    BANCOS: 17.5,
    USDT: 14.5,
    'USD BILLETE': 18.5,
    LEMON: 14.5,
  },
  'SALDO PAYPAL ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'USDT', 'USD BILLETE', 'LEMON'],
  'WISE/ZELLE ACH': {
    'BILLETERAS VIRTUALES': 10,
    BANCOS: 10,
    USDT: 7,
    PAYPAL: 8,
    'USD BILLETE': 12,
    LEMON: 7,
  },
  'WISE/ZELLE ACH ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'USDT', 'PAYPAL', 'USD BILLETE', 'LEMON'],
  'USDT ENTREGA': {
    'BILLETERAS VIRTUALES': 4,
    BANCOS: 4,
    PAYPAL: 4,
    'USD BILLETE': 4,
  },
  'USDT ENTREGA ARR': ['BILLETERAS VIRTUALES', 'BANCOS', 'PAYPAL', 'USD BILLETE'],
};

// TODO: move to helper/util
function numberWithCommas(num) {
  const parts = String(num).split('.');
  return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts.length > 1 ? `.${parts[1]}` : '');
}

async function calculator(platform, currency, money) {
  const percent = PERCENT_OBJ[platform][currency];
  if (currency === 'BILLETERAS VIRTUALES' || currency === 'BANCOS') {
    return `${numberWithCommas(parseInt((((money * (100 - percent)) / 100) * await getCourseOfBlueDollar()), 10))}`;
  }
  return `${numberWithCommas((money - (money * percent) / 100).toFixed(2))}`;
}

module.exports = { calculator, PERCENT_OBJ };
