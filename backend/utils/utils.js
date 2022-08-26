const { INTERNAL_SERVER_ERROR } = require('./constants');

const sendError = (
  res,
  status = INTERNAL_SERVER_ERROR,
  message = 'Непредвиденная ошибка',
) => {
  res.status(status).send({ message });
};

module.exports = {
  sendError,
};
