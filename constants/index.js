const FIRST_MESSAGE = 'Hola, bienvenido a\nVirtual Exchange 22\n\nSeleccione el servicio deseado.';

const SERVICES = `
<b>1.</b> CAMBIO PAYONEER
<b>2.</b> CAMBIO CHEQUE
<b>3.</b> CAMBIO USDT
<b>4.</b> CAMBIO PAYPAL
<b>5.</b> CAMBIO SKRILL
<b>6.</b> CAMBIO WISE
<b>7.</b> CAMBIO WIRE/ACH
<b>8.</b> CAMBIO ZELLE
<b>9.</b> REFERENCIAS DE CLIENTES
<b>10.</b> VIDEOS DE CLIENTES (YOUTUBE)
`;
/* <b>8.</b> OTROS PAISES  */
/* <b>11.</b> MEDIOS DE PAGO
<b>12.</b> POLITICA DE LA EMPRESA  */

const CONFIRM_MSG = `
<b>- Presione 0 para modificar datos.</b>
<b>- Presione 1 para confirmar datos.</b>
`;

const CONFIRM_MSG_PHOTO = `
<b>- Presione 0 para modificar foto.</b>
<b>- Presione 1 para confirmar foto.</b>
`;

const COMMENT_MSG = `
<b>Si desea dejar algún comentario </b>
<b>Por favor ingréselo a continuación.</b>

<b>Para finalizar su gestión presione 1</b>
`;

const firstService = `
<b>CAMBIO PAYONEER</b>

<b>1.</b> CLIENTE NUEVO
<b>2.</b> INICIAR PROCESO DE CAMBIO
<b>3.</b> COSTOS y OPCIONES DE PAGO
<b>4.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const secondService = `
<b>CAMBIO CHEQUE</b>

<b>1.</b> CHEQUE GOOGLE
<b>2.</b> CHEQUE PAYPAL
<b>3.</b> OTROS CHEQUES

<b>0. MENU ANTERIOR </b>
`;

const thirdService = `
<b>CAMBIO PAYPAL</b>

<b>1.</b> INICIAR PROCESO DE CAMBIO
<b>2.</b> COSTOS y OPCIONES DE PAGO
<b>3.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const fourthService = `
<b>CAMBIO SKRILL</b>

<b>1.</b> CLIENTE NUEVO
<b>2.</b> INICIAR PROCESO DE CAMBIO
<b>3.</b> COSTOS y OPCIONES DE PAGO
<b>4.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const fifthService = `
<b>CAMBIO WISE</b>

<b>1.</b> CLIENTE NUEVO
<b>2.</b> INICIAR PROCESO DE CAMBIO
<b>3.</b> COSTOS y OPCIONES DE PAGO
<b>4.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const sixthService = `
<b>CAMBIO WIRE/ACH</b>

<b>1.</b> CLIENTE NUEVO
<b>2.</b> INICIAR PROCESO DE CAMBIO
<b>3.</b> COSTOS y OPCIONES DE PAGO
<b>4.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const seventhService = `
<b>CAMBIO ZELLE</b>

<b>1.</b> CLIENTE NUEVO
<b>2.</b> INICIAR PROCESO DE CAMBIO
<b>3.</b> COSTOS y OPCIONES DE PAGO
<b>4.</b> INFORMACION DEL PROCESO

<b>0. MENU ANTERIOR </b>
`;

const eighthService = `
<b>OTROS PAISES</b>

Actualmente estamos en Colombia,
Ecuardor, Peru, Costa Rica

<b>0. MENU ANTERIOR </b>
`;

const ninthService = `
<b>REFERENCIAS DE CLIENTES</b>

Por referencias sobre nuestros servicios puedes consultar nuestras redes sociales

https://m.facebook.com/pg/VirtualExchange22/reviews/?ref=page_internal

https://www.instagram.com/p/CPCNPKmMRA4/?utm_medium=copy_link

https://www.instagram.com/virtualex22colombia/

<b>0. MENU ANTERIOR </b>
`;

const tenService = `
<b>VIDEOS DE CLIENTES (YT)</b>

En esta seccion podras encontrar videos donde nuestros clientes nos recomiendan!

https://www.youtube.com/watch?v=LexkGS2Uvjg
https://www.youtube.com/watch?v=m-CRn0_DH1U
https://www.youtube.com/watch?v=nI2GuUCgVDQ
https://www.youtube.com/watch?v=QucSHMO9NGw
https://www.youtube.com/watch?v=92dxT3IIXiA
https://www.youtube.com/watch?v=LTm9ng3iUdI
https://www.youtube.com/watch?v=5zXlXckE6Hs
https://www.youtube.com/watch?v=eR0mLE9A318
https://www.youtube.com/watch?v=NGTaaDX4qK0
https://www.youtube.com/watch?v=5ixyA1f4l38
https://www.youtube.com/watch?v=NGo3txbqfWY
https://www.youtube.com/watch?v=fQG39GMwoRY
https://www.youtube.com/watch?v=FAtYS72Rcdc
https://www.youtube.com/watch?v=kAK8YVBGppk

<b>0. MENU ANTERIOR </b>
`;

const elevenService = `
<b>MEDIOS PAGOS</b>

<b>1.</b> LEMON CASH
<b>2.</b> USDT
<b>3.</b> DOLAR BILLETE
<b>4.</b> NARANJA X, PREX, YACARE
<b>5.</b> MERCADO PAGO
<b>6.</b> UALA
<b>7.</b> BANCOS
<b>8.</b> PAYPAL

<b>0. MENU ANTERIOR </b>
`;

const elevenServiceForPaypal = `
<b>MEDIOS PAGOS</b>

<b>1.</b> LEMON CASH
<b>2.</b> USDT
<b>3.</b> DOLAR BILLETE
<b>4.</b> NARANJA X, PREX, YACARE
<b>5.</b> MERCADO PAGO
<b>6.</b> UALA
<b>7.</b> BANCOS

<b>0. MENU ANTERIOR </b>
`;

const twelveService = `
<b>POLITICA DE LA EMPRESA</b>

"en construccion"

<b>0. MENU ANTERIOR </b>
`;

// const thirteenService = `
// <b>POLITICA DE LA EMPRESA</b>

// "en construccion"

// <b>0. MENU ANTERIOR </b>
// `;

const DONE_MSG = `
<b>SALUDO FINAL</b>
Se inicio el proceso de cobro.
Su pago se realizará dentro de las 72 hs hábiles. 
Gracias por elegirnos.
Virtual Exchange 22
`;

const HUMAN_CHAT_MSG = `
<b>CHAT HUMANO</b>

Haga click en el enlace para comunicarse con un representante. 

Virtual Exchange 22`;

module.exports = {
  FIRST_MESSAGE,
  SERVICES,
  firstService,
  secondService,
  thirdService,
  fourthService,
  fifthService,
  sixthService,
  seventhService,
  eighthService,
  ninthService,
  tenService,
  elevenService,
  elevenServiceForPaypal,
  twelveService,
  // thirteenService,
  HUMAN_CHAT_MSG,
  CONFIRM_MSG,
  CONFIRM_MSG_PHOTO,
  DONE_MSG,
  COMMENT_MSG,
};
