process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { userData } = require('../common/data');
const Sentry = require('./sentry');

// ** THIS IS AN ATTEMPT TO SCAN TEXT USING THE API. **

function extractTextByApi(fileName, ctx) {
  let text;
  const filePath = path.resolve(__dirname, './images', fileName);
  // eslint-disable-next-line no-console
  console.log(filePath);
  const data = new FormData();
  data.append('isOverlayRequired', 'true');
  data.append('scale', 'true');
  data.append('OCREngine', '2');
  data.append('isTable', 'true');
  data.append('file', fs.createReadStream(filePath));
  data.getLength((err, length) => {
    // eslint-disable-next-line no-console
    console.log('data.getHeaders()', length);
    const config = {
      method: 'get',
      url: 'https://api.ocr.space/parse/imageurl',
      headers: {
        apikey: 'K83011340988957',
        'Content-Length': length, // 691
      },
      data,
    };

    axios(config)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(
          '============',
          response.data.ParsedResults[0].TextOverlay.Lines,
        );

        text = response.data.ParsedResults[0].TextOverlay.Lines;
        let indexOf;
        text.forEach((el, index) => {
          if (el.LineText.includes('order')) {
            indexOf = index;
          }
        });
        const userId = ctx.message.from.id;
        // console.log(text[indexOf + 1].LineText.replace(/\s/g, '')
        // .replaceAll('*', ''), 'indexOf');
        userData[userId].checkNameSurname = text[indexOf + 1].LineText;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        Sentry.logError(error);
      });
  });
}

module.exports = { extractTextByApi };
