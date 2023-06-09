const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/notFound');

const router = express.Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
