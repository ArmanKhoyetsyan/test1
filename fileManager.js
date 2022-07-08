const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadFile = async (fileUrl, fileUniqueId) => {
  const splitFileUrl = fileUrl.split('.');
  const fileFormat = splitFileUrl[splitFileUrl.length - 1];
  const fileName = `${fileUniqueId}.${fileFormat}`;
  const filePath = path.resolve(__dirname, './images', fileName);
  const writer = fs.createWriteStream(filePath);

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => new Promise((resolve, reject) => {
    // response data write in page
    response.data.pipe(writer);
    let error = null;
    writer.on('error', (err) => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve(writer.path);
      }
    });
  }));
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log('file deleted: ', filePath);
  });
};

module.exports = { downloadFile, deleteFile };
