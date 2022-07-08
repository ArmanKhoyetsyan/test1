const firstAnswer = `
<b>MEDIOS DE PAGO</b>

"Copia y pega los datos requeridos"

Los pagos en LEMON se realizan en criptomoneda, USDT (tether)

Envianos la direccion de tu billetera y la red a la que pertenece

RED
DIRECCION

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const secondAnswer = `
<b>USDT</b>

Envianos la direccion de tu billetera y la red a la que pertenece

RED
DIRECCION

"valores minimos de envio por cada red"
RED BEP20 —> mínimo 125usdt
RED TRC20 —> mínimo 10usdt

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const thirdAnswer = `
<b>DÓLAR BILLETE - MINIMO 300usd</b>

Envianos estos datos de la persona que retira el pago

NOMBRE:
N° DNI:

Junto con la liquidacion te enviaremos la direccion de retiro del pago. Gracias.

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const fourthAnswer = `
<b>COPIA, PEGA Y COMPLETA TUS DATOS.</b>

•[ Depósito en Naranja X, Prex ]
-Nombre de la plataforma:
-Nombre completo:
-Dni:
-CVU:
-Alias:

•[ Depósito en Yacare ] [LIMITE $50.000 MENSUAL]
-Nombre de la plataforma:
-Nombre completo:
-Dni:
-CVU:
-Alias:

estamos procesando tu información en breve nos contactaremos contigo. 

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
<b>2. DEPOSITO EN NARANJA X, PRE</b>
<b>3. DEPOSITO EN YACARE</b>
`;

const fifthAnswer = `
<b>MERCADO PAGO</b>

•[ Depósitos en Mercado Pago ] [LIMITE $50.000 MENSUAL]
-Nombre completo:
-CVU:
-Alias:
-Código para ingresar dinero en efectivo:

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const sixthAnswer = `
<b>UALA</b>
•[ Depósito en Ualá ]
.Nombre completo:
.Dni:
.CVU:
.Alias:

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const seventhAnswer = `
<b>BANCOS</b>

<b>*Bancos solamente BBVA, Macro, ICBC, Galicia, HSBC, Santander y Patagonia</b>

•[ Depósitos en Bancos “72hs” ]
-Nombre del Banco:
-Nombre del titular de la cuenta:
-Número de cuenta:
-CBU:
-Alias:

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

const eightAnswer = `
<b>PAYPAL</b>

•[ PAYPAL ]
-Titular cuenta:
-Mail paypal:

<b>0. MENU ANTERIOR</b>
<b>1. CHATEA CON NOSOTROS</b>
`;

module.exports = {
  firstAnswer,
  secondAnswer,
  thirdAnswer,
  fourthAnswer,
  fifthAnswer,
  sixthAnswer,
  seventhAnswer,
  eightAnswer,
};
