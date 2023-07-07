require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash
    })
      .then((user) => res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new Conflict('Пользователь с таким email уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequest('переданы некорректные данные пользователя'));
        } else {
          next(err);
        }
      });
  }).catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден.');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден.');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const avatar = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password
  } = req.body;
  User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Unauthorized('пользователь не найден.');
    }
    return bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return next(new Unauthorized('пользователь не найден.'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' }
      );
      return res.send({ token });
    });
  }).catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь не найден.');
      }
      return res.send(user);
    })
    .catch(next);
};
