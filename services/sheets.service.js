const { google } = require('googleapis');
const path = require('path');
const {
  getCurrentMonth,
  formatDateForDailySheet,
  getPreviousMonth,
} = require('../utils/helper');
const { PERCENT_OBJ } = require('../common/calculator');
const Sentry = require('../utils/sentry');
const { SENT_TO_USER_MSG } = require('../constants/sendTelegramMSG');
const { sendTelegramMsg } = require('./bot.service');
const { getUserIdsByUserName } = require('./user.service');
const { scheduleFeedbackMsg } = require('../bull');

let commissionIndex = 6;
let netUsdIndex = 7;

const filePath = path.resolve(
  __dirname,
  '../google_sheets',
  'credentials.json',
);

const auth = new google.auth.GoogleAuth({
  keyFile: filePath,
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

async function connectSheet() {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });
  return googleSheets;
}

async function gatSheetIDByName(sheetName) {
  try {
    const googleSheets = await connectSheet();
    const request = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      ranges: [sheetName],
      includeGridData: false,
      auth,
    };

    const res = await googleSheets.spreadsheets.get(request);
    return Number(res?.data?.sheets?.[0]?.properties?.sheetId);
  } catch (error) {
    Sentry.logError(`Error get sheetId ${error}`);
  }
  return '';
}

async function clearSheet(sheetName, startRowIndex = 0) {
  const sheetId = await gatSheetIDByName(sheetName);
  const googleSheets = await connectSheet();
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: process.env.SPREADSHEET_ID,

    resource: {
      // The DataFilters used to determine which ranges to clear.
      dataFilters: [
        {
          gridRange: {
            sheetId,
            startRowIndex,
          },
        },
      ],
    },

    auth,
  };

  try {
    const response = (
      await googleSheets.spreadsheets.values.batchClearByDataFilter(request)
    ).data;
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    Sentry.logError(err);
  }
}

async function renameSheet(sheetId, title) {
  const googleSheets = await connectSheet();
  await googleSheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SPREADSHEET_ID,
    requestBody: {
      requests: {
        updateSheetProperties: {
          properties: {
            sheetId,
            index: 1,
            title,
          },
          fields: 'index,title',
        },
      },
    },
  });
}

async function copySheet(sheetId) {
  const googleSheets = await connectSheet();
  const request = {
    // The ID of the spreadsheet containing the sheet to copy.
    spreadsheetId: process.env.SPREADSHEET_ID,

    // The ID of the sheet to copy.
    sheetId,

    resource: {
      // The ID of the spreadsheet to copy the sheet to.
      destinationSpreadsheetId: process.env.SPREADSHEET_ID,
    },

    auth,
  };

  try {
    const response = (await googleSheets.spreadsheets.sheets.copyTo(request))
      .data;
    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    Sentry.logError(err);
  }
  return '';
}

async function getSheetsNames() {
  const googleSheets = await connectSheet();
  let sheetsName = await googleSheets.spreadsheets.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
  });
  sheetsName = sheetsName.data.sheets.map((el) => el.properties.title);
  return sheetsName;
}

function batchUpdate(sheets, request) {
  return new Promise((res, rej) => {
    sheets.spreadsheets.batchUpdate(request, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        Sentry.logError(err);
        rej(err);
      } else {
        // eslint-disable-next-line no-console
        console.log('Created sheet.');
        Sentry.logError('Created sheet.');
        res();
      }
    });
  });
}

async function copySheetAndRename(sheetName, newSheetName) {
  try {
    const sheetNames = await getSheetsNames();
    if (!sheetNames.includes(newSheetName)) {
      const sheetNameID = await gatSheetIDByName(sheetName);
      const { sheetId: newSheetNameID } = await copySheet(sheetNameID);
      await renameSheet(newSheetNameID, newSheetName);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
}

async function createMonthlySheet(sheetTitle) {
  const isExistDaySheet = (await getSheetsNames()).includes(sheetTitle);

  if (isExistDaySheet) {
    return false;
  }
  try {
    const previousMonth = getPreviousMonth();
    await copySheetAndRename(previousMonth, sheetTitle);
    await clearSheet(sheetTitle, 2);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
  return '';
  // const request = {
  //   spreadsheetId: process.env.SPREADSHEET_ID,
  //   resource: {
  //     requests: [
  //       {
  //         addSheet: {
  //           // Add properties for the new sheet
  //           properties: {
  //             // "sheetId": number,
  //             title: sheetTitle,
  //             // "index": number,
  //             // "sheetType": enum(SheetType),
  //             // "gridProperties": {
  //             //     object(GridProperties)
  //             // },
  //             // "hidden": boolean,
  //             // "tabColor": {
  //             //     object(Color)
  //             // },
  //             // "rightToLeft": boolean
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };

  // const resources = {
  //   auth,
  //   spreadsheetId: process.env.SPREADSHEET_ID,
  //   resource: {
  //     valueInputOption: 'RAW',
  //     data: [
  //       // {
  //       //   range: 'MAYO!A5', // Update single cell
  //       //   values: [['A5']],
  //       // },
  //       // {
  //       //   range: 'Sheet1!B4:B6', // Update a column
  //       //   values: [['B4'], ['B5'], ['B6']],
  //       // },
  //       {
  //         range: `${sheetTitle}!A1`, // Update a row
  //         values: [['FECHA', '', '', '', 'VENTAS CHEQUE', '', '', '', '', 'en espera', 'error']],
  //       },
  //       {
  //         range: `${sheetTitle}!A2`, // Update a row
  //         values: [['FECHA', 'MONTO CHEQUE', 'CLIENTE'
  // , '', 'CANAL Y2', 'COMI EN U$D', 'SALDO USD', 'USD',
  // 'PESOS A PAG', 'DEPOSITO', 'PAGADO', '', 'IS BOT?']],
  //       },
  //       // {
  //       //   range: 'Sheet1!F5:H6', // Update a 2d range
  //       //   values: [['F5', 'F5'], ['H6', 'H6']],
  //       // },
  //     ],
  //   },
  // };

  // await batchUpdate(sheets, request);
  // sheets.spreadsheets.values.batchUpdate(resources);
  // return true;
}

async function createEmptySheet(sheetTitle) {
  const sheets = google.sheets({ version: 'v4', auth });
  const isExistDaySheet = (await getSheetsNames()).includes(sheetTitle);

  if (isExistDaySheet) {
    return false;
  }

  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    resource: {
      requests: [
        {
          addSheet: {
            // Add properties for the new sheet
            properties: {
              // "sheetId": number,
              title: sheetTitle,
              // "index": number,
              // "sheetType": enum(SheetType),
              // "gridProperties": {
              //     object(GridProperties)
              // },
              // "hidden": boolean,
              // "tabColor": {
              //     object(Color)
              // },
              // "rightToLeft": boolean
            },
          },
        },
      ],
    },
  };

  await batchUpdate(sheets, request);
  return true;
}

async function appendRowsToMonthlySheet(arr, callback = () => '') {
  const month = getCurrentMonth();
  const googleSheets = await connectSheet();
  await createMonthlySheet(month);
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${month}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [arr],
    },
  });
  await callback();
}

async function appendRowsToSheet(arr, sheetName, rangeNumber) {
  const googleSheets = await connectSheet();
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: rangeNumber ? `${sheetName}!${rangeNumber}` : `${sheetName}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: arr,
    },
  });
}

async function getSpreadsheet(sheetName) {
  const isExistDaySheet = (await getSheetsNames()).includes(getCurrentMonth());
  if (!isExistDaySheet) {
    return [[], []];
  }
  const googleSheets = await connectSheet();
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: sheetName,
  });
  return getRows.data.values;
}
async function getSpreadsheetColumn(sheetName, range = '') {
  const isExistDaySheet = (await getSheetsNames()).includes(getCurrentMonth());
  if (!isExistDaySheet) {
    return [[], []];
  }
  const googleSheets = await connectSheet();
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName + range}`,
    majorDimension: 'COLUMNS',
  });
  return getRows.data.values;
}

async function updateValues(name, range, values) {
  try {
    const googleSheets = await connectSheet();
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${name}!${range}`,
      valueInputOption: 'USER_ENTERED',
      auth,
      requestBody: {
        values,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
}

const sendPaymentInfo = async (date) => {
  try {
    const dataInSheet = await getSpreadsheetColumn(
      date,
      '!B:E',
    );
    let paymentInfoUser = '';
    for (let i = 3; i < dataInSheet[0].length + 2; i += 10) {
      if (dataInSheet[0][i] && dataInSheet?.[3]?.[i + 9] !== SENT_TO_USER_MSG) {
        // eslint-disable-next-line no-await-in-loop
        const id = await getUserIdsByUserName(dataInSheet?.[0]?.[i]);
        for (let index = i + 3; index < i + 8; index += 1) {
          paymentInfoUser += `<b>${dataInSheet?.[0]?.[index] || ''}${
            dataInSheet?.[1]?.[index] || ''
          }${dataInSheet?.[2]?.[index] || ''}</b> \n`;
        }
        // eslint-disable-next-line no-await-in-loop
        await sendTelegramMsg(id, paymentInfoUser);
        scheduleFeedbackMsg(date, id);
        updateValues(date, `E${i + 10}`, [
          [SENT_TO_USER_MSG],
        ]);
        paymentInfoUser = '';
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
};

// *** FORMATTING DATA FOR DAILY SHEET ***

const firstDataForSheetArr = (name, checkSum, percent, lgt) => [
  ['1', name, '', '', ''],
  ['', 'Le paso la Liquidacion', '', '', ''],
  ['', '', '', '', ''],
  ['', 'Importe  USD', '', checkSum, ''],
  [
    '',
    'comision ',
    percent,
    `=D${lgt + commissionIndex - 2} * C${lgt + netUsdIndex - 2}`,
    '',
  ],
  [
    '',
    'Neto USD',
    '',
    `=D${lgt + commissionIndex - 2} - (D${lgt + commissionIndex - 2} * C${
      lgt + netUsdIndex - 2
    })`,
    '',
  ],
  ['', 'cotizacion peso ', '', '=F2', ''],
  [
    '',
    'Total a pagar ',
    '',
    `=F2 * (D${lgt + commissionIndex - 2} - (D${lgt + commissionIndex - 2} * C${
      lgt + netUsdIndex - 2
    }))`,
    '',
  ],
];

const dataForSheetArr = (name, checkSum, percent, lgt) => [
  [`${Math.ceil(lgt / 10)}`, name, '', '', ''],
  ['', 'Le paso la Liquidacion', '', '', ''],
  ['', '', '', '', ''],
  ['', 'Importe  USD', '', checkSum, ''],
  [
    '',
    'comision ',
    percent,
    `=D${lgt + commissionIndex} * C${lgt + netUsdIndex}`,
    '',
  ],
  [
    '',
    'Neto USD',
    '',
    `=D${lgt + commissionIndex} - (D${lgt + commissionIndex} * C${
      lgt + netUsdIndex
    })`,
    '',
  ],
  ['', 'cotizacion peso ', '', '=F2', ''],
  [
    '',
    'Total a pagar ',
    '',
    `=F2 * (D${lgt + commissionIndex} - (D${lgt + commissionIndex} * C${
      lgt + netUsdIndex
    }))`,
    '',
  ],
];

// ***  ***

async function addDataToSheets(userData, state) {
  const sheetNames = await getSheetsNames();
  const dailySheetName = formatDateForDailySheet();

  if (!sheetNames.includes(dailySheetName)) {
    await copySheetAndRename('AUTO LI', dailySheetName);
    await clearSheet(dailySheetName, 3);
  }

  const stateDataKeys = Object.keys(state);
  const checkSum = userData.sumInCheck;
  const percent = (PERCENT_OBJ?.[userData.paymentService]?.[userData.paymentMethod] || 100)
    / 100;
  const dataSheetData = await getSpreadsheet(formatDateForDailySheet());

  function addingDescriptionsToTheTable(arr) {
    let i = 0;
    arr.forEach((element, index) => {
      switch (index) {
        case 0:
          element.push('PAYMANT SERVICE');
          element.push(userData.paymentService);
          break;
        case 1:
          element.push('PAYMENT METHOD');
          element.push(userData.paymentMethod);
          break;
        default:
          if (stateDataKeys[i]) {
            element.push(stateDataKeys[i]);
            element.push(state?.[stateDataKeys[i]]);
          }
          i += 1;
          break;
      }
    });
    arr[arr.length - 1].push(
      `=ОКРУГЛ(F2 * (D${dataSheetData.length + commissionIndex} - (D${
        dataSheetData.length + commissionIndex
      } * C${dataSheetData.length + netUsdIndex})), 2)`,
    );
    const emptyStringArr = [];
    switch (userData.paymentMethod) {
      case 'BILLETERAS VIRTUALES':
      case 'MERCADO PAGO':
        emptyStringArr.length = 2;
        break;
      case 'UALA':
        emptyStringArr.length = 3;
        break;
      case 'BANCOS':
        emptyStringArr.length = 4;
        break;
      case 'USD BILLETE':
        emptyStringArr.length = 5;
        break;
      case 'LEMON':
      case 'USDT':
        emptyStringArr.length = 6;
        break;
      case 'PAYPAL':
        emptyStringArr.length = 7;
        break;
      default:
        break;
    }
    emptyStringArr.fill('');
    arr[arr.length - 1].push(
      ...emptyStringArr,
      `=ОКРУГЛ(F2 * (D${dataSheetData.length + commissionIndex} - (D${
        dataSheetData.length + commissionIndex
      } * C${dataSheetData.length + netUsdIndex})), 2)`,
    );
  }

  const name = userData.userName;
  try {
    // *** IF 'dataSheetData.length < 10' THEN THIS IS THE FIRST USER ON THE SHEET ***
    if (dataSheetData.length < 10) {
      const firstDataForSheet = firstDataForSheetArr(
        name,
        checkSum,
        percent,
        dataSheetData.length,
      );
      addingDescriptionsToTheTable(firstDataForSheet);
      await appendRowsToSheet(
        firstDataForSheet,
        formatDateForDailySheet(),
        'A4',
      );
    } else {
      // *** IF THIS BLOCK IS OCCUPIED WRITE NOT THE FOLLOWING ***
      const addInPosition = dataSheetData.length
        - (dataSheetData.length % 10)
        + (dataSheetData.length % 10 < 4 ? 4 : 14);
      if (dataSheetData.length > 10) {
        commissionIndex = addInPosition + 3 - dataSheetData.length;
        netUsdIndex = addInPosition + 4 - dataSheetData.length;
      }

      const dataForSheet = dataForSheetArr(
        name,
        checkSum,
        percent,
        dataSheetData.length,
      );
      addingDescriptionsToTheTable(dataForSheet);
      await appendRowsToSheet(
        dataForSheet,
        formatDateForDailySheet(),
        `A${addInPosition}`,
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
}

module.exports = {
  appendRowsToMonthlySheet,
  getSpreadsheet,
  appendRowsToSheet,
  createMonthlySheet,
  createEmptySheet,
  copySheet,
  renameSheet,
  gatSheetIDByName,
  copySheetAndRename,
  clearSheet,
  sendPaymentInfo,
  getSpreadsheetColumn,
  getSheetsNames,
  addDataToSheets,
  updateValues,
};
