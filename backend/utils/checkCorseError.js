// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto.paramonov.nomoredomains.sbs',
  'http://mesto.paramonov.nomoredomains.sbs',
  'https://mesto.paramonov.nomoredomains.sbs/signin',
  'http://mesto.paramonov.nomoredomains.sbs/signin',
  'https://mesto.paramonov.nomoredomains.sbs/signup',
  'http://mesto.paramonov.nomoredomains.sbs/signup',
  'localhost:3000',
];
// eslint-disable-next-line consistent-return
module.exports.checkCorseError = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    return res.end();
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  next();
};
