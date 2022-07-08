const fs = require('fs');
const request = require('request');
const path = require('path');
const { default: axios } = require('axios');
const { userData } = require('./data');
const Sentry = require('../utils/sentry');

function changeValuePhotoCount(number, ctx) {
  const userId = ctx.message.from.id;
  userData[userId].photoNameCount = number;
}

const getImageFullName = (imageName, imagePath, userId) => {
  const getArray = imagePath.split('.');
  const imageExtensions = getArray[getArray.length - 1];
  // eslint-disable-next-line no-param-reassign
  imageName += imageExtensions;
  userData[userId].imagesNameArray.push(imageName);
  return imageName;
};

const getPhotoData = async (ctx, botToken) => {
  const photosArray = ctx.message.photo;
  const photoId = photosArray[photosArray.length - 1].file_id;
  const url = `https://api.telegram.org/bot${botToken}/getFile?file_id=${photoId}`;
  const { data } = await axios.get(url);
  return data;
};

const createPhoto = (botToken, imagePath, imageName, extractTextByVision, ctx) => {
  const imageUrl = `https://api.telegram.org/file/bot${botToken}/${imagePath}`;
  const filePath = path.resolve(__dirname, '../images', imageName);
  request(imageUrl)
    .pipe(fs.createWriteStream(filePath))
    .on('close', () => {
      // eslint-disable-next-line no-console
      console.log('Save photo: ', filePath);
      extractTextByVision(imageName, ctx);
    });
};

const savePhoto = async (ctx, extractTextByVision = () => {}) => {
  try {
    const userId = ctx.message.from.id;
    userData[userId].photoNameCount += 1;
    let imageName = `check${userData[userId].photoNameCount}-${userId}.`;
    const botToken = ctx.tg.token;
    const data = await getPhotoData(ctx, botToken);
    const imagePath = data.result.file_path;
    imageName = getImageFullName(imageName, imagePath, userId);
    createPhoto(botToken, imagePath, imageName, extractTextByVision, ctx);
    return imageName;
  } catch (err) {
    Sentry.logError(err);
  }
  return '';
};

module.exports = {
  savePhoto,
  changeValuePhotoCount,
};
