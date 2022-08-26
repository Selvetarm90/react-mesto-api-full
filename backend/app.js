const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found');
const { handleError } = require('./utils/handleError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} : ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });
  console.log('db connect');
};

main().catch((err) => {
  console.log(err);
});

app.use(userRouter);
app.use(auth);
app.use(cardRouter);
app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`app listening on PORT ${PORT}`);
});
