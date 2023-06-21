const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const defaultError = require('./errors/defaultError');
const { REGEX } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
}), createUser);
app.use(auth);
app.use(router);
app.use(defaultError);
app.listen(PORT, () => {
  console.log('Сервер запущен');
});
