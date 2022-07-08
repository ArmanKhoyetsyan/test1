const { userData } = require('./data');

const createMessageForEmail = (
  ctx,
  firstName,
  lastName,
  username,
  description,
) => {
  const data = ctx.wizard.state;
  const userId = ctx.message.from.id;
  let link;
  let path;
  let comment;
  if (userData[userId]) {
    link = userData[userId]?.link;
    path = userData[userId]?.path;
    comment = userData[userId]?.comment;
  }
  let text = `
      <p><b>${description || ''}<b></p>

      <p><b>Full Name: ${firstName || ''} ${lastName || ''}</p>
      <p><b>Telegram username:</b> ${username ? `@${username}` : 'vacío'}</p>
      ${username ? `<p><b>User Telegram:</b> https://t.me/${username}</p>` : ''}
      <p><b>Telegram ID</b>: ${userId}</p>
      <p><b>Enviar datos de:</b> ${path || 'vacío'}</p>
      <p><b>Enlace</b>: ${link || 'vacío'}</p>
      ${comment ? `<p><b>Comentario</b> ${comment}</p>` : ''}
      `;
  Object.keys(data).map((el) => {
    text = text.concat(`<p><b>${el.toLocaleUpperCase()}:</b> ${data[el] || 'vacío'}</p>`);
    return '';
  });
  return text;
};

module.exports = {
  createMessageForEmail,
};
