const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFoundError = require('../errors/notFound');
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return new BadRequest('переданы некорректные данные карточки');
      }
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return new NotFoundError('карточка не найдена.');
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return new NotFoundError('карточка не найдена.');
      }
      if (!card.owner.equals(req.user._id)) {
        return new Forbidden('Доступ запрещен');
      }
      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequest('переданы некорректные данные карточки');
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return new NotFoundError('карточка не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequest('переданы некорректные данные карточки');
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return new NotFoundError('карточка не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequest('переданы некорректные данные карточки');
      }
      return next(err);
    });
};
