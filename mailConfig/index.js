const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { userData } = require('../common/data');
const { getCourseOfBlueDollar } = require('../common/blue-dollar');
const { PERCENT_OBJ } = require('../common/calculator');
const { getCurrentMonth, getFormattedDate, formatDateForDailySheet } = require('../utils/helper');
const {
  appendRowsToMonthlySheet, getSpreadsheet, updateValues, getSpreadsheetColumn,
} = require('../services/sheets.service');
const Sentry = require('../utils/sentry');

const transportGmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'armankostandyan.w@gmail.com',
    pass: process.env.GMAIL_PASS,
  },
});

const addPhotos = (imagesNameArray, option) => {
  if (imagesNameArray) {
    const attachments = imagesNameArray.map((name, index) => {
      const filePath = path.resolve(__dirname, '../images', name);
      return {
        filename: name,
        path: filePath,
        cid: index + name,
      };
    });
    // eslint-disable-next-line no-param-reassign
    option.attachments = attachments;
  }
  return option;
};

const mailOptions = (subject, text, imagesNameArray) => {
  let option = {
    from: 'armankostandyan.w@gmail.com',
    to: process.env.RECEIVER_EMAIL,
    subject,
    html: text,
  };

  option = addPhotos(imagesNameArray, option);

  return option;
};

const deletePhotos = (imagesNameArray, userId) => {
  if (imagesNameArray.length) {
    imagesNameArray.forEach((name) => {
      const filePath = path.resolve(__dirname, '../images', name);
      fs.unlink(filePath, (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        Sentry.logError(err);
      });
    });
    // delete data for user
    userData[userId] = null;
  }
};

const sendMailMessage = (subject, text, userId, callback) => {
  try {
    let imagesNameArray = [];

    if (userData[userId]) {
      imagesNameArray = userData[userId]?.imagesNameArray;
    }

    if (text) {
      transportGmail.sendMail(
        mailOptions(subject, text, imagesNameArray),
        async (err) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            Sentry.logError(err);
          } else {
            const blueDollar = await getCourseOfBlueDollar();
            const lastRow = await getSpreadsheet(getCurrentMonth());
            const dataForSheet = getFormattedDate();
            const { paymentService, paymentMethod } = userData[userId];
            const percent = PERCENT_OBJ?.[paymentService]?.[paymentMethod];
            const username = userData[userId]?.userName;
            await appendRowsToMonthlySheet(
              [
                dataForSheet,
                userData[userId]?.sumInCheck,
                userData[userId]?.checkNumber,
                username,
                percent / 100,
                userData[userId]?.link !== '1' ? userData[userId]?.link : paymentService,
                `=B${lastRow.length + 1}*E${lastRow.length + 1}`,
                `=B${lastRow.length + 1}*(1-E${lastRow.length + 1})`,
                blueDollar,
                `=H${lastRow.length + 1}*I${lastRow.length + 1}`,
                userData[userId]?.paymentMethod,
                '',
                '',
                'YES',
              ],
              callback,
            );
            const sheetTitle = formatDateForDailySheet();
            const dataInSheet = await getSpreadsheetColumn(sheetTitle, '!B:B');
            await updateValues(sheetTitle, `E${dataInSheet[0].length}`, [[userData?.[userId]?.checkNumber]]);
            // eslint-disable-next-line no-console
            console.log('Mail info: Success');
            deletePhotos(imagesNameArray, userId);
          }
        },
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    Sentry.logError(error);
  }
};

module.exports = { sendMailMessage };
