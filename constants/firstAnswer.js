const firstAnswer = `
<b>CLIENTE NUEVO</b>

Para Cambiar tu saldo PAYONEER deberas agregar nuestra cuenta bancaria.

Ingresa en las siguientes opciones:
"retiro", "en la cuenta bancaria", "anadir nueva cuenta", "cuentas bancarias del destinatario", "añadir cuenta bancaria"

Luego ingresa los datos que te indicamos a continuacion.


<b>. DATOS BANCARIOS</b>
Tipo de Cuenta Bancaria: Negocio
Pais: Estados Unidos
Moneda: USD

<b>. DETALLE COMERCIAL DEL DESTINATARIO</b>
Numero de Telefono: Tel:+1(415) 770-3333
Correo Electronico: virtualex22@hotmail.com
Direccion: 2011 5th ave
Ciudad/Pueblo: Oakland 
Estado: California
Codigo postal: Zip 94606
Pais: Estados Unidos
A quien pertenece la cuenta bancaria? : Empresa de logistica
Porque envia fondos a aquella cuenta? : Pagos por servicios recibidos

<b>. DETALLE DE LA CUENTA</b>
Nombre del Banco: Bank of America 
Nombre del Titular de la Cuenta:
AMP TAX BACK LLC 
Número de Cuenta: 229048959499
Numero de Ruta: Routing / Aba 063100277
Tipo de Cuenta: Business Checking

<b>. CONFIRMAR DE DETALLES DE LA CUENTA PAYONEER</b>
Fecha de Nacimiento: XX / XX / XX
Contraseña de Payoneer: XxXxXxXxX
(DATOS DE LA CUENTA PAYONER DEL CLIENTE)

<b>0. MENU ANTERIOR </b>
<b>1. INICIAR CAMBIO </b>
<b>2. CHATEA CON NOSOTROS</b>`;

const secondAnswer = `
<b>INICIAR PROCESO DE CAMBIO</b>

Haz el giro del importe que deseas desde tu cuenta PAYONEER.

Previo a realizar el pago, toma una foto como se muestra en el ejemplo y enviala por aquí.

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS </b>
`;

const thirdAnswer = `
  <b>COSTOS y OPCIONES DE PAGO</b>

  La comisión descuenta del monto enviado desde PAYONEER

  .- LEMON CASH (USDT/PESOS)

  .- BINANCE USDT

  .- DEPOSITO en PESOS en BILLETERAS VIRTUALES - (UALA, mercado pago, yacare, naranja x)

  .- DEPOSITO en PESOS en BANCOS

  .- DOLAR BILLETE, Se retira por CABA ( MINIMO 300 USD )

  Cambio DOLAR INFORMAL tipo comprador referencia ámbito financiero.
  https://www.ambito.com/contenidos/dolar-informal.html

  <b>0. MENU ANTERIOR</b>
  <b>1. INICIAR CAMBIO</b>
  <b>2. CALCULADORA</b>
`;

const fourthAnswer = `
<b>INFORMACION DEL PROCESO</b>

El servicio se realiza con retiro a cuenta de tercero, con un tiempo aprox de 24 a 48hs habiles

Debes cargar la info de nuestra cuenta

Podes guiarte de nuestro videos tutoriales en los siguientes enlaces

https://www.youtube.com/watch?v=X566VB8LxDs

<b>0. MENU ANTERIOR</b>
<b>1. INICIAR CAMBIO</b>
<b>2. CHATEA CON NOSOTROS</b>
`;

module.exports = {
  firstAnswer,
  secondAnswer,
  thirdAnswer,
  fourthAnswer,
};
