// models/user.js
const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const { REGEX } = require('../middlewares/validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => REGEX.test(v),
      message: 'Некорректный Url',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неверный формат почты',
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
