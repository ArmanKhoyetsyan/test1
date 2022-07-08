const Tesseract = require('tesseract.js');
const vision = require('@google-cloud/vision');

const path = require('path');
const { userData } = require('../common/data');

const extractText = async (imagePath) => {
  let extractedText = 'Empty';

  await Tesseract.recognize(imagePath, 'eng', {
    // eslint-disable-next-line no-console
    logger: (m) => console.log(m),
  }).then(({ data: { text } }) => {
    extractedText = text;
  });
  return extractedText;
};

const client = new vision.ImageAnnotatorClient();

async function extractTextByVision(fileName, ctx) {
  const filePath = path.resolve(__dirname, '../images', fileName);
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations;

  let many;
  let checkNumber;
  // *** We delete the first element because it has all the text,
  //  and we need it separately by words. ***
  detections.shift();
  detections.forEach((text, i) => {
    if (text.description.includes('.') && !many) {
      many = detections[i].description;
      while (!Number(many[many.length - 1]) && many.length !== 0) {
        many = many.substring(0, many.length - 1);
      }
    }
    if (Number(text.description) && text.description.length === 9 && !checkNumber && detections?.[i - 1].description !== 'ABA') {
      checkNumber = text.description;
    }
  });
  const userId = ctx.message.from.id;
  userData[userId].sumInCheck = many;
  userData[userId].checkNumber = checkNumber;
  return '';
}

module.exports = { extractText, extractTextByVision };
